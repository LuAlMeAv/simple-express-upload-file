const express = require('express')
const fileUpload = require('express-fileupload')
const fs = require('fs')

const API_URL = 'http://localhost'
const EXPLICIT_PORT = 3000

const app = express()
const port = process.env.PORT | EXPLICIT_PORT

app.use(express.static(__dirname + '/frontend/'))

app.use(fileUpload({
    safeFileNames: true,
    preserveExtension: true
}))
createFolderUpload()

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html')
})
app.post('/upload/:folderName', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ status: 'error', message: 'No files were uploaded.' });
    }

    const folderName = req.params.folderName

    if (!fs.existsSync('./src/frontend/uploads/' + folderName)) {
        fs.mkdirSync('./src/frontend/uploads/' + folderName)
    }

    const uploadPath = `${__dirname}/frontend/uploads/${folderName}/`;
    const uploadFiles = req.files.files

    if (uploadFiles.length > 0) {
        for (let i = 0; i < uploadFiles.length; i++) {
            const element = uploadFiles[i]

            element.mv(uploadPath + element.name, function (err) {
                if (err)
                    return res.status(500).json({ status: 'error', message: 'Internal Server Error', err });

            });
        }
    } else {
        uploadFiles.mv(uploadPath + uploadFiles.name, function (err) {
            if (err)
                return res.status(500).json({ status: 'error', message: 'Internal Server Error', err });

        });
    }

    res.json({ status: 'success', message: `${uploadFiles.length > 0 ? uploadFiles.length + ' files' : '1 file'} was uploaded and saved on ${folderName}` })
})

app.listen(port, () => {
    console.log(`Visit: \n ${API_URL}:${port} \n`)
})

function createFolderUpload() {
    if (!fs.existsSync('./src/frontend/uploads')) {
        fs.mkdirSync('./src/frontend/uploads')
    }
}