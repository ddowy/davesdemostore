const cartPageTableBody = document.querySelector('.cart-page-table-body')
const localStorageArrayCartPage = JSON.parse(localStorage.getItem('cart'))
const cartPageTableHead = document.querySelector('.cart-page-table-head')
const cartPageTableFoot = document.querySelector('.cart-page-table-foot')
const cartPageTotal = document.querySelector('.cart-page-foot-total')
const cartPageTable = document.querySelector('.cart-page-table')

if (!localStorageArrayCartPage || localStorageArrayCartPage.length == 0) {
    cartPageTableHead.children[1].style.display = 'none'
    cartPageTableFoot.style.display = 'none'
    const cartPageEmptyCartMessage = document.createElement('tr')
    cartPageEmptyCartMessage.setAttribute('colspan','4')
    cartPageEmptyCartMessage.innerHTML = '<div class="cart-page-empty-cart-message"><p>Sheesh, quite an empty cart</p><a href="/shop" class="cart-page-back-to-shop-btn"><button>Back to shop</button></a></div>'
    cartPageTableBody.appendChild(cartPageEmptyCartMessage)
}

if (localStorageArrayCartPage) {
    let allItemTotal = 0
    localStorageArrayCartPage.forEach(item => {
        const currentItemTotal = item.price * item.productAmount
        allItemTotal += currentItemTotal
        const cartItemTr = document.createElement('tr')
        cartItemTr.classList.add('cart-page-table-row')
        cartItemTr.innerHTML = `
            <td class='cart-page-table-product-col'>
                <button class='cart-page-table-x-button'>&#10006;</button>
                <div style='display: flex; align-items: center; gap: 7px;'>
                    <img class="cart-item-image" src='/uploads/resized-images/primary-product-images/${item.imgName}' height='77px' style='border-radius: 3px;'>
                    <div style='width: fit-content;'>${item.name}</div>
                    <div class='cart-page-row-id' style='display: none;'>${item.productID}</div>
                    </div>
                    </td>
                    <td class="cart-page-item-price">${item.price}</td>
                    <td class="cart-page-item-amount">

                        <div class="modify-cart-cart-page" style="display: flex;">
                            <button class="plus-and-minus-btn left-minus-btn">-</button>
                            <span class="product-quantity">${item.productAmount}</span>
                            <button class="plus-and-minus-btn right-plus-btn">+</button>
                        </div>
                    
                    </td>
                    <td class="cart-page-item-total">${currentItemTotal}</td>
        `
        
        cartPageTableBody.appendChild(cartItemTr)
    });
    cartPageTotal.innerText = allItemTotal
}

// For altering amount of items in cart

const modifyCartBtns = document.querySelectorAll('.modify-cart-cart-page')
let timer
const timerFunc = () => {
    timer = setTimeout(() => {
        localStorage.setItem('cart', JSON.stringify(localStorageArrayCartPage))
        window.location.reload()
    }, 2000)
}
modifyCartBtns.forEach((btnCollection, i) => {
    btnCollection.addEventListener('click', (e) => {
        clearTimeout(timer)
        timerFunc()
        const plusBtn = btnCollection.querySelector('.right-plus-btn')
        const minusBtn = btnCollection.querySelector('.left-minus-btn')
        let productQuantity = btnCollection.querySelector('.product-quantity')
        if (plusBtn.contains(e.target)) {
            productQuantity.innerText++
        }
        if (minusBtn.contains(e.target) && Number(productQuantity.innerText) > 1) {
            productQuantity.innerText--
        }
        localStorageArrayCartPage[i].productAmount = Number(productQuantity.innerText)
    })
})



// Deleting row from cart page table

const cartPageRowDeleteBtns = document.querySelectorAll('.cart-page-table-x-button')

cartPageRowDeleteBtns.forEach(btn => {
    const ID = btn.closest('.cart-page-table-product-col').querySelector('.cart-page-row-id').textContent
    btn.addEventListener('click', () => {
        deleteSingleLocalStorageItem(ID)
    })
})
const cartPriceColumnHeader = document.querySelector('.cart-page-price-column-header')
const cartPriceColumns = document.querySelectorAll('.cart-page-item-price')
const cartTotalColumnHeader = document.querySelector('.cart-page-total-column-header')
const cartTotalColumns = document.querySelectorAll('.cart-page-item-total')
const cartAmountColumns = document.querySelectorAll('.cart-page-item-amount')
const cartHeader = document.querySelector('.cart-page-table-header')
const cartFootSubtotalLabel = cartPageTableFoot.children[0]


window.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth < 500) {
        cartPageTable.style.width = '40%'
        cartPageTable.style.margin = '20px auto'
        cartPriceColumnHeader.setAttribute('colspan', 0)
        cartTotalColumnHeader.setAttribute('colspan', 0)
        cartPriceColumnHeader.style.display = 'none'
        cartTotalColumnHeader.style.display = 'none'
        cartHeader.setAttribute('colspan', 2)
        cartFootSubtotalLabel.setAttribute('colspan', 1)
        cartPriceColumns.forEach(col => {
            col.setAttribute('colspan', 0)
            col.style.display = 'none'
        })
        cartTotalColumns.forEach(col => {
            col.setAttribute('colspan', 0)
            col.style.display = 'none'
        })
    }
})
window.addEventListener('resize', () => {
    if (window.innerWidth < 500) {
        cartPageTable.style.width = '40%'
        cartPageTable.style.margin = '20px auto'
        cartPriceColumnHeader.setAttribute('colspan', 0)
        cartTotalColumnHeader.setAttribute('colspan', 0)
        cartPriceColumnHeader.style.display = 'none'
        cartTotalColumnHeader.style.display = 'none'
        cartHeader.setAttribute('colspan', 2)
        cartFootSubtotalLabel.setAttribute('colspan', 1)
        cartPriceColumns.forEach(col => {
            col.setAttribute('colspan', 0)
            col.style.display = 'none'
        })
        cartTotalColumns.forEach(col => {
            col.setAttribute('colspan', 0)
            col.style.display = 'none'
        })
    } else {
        cartPageTable.style.width = ''
        cartPageTable.style.margin = ''
        cartPriceColumnHeader.setAttribute('colspan', 1)
        cartTotalColumnHeader.setAttribute('colspan', 1)
        cartPriceColumnHeader.style.display = ''
        cartTotalColumnHeader.style.display = ''
        cartHeader.setAttribute('colspan', 4)
        cartFootSubtotalLabel.setAttribute('colspan', 3)
        cartPriceColumns.forEach(col => {
            col.setAttribute('colspan', 1)
            col.style.display = ''
        })
        cartTotalColumns.forEach(col => {
            col.setAttribute('colspan', 1)
            col.style.display = ''
        })
    }
})


function deleteSingleLocalStorageItem(ID) {
    const currentArr = JSON.parse(localStorage.getItem('cart'))
    const newArr = currentArr.filter(product => product.productID !== ID)
    localStorage.setItem('cart', JSON.stringify(newArr))
    window.location.reload()
    return
}