var electron = require('electron');
var { ipcRenderer } = electron;

document.querySelector('form').addEventListener('submit', addNewTask());

function addNewTask() {
  event.preventDefault();
  var value = document.querySelector('input').value;
  ipcRenderer.send('todo:add', value);

  // debugger;
}
