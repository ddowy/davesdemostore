const mongoose = require('mongoose')
const path = require('path')

const imgBasePath = 'uploads/product-images'
const resizedImgBasePath = 'uploads/resized-images'

const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imgName: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["Dinasours", "Dragons", "Drinks"],
        required: true,  
    },
    featured: {
        type: Boolean,
        default: false,
        required: true
    }
})

productsSchema.virtual('imagePath').get(function() {
    if (this.imgName != null) {
        const pathToImg = path.join('/', imgBasePath, this.imgName)
        return pathToImg
    }
})
productsSchema.virtual('primaryImagePath').get(function() {
    if (this.imgName != null) {
        const pathToImg = path.join('/', resizedImgBasePath,  'primary-product-images',this.imgName)
        return pathToImg
    }
})
productsSchema.virtual('featuredImagePath').get(function() {
    if (this.imgName != null) {
        const pathToImg = path.join('/', resizedImgBasePath, 'featured-images', this.imgName)
        return pathToImg
    }
})


const Product = mongoose.model('Product', productsSchema)



module.exports = Product
module.exports.imgBasePath = imgBasePath
module.exports.resizedImgBasePath = resizedImgBasePath
