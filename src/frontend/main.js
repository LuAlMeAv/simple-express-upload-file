window.onload = () => {
    const form = document.querySelector('.form-container')
    const preview = document.querySelector('.preview')
    const inputFiles = document.querySelector('.input-files')
    const clearBtn = document.querySelector('#clearBtn')

    const API_UTL = 'http://localhost:3000'

    let files = "";

    // EVENTS
    inputFiles.onchange = () => {
        files = inputFiles.files

        removePreviewElements()

        createFolderNameInput()
        createImagePreview()
    }
    clearBtn.onclick = (evt) => {
        evt.preventDefault()

        removePreviewElements(true)
    }
    form.onsubmit = (evt) => {
        evt.preventDefault()

        removeAlert()

        if (files?.length < 1) {
            return createAlert({ status: 'error', message: 'No files were uploaded' })
        }

        if (!document.querySelector(".input-folder-name")?.value) {
            return createAlert({ status: 'error', message: 'Folder name is empty' })
        }

        const folderName = document.querySelector('.input-folder-name').value
        const fData = new FormData()

        for (let i = 0; i < files.length; i++) {
            const element = files[i];
            const filename = document.querySelector(`#filename${i}`)?.value

            if (filename) {
                fData.append('files', element, filename)
            }
        }

        fetch(`${API_UTL}/upload/${folderName}`, {
            method: 'POST',
            body: fData
        })
            .then(async (res) => {
                const response = await res.json()

                if (response.status === 'success') {
                    createSuccessResponse(response)
                } else {
                    createAlert(response)
                }
            })
            .catch(err => console.error(err))
    }

    // HANDLE EVENTS
    const handleEditName = (element) => {
        const btnEdit = element
        const iconVisible = btnEdit.getAttribute('src')
        const inputElement = btnEdit.previousElementSibling

        const editedFunction = () => {
            if (inputElement.value === '') {
                return createAlert({ status: 'error', message: 'Filename empty' })
            }

            btnEdit.setAttribute('src', '/icons/edit.png')
            inputElement.setAttribute('disabled', 'true')
        }

        if (iconVisible === '/icons/edit.png') {
            btnEdit.setAttribute('src', '/icons/save.png')
            inputElement.removeAttribute('disabled')
            inputElement.select()
            inputElement.onkeyup = (evnt) => (evnt.key === "Enter" || evnt.key === "Escape") && editedFunction()
            return
        }

        editedFunction()
    }
    const handleDeleteImg = (id) => {
        const element = document.querySelector(id)
        element.remove()

        if (preview.children.length === 0) {
            removePreviewElements(true)
        };
    }

    // CREATE HTML NODES
    const createImagePreview = () => {
        createLoading(true)

        for (let i = 0; i < files.length; i++) {
            const element = files[i];

            const url = URL.createObjectURL(element)

            const img = `
                <div class='image-container' id="imgCont${i}">
                    <div class="edit-filename-container">
                        <input class="inputFileName" placeholder="Image name" value="${element.name}" id="filename${i}" disabled />
                        <img class="edit-filename-btn" src="/icons/edit.png" id="edit${i}">
                    </div>
                    <div class="img-preview">
                        <img loading='lazy' src="${url}" alt="${element.name}" width="100%" id="img${i}" >
                        <img class="btn-delete" src="/icons/delete.png" id="delete${i}" >
                    </div>
                </div>
            `
            preview.insertAdjacentHTML('beforeend', img)

            document.querySelector('#img' + i).onload = () => {
                URL.revokeObjectURL(url)

                if (files.length - 1 === i) {
                    createLoading(false)
                }
            }

            document.querySelector(`#edit${i}`).onclick = (evt) => handleEditName(evt.target)
            document.querySelector(`#delete${i}`).onclick = () => handleDeleteImg("#imgCont" + i)
        }
    }
    const createFolderNameInput = () => {
        const input = `<input class="input-folder-name" placeholder="Folder Name" name="folderName" />`
        form.insertAdjacentHTML("afterend", input)
        document.querySelector('.input-folder-name').focus()
    }
    const createAlert = (response) => {
        const { status, message } = response

        const alert = `
            <div class="backdrop">
                <div class='alert'>
                    <div class="header-alert alert-error">
                        <img src="/icons/error.png" width='35px'>
                        <p>${status}</p>
                    </div>
                    <div class='content-alert'>
                        <p>${message}</p>
                        <input type="button" class='btn primary' id='closeAlert' value="OK">
                    </div>
                </div>
            </div>
        `

        document.querySelector('.container').insertAdjacentHTML('afterend', alert)

        document.querySelector('#closeAlert').onclick = () => removeAlert()
        document.querySelector('#closeAlert').focus()
    }
    const createSuccessResponse = (response) => {
        removePreviewElements(true)

        const success = `
            <div class='success-message'>
                <img src="/icons/checkmark.png" alt="checkmark">
                <p>${response.message}</p>
            </div>
        `
        preview.innerHTML = success
    }
    const createLoading = (isLoading) => {
        const loading = `
            <div class="backdrop">
                <img src="/icons/loading.png" alt="Loading..." class="loading">
            </div>
        `
        if (isLoading) {
            preview.insertAdjacentHTML('beforebegin', loading)
        } else {
            document.querySelector('.backdrop')?.remove()
        }
    }

    // REMOVES NODES
    const removePreviewElements = (clearInput) => {
        document.querySelectorAll(".image-container").forEach(elmt => elmt.remove())
        document.querySelector(".input-folder-name")?.remove()
        document.querySelector(".success-message")?.remove()

        if (clearInput) {
            inputFiles.value = ""
        }
    }
    const removeAlert = (e) => document.querySelector('.backdrop')?.remove()
}