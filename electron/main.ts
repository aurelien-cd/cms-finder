import path from 'node:path'
import process from 'node:process'
import { BrowserWindow, app, ipcMain, nativeTheme } from 'electron'


// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js
// │ ├─┬ preload
// │ │ └── index.js
// │ ├─┬ renderer
// │ │ └── index.html

process.env.ROOT = path.join(__dirname, '..')
process.env.DIST = path.join(process.env.ROOT, 'dist-electron')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.ROOT, 'public')
  : path.join(process.env.ROOT, '.output/public')
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

let win: BrowserWindow
let printerWindow: BrowserWindow
const preload = path.join(process.env.DIST, 'preload.js')

const Store = require('electron-store')
const { autoUpdater } = require("electron-updater")


const store = new Store()

async function bootstrap() {
  win = new BrowserWindow({
    width: 1280,
    height: 728,
    resizable: true,
    fullscreenable: true,
    webPreferences: {
      preload,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools({ mode: 'right' })
  }
  else {
    win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'))
  }

  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  printerWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  // const printerUrl = process.env.NODE_ENV === 'development'
  // ? `http://localhost:9080/static/print-stickers.html`
  // : `file://${__dirname}/static/print-stickers.html`

  // console.log(`file://${__dirname}/static/print-stickers.html`)

  printerWindow.loadFile(`${__dirname}/../static/print-stickers.html`);
  printerWindow.webContents.openDevTools();

  ipcMain.handle("printStickers", (event, content) => {
    printerWindow.webContents.send("printStickers", JSON.parse(content));
  })

  ipcMain.handle("readyToPrintPDF", async (event) => {
    // check if at-least 1 printer is connected
    let printers = await printerWindow.webContents.getPrintersAsync();
    // send the command to print the content
    if (printers != null && printers.length > 0) {
      printerWindow.webContents.print({
        printBackground: true,
        pageSize: 'A4',
        silent: false,
      }, (success) => {
          win.webContents.send('printCompleted', success);
        })
      } else {
        win.webContents.send('printCompleted', false);
      }
  });

  ipcMain.handle('getStoreValue', (event, key) => {
    return store.get(key)
  })

  ipcMain.handle('setStoreValue', (event, key, value) => {
    return store.set(key, value)
  })

  ipcMain.handle('restart_app', () => {
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on('update-available', () => {
    win.webContents.send('update_available');
  });

  autoUpdater.on('download-progress', (progressObj) => {
    win.webContents.send('download_progress', progressObj);
  });

  autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update_downloaded');
  });

  require('@electron/remote/main').initialize();
  require("@electron/remote/main").enable(win.webContents);
}

app.whenReady().then(bootstrap)
