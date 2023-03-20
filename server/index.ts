const path = require('path')
const { app, BrowserWindow } = require('electron')
require('./server')

if (require('electron-squirrel-startup')) {
	app.quit()
}

function createWindow() {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			// preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			webSecurity: false
		}
	})

	if (process.env.IS_DEV === 'true') {
		mainWindow.loadURL('http://localhost:9696')
		// mainWindow.webContents.openDevTools()
	} else {
		mainWindow.removeMenu()
		mainWindow.loadFile(path.join(__dirname, '../dist/', 'index.html'))
	}
}

app.whenReady().then(() => {

	createWindow()
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
