const categoryListToggleBtn = document.querySelector('.js-btn-toggle')
const categoryList = document.querySelector('.js-category-list')
const productSearchBarContainer = document.querySelector('[data-search-container]')
const productSearchBar = document.querySelector('[data-search-bar]')
const searchResultTemplate = document.querySelector('[data-search-template]')
const noSearchItemsMsg = document.querySelector('.no-search-items')
const categoriesSection = document.querySelector('.categories')
let productsArr
let searchBar

axios.get('/get-all-products')
    .then(res =>  {
        productsArr = res.data.products
        searchBar = productsArr.map(doc => {
            const result = searchResultTemplate.content.cloneNode(true).children[0]
            const body = result.querySelector('[data-result-link-body]')
            body.setAttribute("href", `/shop/${doc._id}`)
            body.innerHTML = `
                <div class="result-header-img">
                    <img src="/uploads/resized-images/primary-product-images/${doc.imgName}" alt="Image of ${doc.name} in search bar" height="50">
                </div>
                <div data-result-header-name>${doc.name}</div>
            `
            result.classList.toggle('js-display-none')
            productSearchBarContainer.append(result)
            return {name: doc.name, price: doc.price, desc: doc.desc, card: result}
        })
        let categoryArr = []
        productsArr.forEach(product => {
            if (categoryArr.some(el => el.category === product.category)) {
                let i = categoryArr.findIndex(el => el.category === product.category)
                return categoryArr[i].amount += 1
            }
            categoryArr.push({category: product.category, amount: 1})
        })
        categoryArr.push({category: 'All', amount: productsArr.length})
        categoryArr.sort((a, b) => a.category.toLowerCase() > b.category.toLowerCase() ? 1 : -1);
        categoryArr.forEach(category => {
            const categoryLi = document.createElement('li')
            categoryLi.classList.add('category')
            categoryLi.innerHTML = `${category.category} <span class='shop-page-category-amount'>${category.amount}</span>`
            categoryLi.dataset.category = category.category
            categoryList.appendChild(categoryLi)
        })
        const categories = document.querySelectorAll('.category')
        categories.forEach(category => {
            if (category.dataset.category !== 'All') {
                category.addEventListener('click', (e) => {
                    const urlData = new URLSearchParams(window.location.search)
                    urlData.set('category', `${category.dataset.category}`)
                    const newUrl = new URL(window.location.href)
                    newUrl.search = urlData
                    window.location.href = newUrl
                })
            } else {
                category.addEventListener('click', () => {
                    const newUrl = window.origin + '/shop'
                    if (window.location.href === newUrl) {
                        window.location.reload()
                    } else {
                        window.location.href = newUrl
                    }
                })
            }
        })
            
    })
    .catch(err => {
        console.log(err)
    }
)
console.log(window.location)
console.log(window.origin + '/shop')
const currentSearch = new URLSearchParams(window.location.search)
const shopPageHeader = document.querySelector('.shop-page-header')

if (!currentSearch.get('category') || currentSearch.get('category') == null) {
    shopPageHeader.innerText = 'All'
} else {
    shopPageHeader.innerText = currentSearch.get('category')
}

productSearchBar.addEventListener('input', (e) => {
    let value = e.target.value.toLowerCase()
    let visibileArr = []
    let noItems = false;
    searchBar.forEach((doc, i) => {
        let isVisible = doc.name.includes(value)
        visibileArr.push(isVisible)
        if (value === '') isVisible = false
        doc.card.classList.toggle('js-display-none', !isVisible)
    })
    if (!visibileArr.includes(true) && value !== '') {
        noItems = true
    } else {
        noItems = false
    }
    noSearchItemsMsg.classList.toggle('js-display-none', !noItems)
})



const productListingsSorting = document.querySelector('.product-listings-sort-selection')

productListingsSorting.addEventListener('change', (e) => {
    if (e.target.value.toLowerCase() === 'featured') {
        const urlData = new URLSearchParams(window.location.search)
        urlData.set('featured', true)
        const newUrl = new URL(window.location.href)
        newUrl.search = urlData
        window.location.href = newUrl
    } else if (e.target.value.toLowerCase() === 'default') {
        let urlData = new URLSearchParams(window.location.search)
        let updatedUrlData = new URLSearchParams({category: urlData.get("category")})
        if (updatedUrlData.get('category') !== 'null') {
            const newUrl = new URL(window.location.href)
            newUrl.search = updatedUrlData
            window.location.href = newUrl
        } else {
            const newUrl = new URL(window.location.href)
            newUrl.search = ''
            window.location.href = newUrl
        }
    } else if (e.target.value.toLowerCase() === 'highest to lowest') {
        let urlData = new URLSearchParams(window.location.search)
        urlData.set('sort', '-price')
        const newUrl = new URL(window.location.href)
        newUrl.search = urlData
        window.location.href = newUrl
    } else if (e.target.value.toLowerCase() === 'lowest to highest') {
        let urlData = new URLSearchParams(window.location.search)
        urlData.set('sort', 'price')
        const newUrl = new URL(window.location.href)
        newUrl.search = urlData
        window.location.href = newUrl
    }
})

const productListingDisplay = document.querySelector('.product-listing-display')
const productListings = Array.from(productListingDisplay.children)
const productImgs = document.querySelectorAll('.product-listing-image')
                
                
categoryListToggleBtn.addEventListener('click', () => {
    categoriesSection.classList.toggle('zero-width')
})
const shopPageSidebarMobileXBtn = document.querySelector('.shop-page-sidebar-modile-x-button-container')

shopPageSidebarMobileXBtn.children[0].addEventListener('click', () => {
    if (window.innerWidth <= 350) {
        categoriesSection.classList.toggle('zero-width', 'hunnid-width')
    } else {
        categoriesSection.classList.toggle('zero-width')
    }
})