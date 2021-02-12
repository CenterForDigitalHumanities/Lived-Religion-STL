class LrFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<small>&copy;2020 Walter J. Ong, S.J. Center for Digital Humanities</small>
        <img class="brand" src="https://www.slu.edu/marcom/tools-downloads/imgs/logo/left-aligned/slu_logoleftaligned_rgb.png">
        <img class="brand" src="https://blog.ongcdh.org/blog/wp-content/uploads/2018/05/logo-dark.png">
        `
        this.classList.add('nav', 'nav-center', 'text-primary', 'is-fixed', 'is-full-width', 'is-vertical-align')
        this.style.bottom = 0
        this.style.backgroundColor = "#FFF"
        this.style.zIndex = 1
        let spacer = document.createElement('div')
        spacer.style.position = "relative"
        spacer.style.display = "block"
        spacer.style.height = this.offsetHeight * 1.2 + "px"
        this.parentElement.insertBefore(spacer, this)
    }
}
customElements.define("lr-footer", LrFooter)

class LrNav extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.innerHTML = `<div class="nav-left">
            <a class="brand" href="index.html"><img src="https://upload.wikimedia.org/wikipedia/commons/3/3d/Meuble_h%C3%A9raldique_Fleur_de_lis.svg"></a>
            <div class="tabs">
                <a href="all_experiences.html">Experiences</a>
                <a href="map.html">Map View</a>
            </div>
        </div>`
        this.classList.add('nav')
    }
}
customElements.define("lr-nav", LrNav)

class LrGlobalFeedback extends HTMLElement {
    constructor() {
        super()
            this.innerHTML = `
            <div id="globalFeedback" class="bg-success text-white card"> Welcome! </div>
        `
    }
}
customElements.define("lr-global-feedback", LrGlobalFeedback)