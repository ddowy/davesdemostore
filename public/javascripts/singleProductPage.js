const addToCartBtns = document.querySelector('.add-to-cart')
const ATCMinus = addToCartBtns.querySelector('.left-minus-btn')
const ATCPlus = addToCartBtns.querySelector('.right-plus-btn')
const ATCAmount = addToCartBtns.querySelector('.product-quantity')
const addToCartBtn = addToCartBtns.querySelector('.add-to-cart-btn')
const ID = document.querySelector('.js-id-field').value

ATCMinus.addEventListener('click', () => {
    if (ATCAmount.innerText > 1) {
        ATCAmount.innerText--
    }
})
ATCPlus.addEventListener('click', () => {
    ATCAmount.innerText++
})


const cartSidebarHTMLWrap2 = document.querySelector('.cart-sidebar-html-wrapper')

addToCartBtn.addEventListener('click', async () => {
    const productObj = {productID: ID, productAmount: Number(ATCAmount.innerText)}
    if (productObj.productAmount > 0) {
        if (!JSON.parse(localStorage.getItem('cart'))) {
            const theProduct = await getProduct(ID)
            productObj.imgName = theProduct.imgName
            productObj.name = theProduct.name
            productObj.price = theProduct.price
            localStorage.setItem('cart', JSON.stringify([productObj]))
            localStorage.setItem('keepSidebarOpen', true)
            window.location.reload()
            return
        } else {
            let currentArr = JSON.parse(localStorage.getItem('cart'))
            const duplicate = currentArr.find(product => product.productID === productObj.productID)
            if (duplicate) {
                let newNum = Number(duplicate.productAmount) + Number(productObj.productAmount)
                productObj.productAmount = newNum
                const filteredArr = currentArr.filter(obj => obj.productID !== duplicate.productID)
                const theProduct = await getProduct(ID)
                productObj.imgName = theProduct.imgName
                productObj.name = theProduct.name
                productObj.price = theProduct.price
                filteredArr.push(productObj)
                localStorage.setItem('cart', JSON.stringify(filteredArr))
                localStorage.setItem('keepSidebarOpen', true)
                window.location.reload()
                return 
            }
            const theProduct = await getProduct(ID)
            productObj.imgName = theProduct.imgName
            productObj.name = theProduct.name
            productObj.price = theProduct.price
            currentArr.push(productObj)
            localStorage.setItem('cart', JSON.stringify(currentArr))
            localStorage.setItem('keepSidebarOpen', true)
            window.location.reload()
            return
        }
    }
})

async function getProduct(ID) {
    try {
        const res = await axios.get(`/get-product/${ID}`)
        if (res.status === 200) return res.data.products
    } catch (error) {
        console.log(error)
    }
}