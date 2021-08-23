class LrFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<span>&copy;2020-21 Walter J. Ong, S.J. Center for Digital Humanities</span>
        <img src="https://religioninplace.org/blog/wp-content/uploads/2020/04/logo_low-1.jpg">
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
        <header>
            <h1 class="center">Lived Religion in a Digital Age: St Louis</h1>
        </header>
        <nav>
            <a href="experiences.html">Experiences</a>
            <a href="map.html">Map View</a>
        </nav>`
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
