const electron  = require('electron')
const { app, Menu, BrowserWindow , ipcMain} = electron

let mainWindow;
let addWindow;

app.on('ready', () => {

    mainWindow = new BrowserWindow({
        webPreferences : {
            nodeIntegration : true,
            contextIsolation : false
        }
    })

    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on('closed', () => app.quit())

    mainMenu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(mainMenu)
})


const menuTemplate = [
    {
        label : 'Todo List',
        submenu : [
            {
                label : 'Add Todo',
                accelerator : process.platform === 'darwin' ? 'Command+A' : 'Ctrl+A',
                click() {
                    createAddWindow()
                }
            },
            {
                label : 'Clear Todo',
                click() {
                    mainWindow.webContents.send('todo:clear')
                }
            },
            {
                label : 'Quit',
                accelerator : process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit()
                }
            }
        ]
    },
    {
        label : 'View',
        submenu : [
            {
                label : 'Dev Tools',
                click( item , focusedWin ) {
                    focusedWin.toggleDevTools()
                }
            },
            {
                role : 'reload'
            }
        ]
    }
]

if(process.platform === 'darwin') {
    menuTemplate.unshift({ label : '' })
}

function createAddWindow() {

    addWindow = new BrowserWindow({
        webPreferences : {
            nodeIntegration : true,
            contextIsolation : false
        },
        width : 300,
        height : 200,
        title : 'Add Todo'
    })

    addWindow.loadURL(`file://${__dirname}/addTodo.html`)
    addWindow.on('closed', ()=> {
        addWindow = null
    })
}

ipcMain.on('todo:send', ( e , todo) => {
    mainWindow.webContents.send('todo:send',todo)
    addWindow.close()
})