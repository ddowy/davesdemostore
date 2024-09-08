const sizeErrorMsg = document.querySelector('.window-size-error-message')
const productTable = document.querySelector('.js-product-chart-display')


// Window eventlisteners are for if screen is less then 800px displays message to use a 
// larger screen for updating and deleting products
window.addEventListener('load', () => {
    if (window.innerWidth < 800) {
        productTable.classList.add('js-display-none')
        sizeErrorMsg.classList.remove('js-display-none')
    } else {
        productTable.classList.remove('js-display-none')
        sizeErrorMsg.classList.add('js-display-none')
    }
})
window.addEventListener('resize', () => {
    if (window.innerWidth > 800) {
        productTable.classList.remove('js-display-none')
        sizeErrorMsg.classList.add('js-display-none')
    } else {
        productTable.classList.add('js-display-none')
        sizeErrorMsg.classList.remove('js-display-none')
    }
})


// for upload product sidebar pop up opening and closing
const openUploadPopUp = document.querySelector('[data-open-upload-pop-up]')
const closeUploadPopUp = document.querySelector('[data-close-upload-pop-up]')
const uploadPopUpOpen = document.querySelector('[data-upload-pop-up-open]')

openUploadPopUp.addEventListener('click', () => {
    uploadPopUpOpen.dataset.uploadPopUpOpen = true
    closeUploadPopUp.style.visibility = 'visible'
}) 
closeUploadPopUp.addEventListener('click', () => {
    uploadPopUpOpen.dataset.uploadPopUpOpen = false
    closeUploadPopUp.style.visibility = 'hidden'
})

// initiallizing filepond for easy drag and drop uploads

const inputElements = document.querySelectorAll('input[type="file"]')

inputElements.forEach(el => {
    FilePond.create(el, {
        storeAsFile: true,
    })
})

const productRows = document.querySelectorAll('.js-product-row')
    
productRows.forEach((row, i) => {
    const currentRow = row.closest('.js-row-wrapper')
    const inputElement = currentRow.querySelector('input[type="file"]');
    const arrowBtn = row.querySelector('.js-arrow-btn')
    const editProductBtn = row.closest('.row-wrapper').querySelector('.edit-btn')
    const deleteProductBtn = row.closest('.row-wrapper').querySelector('.delete-btn')
    arrowBtn.addEventListener('click', () => {
        arrowBtn.classList.toggle('arrow-btn-active')
        row.classList.toggle('product-row-active')
        row.nextElementSibling.classList.toggle('edit-space-active')
    })
    //////////////////
    // EDIT BUTTON //
    ////////////////
    editProductBtn.addEventListener('click', () => {
        const editFormContainer = editProductBtn.closest('.js-edit-space-wrapper').children[1]
        editFormContainer.classList.toggle('edit-form-container-active')
        const currentRow = editProductBtn.closest('.js-row-wrapper')
        const ID = currentRow.querySelector('.edit-space-data-equals-id').innerText
        const currentForm = currentRow.querySelector('.js-edit-product-form')
        currentForm.action = `/admin/edit/${ID}`
    })
    ////////////////////
    // DELETE BUTTON //
    //////////////////
    deleteProductBtn.addEventListener('click', () => {
        const currentRow = deleteProductBtn.closest('.js-row-wrapper')
        const confirmDelete = document.createElement('div')
        confirmDelete.innerText = 'Are you sure you would like to delete this product? This action cannot be undone.'
        const confirmDeleteBtnWrap = document.createElement('div')
        // Creating buttons
        const continueBtn = document.createElement('button')
        continueBtn.innerText = 'Continue'
        continueBtn.classList.add('confirm-delete-btn', 'continue-btn')
        const cancelBtn = document.createElement('button')
        cancelBtn.innerText = 'Cancel'
        cancelBtn.classList.add('confirm-delete-btn', 'cancel-btn')
        // Button container
        confirmDeleteBtnWrap.classList.add('confirm-delete-btn-wrap')
        confirmDelete.classList.add('confirm-delete')
        // Adding buttons to btn container
        confirmDeleteBtnWrap.appendChild(continueBtn)
        confirmDeleteBtnWrap.appendChild(cancelBtn)
        confirmDelete.appendChild(confirmDeleteBtnWrap)
        currentRow.appendChild(confirmDelete)
        cancelBtn.addEventListener('click', () => {
            currentRow.removeChild(confirmDelete)
        }, {once: true})
        continueBtn.addEventListener('click', () => {
            const ID = currentRow.querySelector('.edit-space-data-equals-id').innerText
            deleteProduct(ID)
            currentRow.removeChild(confirmDelete)
        }, {once: true})
    })
})



async function deleteProduct(productID) {
    try {
        const results = await axios.delete(`/admin/delete/${productID}`)
        if (results.status == 200) {
            window.location.reload()
        }
    } catch (error) {
        console.log(error)
    }
}

async function updateProduct(productID) {
    try {
        const results = await axios.patch(`/admin/edit/${productID}`, {
            name: tableForm.productName.value,
            price: tableForm.productPrice.value,
            imgName: tableForm.productImgName.value,
            desc: tableForm.productDesc.value
        })
        if (results.status == 200) {
            window.location.reload()
        }
        console.log('UPDATED')
    } catch (error) {
        console.log(error)
    }
}


