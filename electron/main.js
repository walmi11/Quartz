const { app, BrowserWindow } = require("electron");
const { exec } = require("child_process");
const path = require("path");

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: "MesCours",
    icon: path.join(__dirname, "icon.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    backgroundColor: "#0a0a0a",
  });

  // Attendre que le serveur Next.js démarre
  setTimeout(() => {
    mainWindow.loadURL("http://localhost:3000");
  }, 3000);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", () => {
  // Lancer le serveur Next.js
  serverProcess = exec("npx next start", {
    cwd: path.join(__dirname, ".."),
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (serverProcess) serverProcess.kill();
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});