const path = require('path')
const { app, BrowserWindow } = require('electron')

if (require('electron-squirrel-startup')) {
	app.quit()
}

function createWindow() {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
        show: false,
		webPreferences: {
			// preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			webSecurity: false
		}
	})
    mainWindow.maximize()
    mainWindow.show()

	if (process.env.IS_DEV === 'true') {
		mainWindow.loadURL('http://localhost:9696')
		// mainWindow.webContents.openDevTools()
	} else {
		mainWindow.removeMenu()
		mainWindow.loadFile(path.join(__dirname, '../dist/', 'index.html'))
	}
}

app.whenReady().then(() => {
	require('./server')
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
