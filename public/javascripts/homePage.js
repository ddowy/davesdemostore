const sliderImg = document.querySelector('.slider-img')

const config = {
    type: 'carousel',
    autoplay: 4000,
    hoverpause: false,
}
const gliedeInstance = new Glide('.glide', config)
gliedeInstance.mount()

const slides = document.querySelectorAll('.glide__slide')

window.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth < 850) {
        slides.forEach(slide => {
            slide.children[0].style.width = `${window.innerWidth - 50}px`
        })
    } else {
        slides.forEach(slide => {
            slide.children[0].style.width = ''
        })
    }
})


window.addEventListener('resize', () => {
    if (window.innerWidth < 850) {
        slides.forEach(slide => {
            slide.children[0].style.width = `${window.innerWidth - 50}px`
        })
    } else {
        slides.forEach(slide => {
            slide.children[0].style.width = ''
        })
    }
})
