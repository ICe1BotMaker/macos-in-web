import Movereation from './window-moveration.js';

export default class Manager {
    constructor(hostname) {
        const mo_taskbar_items = document.querySelectorAll(`.mo-taskbar-item`);

        this.windowId = 0;
        this.windowState = [];
        this.zIndex = 0;
        this.host = hostname;

        mo_taskbar_items.forEach(element => {
            if (element.ariaLabel != null) {
                this.windowState.push({
                    name: element.ariaLabel,
                    state: false,
                    view: true,
                    enlarge: false,
                    origin: ``,
                    file_name: ``
                });

                element.onclick = e => {
                    if (element.ariaLabel == `Note`) {
                        this.windowManager(element.ariaLabel, this.windowState[3].file_name);
                    } else {
                        this.windowManager(element.ariaLabel);
                    }
                }
            }
        });

        document.querySelector(`[data-type="new_file"]`).onclick = e => {
            this.windowManager(`Note`);
        }

        document.querySelector(`[data-type="Finder"]`).onclick = e => {
            this.windowManager(`Finder`);
        }

        document.querySelector(`[data-type="Safari"]`).onclick = e => {
            this.windowManager(`Safari`);
        }

        document.querySelector(`[data-type="Note"]`).onclick = e => {
            this.windowManager(`Note`);
        }
        
        document.addEventListener('contextmenu', e => { this.handleCreateContextMenu(e) }, false);
        document.addEventListener('click', e => { this.handleClearContextMenu(e) }, false);
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
            this.windowManager(`Note`);
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
                    this.windowManager(`Note`, event.target.dataset.file_name);
                }
            }

            trash.onclick = e => {
                if (!trash.classList.contains(`disabled`)) {
                    this.delFile(event.target.dataset.file_name);

                    setTimeout(() => {
                        this.filesList(document.querySelector(`.mo-files`));
    
                        if (document.querySelector(`.mo-folder-files`) != null) {
                            this.filesList(document.querySelector(`.mo-folder-files`));
                        }
                    }, 100);
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

    filesList(container) {
        container.innerHTML = ``;

        fetch(`${this.host}files`)
        .then(data => data.json())
        .then(data => {
            console.warn(`fetch success: ${this.host}files`);

            data.list.forEach(file => {
                const file_ = document.createElement(`div`);
        
                file_.classList.add(`mo-file`);
                file_.id = `file_element`;
        
                file_.ondblclick = e => {
                    this.windowManager(`Note`, file);
                }
        
                file_.innerHTML += `
                <img class="mo-file_" draggable="false" src="/img/icons/pen.png" alt="file-icon" data-file_name="${file}" data-file_element="file_element">
                <span class="mo-file-title">${file}</span>`;
        
                container.appendChild(file_);
            });
        })
    }

    delFile(file_name) {
        fetch(`${this.host}delete?file_name=${file_name}`);
        console.warn(`delete success: ${this.host}delete`);
    }

    writeFile(file_name, text) {
        fetch(`${this.host}write?file_name=${file_name}&text=${text}`);
        console.warn(`write success: ${this.host}write`);
    }

    windowManager(any = String, file_name = ``) {
        this.windowState.forEach(e => {
            if (e.name == any) {
                if (!e.state) {
                    this.makeWindow(any, file_name);
                } else {
                    if (e.view) {
                        this.hideWindow(any);
                    } else {
                        this.viewWindow(any);
                    }
                }
            }
        });
    }

    skeletonUX(any = String) {
        return `
        <div class="mo-tool" draggable="true" id="${any}_tool">
            <div class="mo-circles">
                <div class="mo-circle">
                    <span id="${any}_exit" class="mo-red"><span></span></span>
                </div>
                <div class="mo-circle">
                    <span id="${any}_mini" class="mo-yellow"><span></span></span>
                </div>
                <div class="mo-circle">
                    <span id="${any}_enlarge" class="mo-green"><span></span></span>
                </div>
            </div>
        </div>`;
    }

    makeWindow(any = String, file_name = ``) {
        const container = document.querySelector(`.mo-main`);
        const item = document.querySelector(`[aria-label="${any}"]`);

        const window = document.createElement(`div`);

        item.classList.add(`mo-active`);
        
        this.windowId++;
        this.zIndex++;

        window.draggable = true;
        window.id = any;
        window.style.left = `20%`;
        window.style.top = `2.5%`;
        window.style.transform = `scale(.9)`;
        window.style.opacity = `0`;
        window.style.zIndex = this.zIndex;

        window.classList.add(`mo-window`);

        window.onmousedown = e => {
            this.zIndex++;
            window.style.zIndex = this.zIndex;
        }

        this.windowState.forEach(e => {
            if (e.name == any) {
                e.state = true;
                e.origin = ``;
                e.enlarge = false;
                e.view = true;
            }
        })

        if (this.windowState[0].name == any) {
            window.innerHTML = `
            <div class="mo-tool" draggable="true" id="Finder_tool" style="width: 200px; background: #27292e;">
                <div class="mo-circles">
                    <div class="mo-circle">
                        <span id="Finder_exit" class="mo-red"><span></span></span>
                    </div>
                    <div class="mo-circle">
                        <span id="Finder_mini" class="mo-yellow"><span></span></span>
                    </div>
                    <div class="mo-circle">
                        <span id="Finder_enlarge" class="mo-green"><span></span></span>
                    </div>
                </div>
            </div>
            <div class="mo-folder">
                <div class="mo-folder-control">
                    <ul class="mo-folder-control-items">
                        <li class="mo-folder-control-item active">Desktop</li>
                        <li class="mo-folder-control-item line"><span></span></li>
                        <li class="mo-folder-control-item">Red</li>
                        <li class="mo-folder-control-item">Orange</li>
                        <li class="mo-folder-control-item">Yellow</li>
                        <li class="mo-folder-control-item">Green</li>
                        <li class="mo-folder-control-item">Blue</li>
                        <li class="mo-folder-control-item">Purple</li>
                        <li class="mo-folder-control-item">Gray</li>
                    </ul>
                </div>
                <div class="mo-folder-files"></div>
            </div>`;
        } else if (this.windowState[1].name == any) {
            window.innerHTML = `
                <div class="mo-tool" draggable="true" id="Safari_tool">
                    <div class="mo-circles">
                        <div class="mo-circle">
                            <span id="Safari_exit" class="mo-red"><span></span></span>
                        </div>
                        <div class="mo-circle">
                            <span id="Safari_mini" class="mo-yellow"><span></span></span>
                        </div>
                        <div class="mo-circle">
                            <span id="Safari_enlarge" class="mo-green"><span></span></span>
                        </div>
                    </div>

                    <div class="mo-history">
                        <ul class="mo-history-icons">
                            <li id="Safari_his_back"><svg xmlns="http://www.w3.org/2000/svg" id="Bold" viewBox="0 0 24 24" width="512" height="512"><path d="M17.921,1.505a1.5,1.5,0,0,1-.44,1.06L9.809,10.237a2.5,2.5,0,0,0,0,3.536l7.662,7.662a1.5,1.5,0,0,1-2.121,2.121L7.688,15.9a5.506,5.506,0,0,1,0-7.779L15.36.444a1.5,1.5,0,0,1,2.561,1.061Z"/></svg></li>
                            <li id="Safari_his_go"><svg xmlns="http://www.w3.org/2000/svg" id="Bold" viewBox="0 0 24 24" width="512" height="512"><path d="M6.079,22.5a1.5,1.5,0,0,1,.44-1.06l7.672-7.672a2.5,2.5,0,0,0,0-3.536L6.529,2.565A1.5,1.5,0,0,1,8.65.444l7.662,7.661a5.506,5.506,0,0,1,0,7.779L8.64,23.556A1.5,1.5,0,0,1,6.079,22.5Z"/></svg></li>
                        </ul>

                        <div class="mo-link">
                            <input type="text" id="Safari_link" value="https://google.com">
                        </div>
                    </div>

                    <div class="mo-plus">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" width="512" height="512">
                            <g>
                                <path d="M480,224H288V32c0-17.673-14.327-32-32-32s-32,14.327-32,32v192H32c-17.673,0-32,14.327-32,32s14.327,32,32,32h192v192   c0,17.673,14.327,32,32,32s32-14.327,32-32V288h192c17.673,0,32-14.327,32-32S497.673,224,480,224z"/>
                            </g>
                        </svg>
                    </div>
                </div>
                <iframe class="mo-safari" src="https://www.google.com/webhp?igu=1" frameborder="0"></iframe>`;
        } else if (this.windowState[2].name == any) {
            window.innerHTML = this.skeletonUX(any);

            window.innerHTML += `<iframe class="mo-vscode" src="https://stackblitz.com/github/ICe1BotMaker/react-designer-ui/tree/main/react-designer" frameborder="0"></iframe>`;
        } else if (this.windowState[3].name == any) {
            window.innerHTML = `
            <div class="mo-tool" draggable="true" id="Note_tool">
                <div class="mo-circles">
                    <div class="mo-circle">
                        <span id="Note_exit" class="mo-red"><span></span></span>
                    </div>
                    <div class="mo-circle">
                        <span id="Note_mini" class="mo-yellow"><span></span></span>
                    </div>
                    <div class="mo-circle">
                        <span id="Note_enlarge" class="mo-green"><span></span></span>
                    </div>
                </div>

                <div class="mo-file-name">*&nbsp;untitled.txt</div>

                <div class="mo-save"><svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M12,10a4,4,0,1,0,4,4A4,4,0,0,0,12,10Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,16Z"/><path d="M22.536,4.122,19.878,1.464A4.966,4.966,0,0,0,16.343,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V7.657A4.966,4.966,0,0,0,22.536,4.122ZM17,2.08V3a3,3,0,0,1-3,3H10A3,3,0,0,1,7,3V2h9.343A2.953,2.953,0,0,1,17,2.08ZM22,19a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2V3a5.006,5.006,0,0,0,5,5h4a4.991,4.991,0,0,0,4.962-4.624l2.16,2.16A3.02,3.02,0,0,1,22,7.657Z"/></svg></div>
            </div>
            <textarea class="mo-text"></textarea>`;
        }

        container.appendChild(window);

        window.focus();

        if (any == `Finder`) {
            this.filesList(document.querySelector(`.mo-folder-files`));
        }

        if (any == `Note`) {
            const text = document.querySelector(`.mo-text`);
            const history = document.querySelector(`.mo-file-name`);
            const plus = document.querySelector(`.mo-save`);

            if (file_name != ``) {
                fetch(`${this.host}read?file_name=test.txt`)
                .then(data => data.json())
                .then(data => {
                    console.warn(`read success: ${this.host}read`);

                    text.innerHTML = data.text.replace(/!!!!!n/g, `&#13;&#10;`);
                    history.innerHTML = file_name;
                    this.windowState[3].file_name = file_name;
                });

                text.onkeyup = e => {
                    history.innerHTML = `*&nbsp;test.txt`;
                }

                plus.onclick = e => {
                    console.log(text.value);
                    this.writeFile(`test.txt`, text.value.replace(/\n/g, `!!!!!n`));
                    history.innerHTML = `test.txt`;
                    this.filesList(document.querySelector(`.mo-files`));

                    if (document.querySelector(`.mo-folder-files`) != null) {
                        this.filesList(document.querySelector(`.mo-folder-files`));
                    }
                }
            } else {
                plus.onclick = e => {
                    this.writeFile(`test.txt`, text.value.replace(/\n/g, `!!!!!n`));
                    history.innerHTML = `test.txt`;
                    this.filesList(document.querySelector(`.mo-files`));
                    
                    if (document.querySelector(`.mo-folder-files`) != null) {
                        this.filesList(document.querySelector(`.mo-folder-files`));
                    }
                }
            }

            text.focus();
        }

        if (any == `Safari`) {
            const Safari_link = document.getElementById(`Safari_link`);
            const Safari = document.querySelector(`.mo-safari`);

            const Safari_his_back = document.getElementById(`Safari_his_back`);
            const Safari_his_go = document.getElementById(`Safari_his_go`);

            Safari_link.onkeyup = e => {
                if (e.key == `Enter`) {
                    Safari.src = Safari_link.value;
                    Safari_link.blur();
                }
            }

            Safari_his_back.onclick = e => {
                history.back();
            }

            Safari_his_go.onclick = e => {
                history.forward();
            }
        }

        setTimeout(() => {
            this.viewWindow(any);
    
            const exit = document.getElementById(`${any}_exit`);
            const mini = document.getElementById(`${any}_mini`);
            const enlarge = document.getElementById(`${any}_enlarge`);
    
            exit.addEventListener(`click`, e => {
                if (e.ctrlKey) {
                    this.exitWindow(any);
                } else {
                    this.hideWindow(any);
                }
            }, false);
            mini.addEventListener(`click`, e => { this.hideWindow(any) }, false);
            enlarge.addEventListener(`click`, e => { this.enlargeWindow(any) }, false);
    
            new Movereation(document.getElementById(`${any}_tool`), document.getElementById(any));
        }, 500);
    }

    hideWindow(any = String) {
        const window = document.getElementById(any);

        window.style.transition = `.25s`;

        this.windowState.forEach(e => {
            if (e.name == any) {
                if (window.style.transform != `${e.origin} scale(.9)`) {
                    e.origin = window.style.transform;

                    window.style.transform = `${e.origin} scale(.9)`;
                    window.style.opacity = `0`;
            
                    setTimeout(() => {
                        window.style.display = `none`;
                        window.style.transition = ``;
                    }, 250);
            
                    this.windowState.forEach(e => {
                        if (e.name == any) {
                            e.view = false;
                        }
                    })
                }
            }
        })
    }

    viewWindow(any = String) {
        const window = document.getElementById(any);

        window.style.transition = `.25s`;

        this.zIndex++;

        this.windowState.forEach(e => {
            if (e.name == any) {
                window.style.display = `block`;
                
                setTimeout(() => {
                    window.style.transform = `${e.origin} scale(1)`;
                    window.style.opacity = `1`;
                    window.style.zIndex = this.zIndex;
        
                    setTimeout(() => {
                        window.style.transition = ``;
                    }, 250);
                });
        
                this.windowState.forEach(e => {
                    if (e.name == any) {
                        e.view = true;
                    }
                })
            }
        })

    }

    exitWindow(any = String) {
        const window = document.getElementById(any);
        const item = document.querySelector(`[aria-label="${any}"]`);

        item.classList.remove(`mo-active`);

        window.style.transition = `.25s`;
        
        this.windowState.forEach(e => {
            if (e.name == any) {
                if (window.style.transform != `${e.origin} scale(.9)`) {
                    e.origin = window.style.transform;

                    window.style.transform = `${e.origin} scale(.9)`;
                    window.style.opacity = `0`;
            
                    setTimeout(() => {
                        window.style.display = `none`;
                        window.style.transition = ``;
                        
                        this.windowState.forEach(e => {
                            if (e.name == any) {
                                e.view = false;
                                e.state = false;
    
                                window.remove();
                            }
                        })
                    }, 250);
                }
            }
        })
    }

    enlargeWindow(any = String) {
        const window = document.getElementById(any);

        this.windowState.forEach(e => {
            if (e.name == any) {
                window.style.transition = `.25s`;

                if (e.enlarge) {
                    window.style.transform = e.origin;
                    window.style.left = `20%`;
                    window.style.top = `2.5%`;
                    window.style.width = this.width;
                    window.style.height = this.height;
                    
                    e.enlarge = false;
                } else if (!e.enlarge) {
                    if (window.style.transform != `translate3d(0px, 0px, 0px)`) {
                        e.origin = window.style.transform;
                        this.width = window.style.width;
                        this.height = window.style.height;
                    }

                    window.style.transform = `translate3d(0px, 0px, 0px)`;
                    window.style.left = `0`;
                    window.style.top = `0`;
                    window.style.width = `100%`;
                    window.style.height = `100%`;

                    e.enlarge = true;
                }

                setTimeout(() => {
                    window.style.transition = ``;
                }, 250);
            }
        })
    }
}