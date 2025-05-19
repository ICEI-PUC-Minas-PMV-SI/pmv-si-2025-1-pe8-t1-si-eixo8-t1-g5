const getIsOsDark = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

const getIsDark = () => {
  const themeSet = window.localStorage.getItem('appTheme')
  return !themeSet ? getIsOsDark() : themeSet === 'dark'
}

const setIsDark = (isDark: boolean) => {
  const darkLiteral = isDark ? 'dark' : 'light'
  window.localStorage.setItem('appTheme', darkLiteral)
  
  // Verificar se a API electron está disponível antes de usá-la
  if (window.electron && window.electron.ipcRenderer) {
    try {
      window.electron.ipcRenderer.sendMessage('theme', [darkLiteral])
    } catch (error) {
      console.error('Erro ao enviar mensagem para o Electron:', error)
    }
  }
  
  if (isDark) {
    window.document.documentElement.classList.add('dark')
  } else {
    window.document.documentElement.classList.remove('dark')
  }
}

const toggleTheme = () => {
  setIsDark(!getIsDark())
}

const firstRun = () => {
  try {
    setIsDark(getIsDark())
  } catch (error) {
    console.error('Erro ao inicializar o tema:', error)
    // Fallback para tema claro se houver erro
    window.document.documentElement.classList.remove('dark')
  }
}

export { toggleTheme, setIsDark, firstRun }