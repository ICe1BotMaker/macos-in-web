import Manager from '/window/window-manager.js';

new Manager(`http://localhost:5500/`).filesList(document.querySelector(`.mo-files`));

// import FileManager from '/window/file-manager.js';
// import Context from '/window/window-context.js';
// import Manager from '/window/window-manager.js';

// new Manager();
// new Context();
// new FileManager().filesList(document.querySelector(`.mo-files`));

const date = document.querySelector(`.mo-date`);
const weekday = [`Sun`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let date_ = new Date();
date.innerHTML = `${weekday[date_.getDay()]} ${date_.getDate()} ${month[date_.getMonth()]} ${date_.getHours()}:${date_.getMinutes()}`;

setInterval(() => {
    let date_ = new Date();
    date.innerHTML = `${weekday[date_.getDay()]} ${date_.getDate()} ${month[date_.getMonth()]} ${date_.getHours()}:${date_.getMinutes()}`;
}, 1000)

if (localStorage.getItem(`files`) == null) {
    localStorage.setItem(`files`, JSON.stringify([]));
}

if (localStorage.getItem(`files_id`) == null) {
    localStorage.setItem(`files_id`, 1);
}