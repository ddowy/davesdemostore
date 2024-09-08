const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Product = require('../models/products')
const sharp = require('sharp')
const resizeImage = require('../controllers/imageResizer')
// const {sendMessage, sendMessageCustom} = require('../controllers/messageSender')
const imageMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
const uploadPath = path.join('public', Product.imgBasePath)
const resizedUploadPath = path.join('public', Product.resizedImgBasePath)
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadPath)
    }, 
    filename: function(req,file,cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage})
const {checkAuthenticated, checkNotAuthenticated} = require('../controllers/authControl')


router.route('/').get( async (req,res)=> {
    try {
        const products = await Product.find({})
        const params = {
            products: products
        }
        res.render('home', params)
    } catch (error) {
        console.log(error)
    }
})

router.route('/about').get((req,res)=> {
    res.render('about')
})
router.route('/shop').get(async (req,res)=> {
    const {featured, category, sort} = req.query
    let queryObj = {}
    if (featured) {
        queryObj.featured = featured === 'true' ? true : false
    }
    if (category) {
        queryObj.category = category
    }
    let result = Product.find(queryObj)
    if (sort === 'price' || sort === '-price') {
        result = result.sort(sort)
    }
    result = result.sort('name')
    try {
        const products = await result
        const params = {
            products: products
        }
        res.render('shop', params)
    } catch (error) {
        console.log(error)
    }
})

router.route('/shop/:id').get(async (req,res) => {
    const {id: ID} = req.params
    try {
        const products = await Product.findById({_id: ID})
        const allProducts = await Product.find({})

        // needs to be fixed, if there is only one, it displays the same one ten times
        const randomProductArr = [
            allProducts[Math.floor(Math.random() * allProducts.length)], 
            allProducts[Math.floor(Math.random() * allProducts.length)],
            allProducts[Math.floor(Math.random() * allProducts.length)],
            allProducts[Math.floor(Math.random() * allProducts.length)],
            allProducts[Math.floor(Math.random() * allProducts.length)],
            allProducts[Math.floor(Math.random() * allProducts.length)], 
            allProducts[Math.floor(Math.random() * allProducts.length)],
            allProducts[Math.floor(Math.random() * allProducts.length)],
            allProducts[Math.floor(Math.random() * allProducts.length)],
            allProducts[Math.floor(Math.random() * allProducts.length)]
        ]
        const params = {
            products: products,
            moreLikeThis: randomProductArr
        }
        res.render('singleProduct', params)
    } catch (error) {
        console.log(error)
        res.redirect('/shop')
    }
})
router.route('/contact').get((req,res)=> {
    res.render('contact')
})
router.route('/cart').get((req,res) => {
    res.render('cart')
})
router.route('/checkout').get((req,res) => {
    res.render('checkout')
})
// JSON RETURNING ROUTES

router.route('/get-product/:id').get(async (req,res) => {
    const {id: productID} = req.params
    try {
        const products = await Product.findById({_id: productID})
        res.status(200).json({products})
    } catch (error) {
        console.log(error)
    }
})

router.route('/get-all-products').get(async(req,res) => {
    try {
        const products = await Product.find({})
        res.status(200).json({ products })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Something went wrong, please try again' })
    }
})

// ALL ADMIN AFTER HERE

router.route('/admin').get(checkAuthenticated, async(req,res)=>{
    try {
        const products = await Product.find({})
        const params = {
            products: products,
            user: req.user.name
        }
        res.render('admin', params)
    } catch (error) {
        console.log(error)
    }
// UPLOADING PRODUCT
}).post(upload.single('imgName'), async (req,res) => {
    const filename = req.file != null ? req.file.filename : null
    const products = new Product({
        name: req.body.name,
        price: req.body.price,
        desc: req.body.desc,
        category: req.body.category,
        featured: req.body.featured,
        imgName: filename,
    })
    try {
        const newProduct = await products.save()
        await resizeImage(newProduct.imgName, `featured-images/${newProduct.imgName}`,500, 800)
        await resizeImage(newProduct.imgName, `primary-product-images/${newProduct.imgName}`, 400, 400)
        res.status(201).redirect('/admin')
    } catch (err){
        console.log(err)
        if (filename != null) {
            removeImageFile(filename)
        }
        req.flash('err','All fields required to add product')
        res.redirect('/admin')
    }
})

