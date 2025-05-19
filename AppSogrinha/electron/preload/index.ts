import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { Channels } from '../types/types'


const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args)
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args)
      ipcRenderer.on(channel, subscription)

      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args))
    },
  },
  saveFile: (buffer: ArrayBuffer, defaultPath: string, filters?: Array<{name: string, extensions: string[]}>) => {
    return ipcRenderer.invoke('save-file', { buffer, defaultPath, filters })
  }
}

contextBridge.exposeInMainWorld('electron', electronHandler)
