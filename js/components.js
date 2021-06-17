class LrFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<span>&copy;2020 Walter J. Ong, S.J. Center for Digital Humanities</span>
        <img src="https://www.slu.edu/marcom/tools-downloads/imgs/logo/left-aligned/slu_logoleftaligned_rgb.png">
        <img src="https://blog.ongcdh.org/blog/wp-content/uploads/2018/05/logo-dark.png">
        `
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
        // <a href="index.html"><img src="https://upload.wikimedia.org/wikipedia/commons/3/3d/Meuble_h%C3%A9raldique_Fleur_de_lis.svg"></a>
        this.innerHTML = `
            <a href="experiences.html">Experiences</a>
            <a href="map.html">Map View</a>
        `
        this.classList.add('nav')
    }
}
customElements.define("lr-nav", LrNav)

class LrGlobalFeedback extends HTMLElement {
    constructor() {
        super()
        this.innerHTML = `
            <div id="globalFeedback"> Welcome! </div>
        `
    }
}
customElements.define("lr-global-feedback", LrGlobalFeedback)