// DELETE SINGLE PRODUCT

router.route('/admin/delete/:id').delete(checkAuthenticated, async (req,res)=> {
    const { id: productID } = req.params
    const filename = req.file != null ? req.file.filename : null
    try {
        const productPath = await Product.findById({_id: productID})
        const product = await Product.findOneAndDelete({ _id: productID })
        if (!product) {
            res.status(404).json({msg: `No product with ID of ${productID}`})
        }
        if (product.imgName != null) {
            removeImageFile(productPath.imgName)
        }
        res.status(200).json({ product })
        
    } catch (error) {
        console.log(error)
        req.flash('err', 'Something went wrong, please try again later...')
        res.redirect('/admin')
    }
})


// EDIT SINGLE PRODUCT

router.route('/admin/edit/:id').post(checkAuthenticated, upload.single('imgName'), async (req,res) => {
    const { id: productID } = req.params
    let filename = req.file != null ? req.file.filename : null
    try {
        const productToUpdate = await Product.findById({_id: productID})
        const imageName = productToUpdate.imgName
        if (filename == null) {
            filename = imageName
        } else if (filename != null && imageName != null) {
            removeImageFile(imageName)
            await resizeImage(filename, `featured-images/${filename}`, 500, 800)
            await resizeImage(filename, `primary-product-images/${filename}`, 400, 400)
        }

        const product = await Product.findOneAndUpdate({ _id: productID }, 
            {
                name: req.body.name == null || req.body.name == undefined || req.body.name =='' ? productToUpdate.name : req.body.name,
                price: req.body.price == null || req.body.price == undefined || req.body.price =='' ? productToUpdate.price : req.body.price,
                imgName: filename,
                desc: req.body.desc == null || req.body.desc == undefined || req.body.desc == '' ? productToUpdate.desc : req.body.desc,
                category: req.body.category == null || req.body.category == undefined || req.body.category == '' || req.body.category == 'Select a Category' ? productToUpdate.category : req.body.category,
                featured: req.body.featured == 'True or False' ? productToUpdate.featured : req.body.featured
            },{
                new: true,
                runValidators: true,
            }
        )
        if (!product) {
            res.status(404).json({msg: `No product with ID of ${productID}`})
        }
        res.status(200).redirect('/admin')
    } catch (error) {
        console.log(error)
        req.flash('err', 'Something went wrong, please try again later...')
        res.redirect('/admin')
    }
})

module.exports = router

// SEND EMAIL ROUTES

// router.route('/send-quote').post(sendMessage)

// router.route('/send-custom-message').post(sendMessageCustom)

// function removeImageFile(filename) {
//     fs.unlink(path.join(uploadPath, filename), err => {
//         if (err) console.error(err)
//     })
//     fs.unlink(path.join(resizedUploadPath, 'featured-images', filename), err => {
//         if (err) console.error(err)
//     })
//     fs.unlink(path.join(resizedUploadPath, 'primary-product-images', filename), err => {
//         if (err) console.error(err)
//     })
// }


// COMMENTED OUT UNLESS NEEDED FOR TESTING OR DEVELOPMENT

// router.route('/admin/delete-all-products').delete(async (req,res) => {
//     try {
//         const file = fs.readdirSync('./public/uploads/product-images')
//         const filesToDelete = file.splice(1)
//         filesToDelete.forEach(file => {
//             fs.unlink(path.join(uploadPath, file), err => {
//                 if (err) console.log(err)
//             })
//         });
//         const resizedFeaturedImage = fs.readdirSync(path.join(resizedUploadPath, 'featured-images'))
//         const resizedPrimaryImage = fs.readdirSync(path.join(resizedUploadPath, 'primary-product-images'))
//         resizedFeaturedImage.forEach(file => {
//             fs.unlink(path.join(resizedUploadPath, 'featured-images', file), err => {
//                 if (err) console.log(err)
//             })
//         })
//         resizedPrimaryImage.forEach(file => {
//             fs.unlink(path.join(resizedUploadPath, 'primary-product-images', file), err => {
//                 if (err) console.log(err)
//             })
//         })
//         const deleted = await Product.deleteMany({})
//         res.status(200).json({msg: "All items succesfully deleted"})
//     } catch (error) {
//         console.log(error)
//     }
// })