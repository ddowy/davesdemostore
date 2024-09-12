const express = require('express')
const router = express.Router()
const Product = require('../models/products')


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