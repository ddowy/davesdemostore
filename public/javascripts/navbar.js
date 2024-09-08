const navbarToggleBtn = document.querySelector('.js-nav-tog')
const navbarSelection = document.querySelector('.js-nav-selection')
const cartSidebarHTMLWrap = document.querySelector('.cart-sidebar-html-wrapper')
const cartIcon = document.querySelector('.cart')
const cartSidebarWrap = document.querySelector('.cart-wrapper')
const cartSidebarXButton = cartSidebarWrap.querySelector('.cart-sidebar-x-button')
const currentSidebarItems = cartSidebarWrap.querySelector('.cart-sidebar-items') 
const localStorageArray = JSON.parse(localStorage.getItem('cart'))
const cartSidebarSubtotal = document.querySelector('.cart-sidebar-subtotal')
const logo = document.querySelector('.logo')


// cart sidebar functionality

if (!localStorageArray || localStorageArray.length === 0) {
    const noItemsInCartMessage = document.createElement('div')
    noItemsInCartMessage.innerText = 'No items currently in cart'
    noItemsInCartMessage.classList.add('cart-item', 'no-items-in-cart-message')
    currentSidebarItems.appendChild(noItemsInCartMessage)
    cartSidebarSubtotal.classList.toggle('js-display-none')
}
if (localStorageArray) {
    let subtotal = 0
    localStorageArray.forEach((item) => {
        let currentProductTotal = item.price * item.productAmount
        subtotal += currentProductTotal
        // create cart item div for sidebar cart display
        const cartItemDiv = document.createElement('div')
        cartItemDiv.classList.add('cart-item')
        // create image for cart item div
        const sidebarProductImg = document.createElement('img')
        sidebarProductImg.classList.add('cart-sidebar-image')
        sidebarProductImg.src = `/uploads/resized-images/primary-product-images/${item.imgName}`
        // create text content div for cart item div
        const sidebarProductTextContent = document.createElement('ul')
        sidebarProductTextContent.classList.add('cart-sidebar-text-content')
        sidebarProductTextContent.innerHTML = `
        <li class='cart-sidebar-text-content-name'>${item.name}</li>
        <li class='cart-sidebar-text-content-price'>${item.price} * ${item.productAmount}</li>
        <li class='cart-sidebar-id'>${item.productID}</li>`
        // create delete button
        const xButton = document.createElement('button')
        xButton.classList.add('cart-sidebar-delete')
        xButton.innerHTML = '&#10006;'
        // append all child elements to cart item div
        cartItemDiv.appendChild(xButton)
        cartItemDiv.appendChild(sidebarProductTextContent)
        cartItemDiv.appendChild(sidebarProductImg)
        // append cart item div to sidebar
        currentSidebarItems.appendChild(cartItemDiv)
        cartSidebarSubtotal.innerText = `Subtotal: ${subtotal}`
    })
}


// After deleteing product from cart sidebar, it will stay open
// because keepSidebarOpen was added upon deletion


if (localStorage.getItem('keepSidebarOpen', true)) {
    cartSidebarHTMLWrap.classList.toggle('js-cart-sidebar-html-wrapper')
    cartSidebarXButton.addEventListener('click', () => {
        cartSidebarHTMLWrap.classList.toggle('js-cart-sidebar-html-wrapper')
    }, {once: true})
    localStorage.removeItem('keepSidebarOpen')
}

// navbar functionality

navbarToggleBtn.addEventListener('click', ()=> {
    navbarSelection.classList.toggle('nav-selection-active')
})


cartIcon.addEventListener('click', () => {
    cartSidebarHTMLWrap.classList.toggle('js-cart-sidebar-html-wrapper')  
})

document.addEventListener('click', (e) => {
    if (!cartSidebarHTMLWrap.classList.contains('js-cart-sidebar-html-wrapper') && !cartSidebarHTMLWrap.contains(e.target) && !cartIcon.contains(e.target)) {
        cartSidebarHTMLWrap.classList.toggle('js-cart-sidebar-html-wrapper')
    } else if (!cartSidebarHTMLWrap.classList.contains('js-cart-sidebar-html-wrapper') && cartSidebarXButton.contains(e.target)) {
        cartSidebarHTMLWrap.classList.toggle('js-cart-sidebar-html-wrapper')
    }
    if (navbarSelection.classList.contains('nav-selection-active') && !navbarSelection.contains(e.target) && !navbarToggleBtn.contains(e.target)) {
        navbarSelection.classList.toggle('nav-selection-active')
    }
})

// Delete item from cart from sidebar cart

const cartSidebarSingleDeleteBtn = document.querySelectorAll('.cart-sidebar-delete')

cartSidebarSingleDeleteBtn.forEach(btn => {
    const ID = btn.closest('.cart-item').querySelector('.cart-sidebar-id').textContent
    btn.addEventListener('click', () => {
        deleteSingleLocalStorageItem(ID)
    })
})

// Adding amount of items to red pop up icon next to cart btn

const cartAmountIcon = document.querySelector('.cart-amount-icon')

if (!localStorageArray || localStorageArray.length <= 0) {
    cartAmountIcon.style.display = 'none'
}
if (localStorageArray != null && localStorageArray.length > 0) {
    let currentCartItems = 0
    localStorageArray.forEach(amount => {
        currentCartItems += amount.productAmount
    })
    cartAmountIcon.innerText = currentCartItems
}

// for screens less than 200px if any

window.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth < 200) {
        logo.classList.toggle('js-display-none')
    }
})

window.addEventListener('resize', () => {
    if (window.innerWidth < 200 && !logo.classList.contains('js-display-none')) {
        logo.classList.add('js-display-none')
    } 
    else if (window.innerWidth > 200 && logo.classList.contains('js-display-none')) {
        logo.classList.remove('js-display-none')
    }
})

// Deleting items from local storage cart function


function deleteSingleLocalStorageItem(ID) {
    const currentArr = JSON.parse(localStorage.getItem('cart'))
    const newArr = currentArr.filter(product => product.productID !== ID)
    localStorage.setItem('cart', JSON.stringify(newArr))
    localStorage.setItem('keepSidebarOpen', true)
    window.location.reload()
    return
}