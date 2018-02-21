const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
let mainWindow;

const Menu = electron.Menu;

function createWindow () {
  mainWindow = new BrowserWindow({width: 1200, height: 800});

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  //mainWindow.openDevTools();
  mainWindow.setMenu(null);

  mainWindow.webContents.on('context-menu', (e, props) => {
    const { x, y } = props;

    Menu.buildFromTemplate([{
      label: 'Inspect element',
      click() {
        mainWindow.inspectElement(x, y);
      }
    }]).popup(mainWindow);
  });

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}


app.disableHardwareAcceleration();

// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});

const sendResponse = (success) => {
  mainWindow.webContents.send('auth-response', success ? success : '');
};

app.on('open-url', function (e, url) {
  sendResponse(url);
});

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  const uri = commandLine[commandLine.length - 1];
  if (commandLine.length >= 2 && uri) {
    sendResponse(uri);
  }
  
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus()
  }
});

if (shouldQuit) {
  app.quit()
}
