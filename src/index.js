var electron = require('electron');

var { app, BrowserWindow, Menu, ipcMain } = electron;

var mainWindow;

app.on('ready', function startApp() {
  mainWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
  });
  mainWindow.loadURL(`file://${__dirname}/home.html`);
  mainWindow.on('closed', function exitApp() {
    app.quit();
  });

  var mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

var menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add new ToDo',
        accelerator: 'Command+A',
        click() {
          createNewTodo();
        },
      },
      {
        label: 'Clear',
        accelerator: process.platform == 'darwin' ? 'Command+C' : 'Ctrl+c',
        click() {
          mainWindow.webContents.send('todo:clear');
        },
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          exitApp();
        },
      },
    ],
  },
];

function exitApp() {
  app.quit();
}

if (process.platform == 'darwin') {
  menuTemplate.unshift({ label: '' });
}

var addNewTodo;
function createNewTodo() {
  addNewTodo = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
    width: 300,
    height: 200,
    title: 'Add new task',
  });
  addNewTodo.loadURL(`file://${__dirname}/add.html`);
  addNewTodo.on('closed', function freeUpMemory() {
    addNewTodo = null;
  });
}

if (process.env.NODE_ENV != 'production') {
  menuTemplate.push({
    label: 'View',
    submenu: [
      { role: 'reload' },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
    ],
  });
}

ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addNewTodo.close();
});
