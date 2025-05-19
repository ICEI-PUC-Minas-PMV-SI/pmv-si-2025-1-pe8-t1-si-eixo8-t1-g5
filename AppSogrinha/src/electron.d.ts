interface IElectronAPI {
  ipcRenderer: {
    sendMessage(channel: string, args: unknown[]): void;
    on(channel: string, func: (...args: unknown[]) => void): void;
    once(channel: string, func: (...args: unknown[]) => void): void;
  };
  saveFile(buffer: ArrayBuffer | SharedArrayBuffer, defaultPath: string, filters?: Array<{name: string, extensions: string[]}>): Promise<{
    success: boolean;
    filePath?: string;
    reason?: string;
    message?: string;
  }>;
}

declare interface Window {
  electron: IElectronAPI;
} 