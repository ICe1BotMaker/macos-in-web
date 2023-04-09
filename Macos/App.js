const express = require(`express`);
const FS = require(`fs`);
const readline = require(`readline`);
const rateLimit = require(`express-rate-limit`);

const app = express();
const port = 5500;

const limiter = rateLimit({
    windowMs: 30000, 
    max: 300
});
  
app.use(limiter);

app.use(express.static(`${__dirname}/public`));

app.get(`/`, (req, res) => {
    res.sendFile(`${__dirname}/views/index.html`);
});

app.get(`/files`, (req, res) => {
    const Folders = FS.readdirSync(`${__dirname}/data/Desktop`);

    res.json({
        list: Folders
    })
});

app.get(`/read`, (req, res) => {
    if (req.query.file_name == undefined) {
        res.json({
            status: 404,
            message: `Error`
        })
    } else {
        const Text = FS.readFileSync(`${__dirname}/data/Desktop/${req.query.file_name}`);

        res.json({
            text: Text.toString('utf8')
        })
    }
});

app.get(`/make`, (req, res) => {
    if (req.query.file_name == undefined) {
        res.json({
            status: 404,
            message: `Error`
        })
    } else {
        FS.writeFileSync(`${__dirname}/data/Desktop/${req.query.file_name}`, ``);
        res.json({
            status: 200,
            file_name: req.query.file_name
        })
    }
});

app.get(`/write`, (req, res) => {
    if (req.query.text == undefined || req.query.file_name == undefined) {
        res.json({
            status: 404,
            message: `Error`
        })
    } else {
        FS.writeFileSync(`${__dirname}/data/Desktop/${req.query.file_name}`, req.query.text);
        res.json({
            status: 200,
            file_name: req.query.file_name,
            text: req.query.text
        })
    }
});


app.get(`/delete`, (req, res) => {
    if (req.query.file_name == undefined) {
        res.json({
            status: 404,
            message: `Error`
        })
    } else {
        FS.unlinkSync(`${__dirname}/data/Desktop/${req.query.file_name}`);
        res.json({
            status: 200,
            file_name: req.query.file_name
        })
    }
});

app.listen(port, () => {
    console.log(`[ ! ] Server running successfully.`);
});