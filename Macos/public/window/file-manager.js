import Manager from '/window/window-manager.js';

export default class FileManager {
    constructor() {
    }

    filesList(container) {
        container.innerHTML = ``;

        fetch(`http://localhost:3000/files`)
        .then(data => data.json())
        .then(data => {
            data.list.forEach(file => {
                const file_ = document.createElement(`div`);
        
                file_.classList.add(`mo-file`);
                file_.id = `file_element`;
        
                file_.ondblclick = e => {
                    new Manager().windowManager(`Note`, file);
                }
        
                file_.innerHTML += `
                <img class="mo-file_" draggable="false" src="/img/icons/pen.png" alt="file-icon" data-file_name="${file}" data-file_element="file_element">
                <span class="mo-file-title">${file}</span>`;
        
                container.appendChild(file_);
            });
        })
    }

    delFile(file_name, element) {
        fetch(`http://localhost:3000/delete?file_name=${file_name}`);
    }

    writeFile(file_name, text) {
        fetch(`http://localhost:3000/write?file_name=${file_name}&text=${text}`);
    }
}