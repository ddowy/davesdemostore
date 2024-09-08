const sharp = require('sharp')
const fs = require('fs')
const path = require('path')


function resizeImage(imagePath, toGoPath, height, width, inside) {
    sharp(`./public/uploads/product-images/${imagePath}`).resize(width, height, {
        fit: inside ? "inside" : "cover"
    }).toFile(`./public/uploads/resized-images/${toGoPath}`, (err) => {
        if (err) {
            console.log(err)
        }
    })
}







function populateResizedImagesFolder() {
    const file = fs.readdirSync('../public/uploads/productImages')
    const files = file.splice(1)
    files.forEach(file => {
        resizeImage(file, {height: 450, fit: 'cover'})
    })
    console.log('Resized image file has been populated')
}

function deleteAllResizedImages() {
    const files = fs.readdirSync('../public/resized-images')
    if (files.length === 0) {
        console.log('No images in resized image file')
        return
    }
    files.forEach(file => {
        fs.unlink(`../public/resized-images/${file}`, err => {
            if (err) {
                console.log(err)
            }
        })
    })
    console.log('All images deleted')
}










module.exports = resizeImage