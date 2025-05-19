import { app, BrowserWindow, shell, ipcMain, nativeTheme, dialog } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import { addProtocols } from './protocols'
import * as fs from 'node:fs'


// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Sogrinha - Gestão de Contratos',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    width: 1920,
    height: 1080,
    webPreferences: {
      preload,
      webSecurity: true,
      contextIsolation: true,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
    // Adicionar esta linha para abrir DevTools na versão em produção também
    // win.webContents.openDevTools()
  }

  // Make all links open with the browser, not with the application
  // win.webContents.setWindowOpenHandler(({ url }) => {
  //   if (url.startsWith('https:')) shell.openExternal(url)
  //   return { action: 'deny' }
  // })
}

app.whenReady().then(() => {
  addProtocols()
  ipcMain.on('test', (e, args) => {
    console.log(args)
    e.reply('test', 'This is my response to test')
  })
  ipcMain.on('theme', (_ev, args) => {
    const requestedTheme = (args as string[])[0] === 'dark'
    nativeTheme.themeSource = requestedTheme ? 'dark' : 'light'
  })
  
  // Handler para salvar arquivos
  ipcMain.handle('save-file', async (_, args) => {
    try {
      const { buffer, defaultPath, filters } = args;
      
      // Abrir diálogo para escolher onde salvar
      const { canceled, filePath } = await dialog.showSaveDialog({
        defaultPath,
        filters: filters || [
          { name: 'Documentos', extensions: ['docx', 'pdf'] },
        ]
      });
      
      if (!canceled && filePath) {
        // Converter o buffer para Uint8Array
        const bufferData = Buffer.from(buffer);
        // Salvar o arquivo
        fs.writeFileSync(filePath, bufferData);
        return { success: true, filePath };
      }
      
      return { success: false, reason: 'cancelled' };
    } catch (error: any) {
      console.error('Erro ao salvar arquivo:', error);
      return { success: false, reason: 'error', message: error.message || 'Erro desconhecido' };
    }
  });
  
  createWindow()

  if (win) win.menuBarVisible = false
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
// ipcMain.handle('open-win', (_, arg) => {
//   const childWindow = new BrowserWindow({
//     webPreferences: {
//       preload,
//       nodeIntegration: true,
//       contextIsolation: false,
//     },
//   })

//   if (process.env.VITE_DEV_SERVER_URL) {
//     childWindow.loadURL(`${url}#${arg}`)
//   } else {
//     childWindow.loadFile(indexHtml, { hash: arg })
//   }
// })
