const yourOrderTable = document.querySelector('.your-order')
const yourOrderTableBody = document.querySelector('.your-order-body')
const localStorageArrayCheckoutPage = JSON.parse(localStorage.getItem('cart'))
const hiddenFieldForCart = document.querySelector('.checkout-cart-info-hidden-field')
const cartPageFormPair = document.querySelectorAll('.cart-page-form-pair')



if (!localStorageArrayCheckoutPage || localStorageArrayCheckoutPage.length === 0) {
    yourOrderTable.innerHTML = `
        <tr class="your-order-empty-cart-message">
            <td>No items in cart</td>
        </tr>
    `
} 
if (localStorageArrayCheckoutPage && localStorageArrayCheckoutPage.length !== 0) {
    let allItemsTotal = 0;
    localStorageArrayCheckoutPage.forEach(item => {
        const currentItemTotal = item.price * item.productAmount
        allItemsTotal += currentItemTotal
        const yourOrderTableRow = document.createElement('tr')
        yourOrderTableRow.classList.add('your-order-table-row')
        yourOrderTableRow.innerHTML = `
        <td class="your-order-table-row-product-name">${item.name}<div class='your-order-price-times-amount'>${item.price} * ${item.productAmount}</div></td>
        <td class="your-order-table-row-product-price">${currentItemTotal}</td>
        `
        yourOrderTableBody.appendChild(yourOrderTableRow)
    });
    hiddenFieldForCart.setAttribute('value', JSON.stringify(localStorageArrayCheckoutPage))
    const yourOrderSubtotalRow = document.createElement('tr')
    yourOrderSubtotalRow.innerHTML = `
    <td colspan="2">Total: ${allItemsTotal}</td>
    `
    yourOrderSubtotalRow.classList.add('your-order-subtotal-row')
    yourOrderTableBody.appendChild(yourOrderSubtotalRow)
}
const wasSuccessful = document.querySelector('.checkout-success-msg')
if (wasSuccessful) {
    localStorage.clear()
    localStorage.setItem('successfulQuote', 'true')
    window.location.reload()
}
const ifSuccessfulQuote = document.querySelector('.if-successful-qoute')
if (localStorage.getItem('successfulQuote')) {
    ifSuccessfulQuote.style.display = 'block'
    setTimeout(() => {
        localStorage.clear()
    },1000)
}
window.addEventListener('resize', () => {
    if (window.innerWidth < 500) {
        cartPageFormPair.forEach(pair => {
            pair.children[1].children[0].style.width = '100%'
        })
        yourOrderTable.style.width = '50%'
    } else {
        cartPageFormPair.forEach(pair => {
            pair.children[1].children[0].style.width = ''
        })
        yourOrderTable.style.width = ''
    }
})

window.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth < 500) {
        cartPageFormPair.forEach(pair => {
            pair.children[1].children[0].style.width = '100%'
        })
        yourOrderTable.style.width = '50%'
    }
})