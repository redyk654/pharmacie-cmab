const { app, net, BrowserWindow } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const { autoUpdater } = require('electron-updater')

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 670,
    minWidth: 1100,
    minHeight: 520,
    icon: path.join(__dirname, '../build/pharmacie_icon.ico'),
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadURL(
      isDev ? 'http:localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
    )

    // win.setMenuBarVisibility(false)
    // win.removeMenu()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

autoUpdater.autoDownload = false;
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'redyk654',
  repo: 'https://github.com/redyk654/pharmacie-cmab',
  // La valeur de la propriété `private` doit être `true` si votre référentiel Github est privé.
  private: false
});

const feedUrlReader = net.request(autoUpdater.getFeedURL(), {
  method: 'GET'
});

feedUrlReader.on('response', response => {
  let errorMessage;
  if (response.statusCode === 200) {
    response.on('error', error => {
      errorMessage = error;
    });

    response.on('data', data => {
      const json = JSON.parse(data);
      autoUpdater.setFeedURL(json.url);
      autoUpdater.checkForUpdates();
    });
  } else {
    errorMessage = ('Cannot find releases on Github.');
  }
  if (errorMessage) {
    console.error(errorMessage);
  }
});

feedUrlReader.on('error', error => {
  console.error('Unable to connect to Github.');
});