import Manager from "/window/window-manager.js";
import FileManager from '/window/file-manager.js';

export default class Context {
    constructor() {
        document.addEventListener('contextmenu', this.handleCreateContextMenu, false);
        document.addEventListener('click', this.handleClearContextMenu, false);
    }
        
    handleCreateContextMenu(event) {
        const context = document.querySelector(`.mo-context`);

        event.preventDefault();

        context.style.display = 'block';

        context.style.top = event.pageY + 'px';
        context.style.left = event.pageX + 'px';

        const disableds = document.querySelectorAll(`.c`);

        const new_file = document.querySelector(`[aria-label="new_file"]`);
        const about = document.querySelector(`[aria-label="about"]`);

        new_file.onclick = e => {
            new Manager().windowManager(`Note`);
        }
        
        if (event.target.classList.contains(`mo-file_`)) {
            const open_file = document.querySelector(`[aria-label="open_file"]`);
            const trash = document.querySelector(`[aria-label="trash"]`);
            const copy_file = document.querySelector(`[aria-label="copy_file"]`);
            const paste_file = document.querySelector(`[aria-label="paste_file"]`);

            disableds.forEach(element => {
                element.classList.remove(`disabled`);
            })

            open_file.onclick = e => {
                if (!open_file.classList.contains(`disabled`)) {
                    new Manager().windowManager(`Note`, event.target.dataset.file_name);
                }
            }

            trash.onclick = e => {
                if (!trash.classList.contains(`disabled`)) {
                    new FileManager().delFile(event.target.dataset.file_name, document.getElementById(event.target.dataset.file_element));
                }
            }
        } else {
            disableds.forEach(element => {
                element.classList.add(`disabled`);
            })
        }
    }

    handleClearContextMenu(event) {
        const context = document.querySelector(`.mo-context`);

        context.style.display = 'none';
        context.style.top = null;
        context.style.left = null;
    }
}