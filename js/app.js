/**
 * Lived Religions
 * @author Bryan Haberberger <bryan.j.haberberger@slu.edu>
 *
 */

const LR = {}
LR.VERSION = "1.0.0"
LR.APPAGENT = "http://store.rerum.io/v1/id/5da8c165d5de6ba6e2028474"
LR.EXPERIENCE_COLLECTION = "http://store.rerum.io/v1/id/LRDAList"
LR.CONTEXT = "http://lived-religion.rerum.io/deer-lr/vocab/context.json"
LR.URLS = {
    BASE_ID: "http://store.rerum.io/v1",
    QUERY: "http://tiny.rerum.io/app/query",
    SINCE: "http://store.rerum.io/v1/since"
}

LR.ui = {}
LR.utils = {}

/**
 * A convention where area="xyz" will line up with tog="xyz" on some element(s) to toggle. 
 * @param {type} event
 * @return {undefined}
 */
LR.ui.toggleAreas = function (event) {
    let area = event.target.getAttribute("area")
    let elems = document.querySelectorAll("div[tog='" + area + "']")
    for (let elem of elems) {
        if (elem.classList.contains("is-hidden")) {
            elem.classList.remove("is-hidden")
        }
        else {
            elem.classList.add("is-hidden")
        }
    }
}

/**
 * A convention where area="xyz" will line up with tog="xyz" on some element(s) to toggle. 
 * @param {type} event
 * @return {undefined}
 */
LR.ui.toggleAreaHideOthers = function (event) {
    let area = event.target.getAttribute("area")
    let elems = document.querySelectorAll("div[tog='" + area + "']")
    let all = document.querySelectorAll("div[tog]")
    for (let elem of all) {
        if (elem.getAttribute("tog") && elem.getAttribute("tog") === area) {
            if (elem.classList.contains("is-hidden")) {
                elem.classList.remove("is-hidden")
            }
            else {
                elem.classList.add("is-hidden")
            }
        }
        else {
            elem.classList.add("is-hidden")
        }
    }
}

/*
 * Proide a feedback message for visitors.  This is meant to encompas any generic feedback message.
 * @param {DOMEvent} The event triggering this feedback
 * @param {string} message The message to show as feedback
 
 */
LR.ui.globalFeedbackBlip = function (event, message, success) {
    globalFeedback.innerText = message
    globalFeedback.classList.add("show")
    if (success) {
        globalFeedback.classList.add("bg-success")
    } else {
        globalFeedback.classList.add("bg-error")
    }
    setTimeout(function () {
        globalFeedback.classList.remove("show")
        globalFeedback.classList.remove("bg-error")
        // backup to page before the form
        LR.utils.broadcastEvent(event, "globalFeedbackFinished", globalFeedback, { message: message })
    }, 3000)
}

LR.ui.showPopover = function (which, event) {
    console.error("Sorry, these popovers are not ready yet :(")
}

/**
 * A helper function to get the entity ID from the URLs with ?id= parameter.
 * @return {string || null}
 */
LR.utils.getEntityIdFromURL = function () {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('id') ? urlParams.get('id') : null
}

/**
 * Broadcast a message about some event
 * DO NOT collide with DEER events.  
 */
LR.utils.broadcastEvent = function (event = {}, type, element, obj = {}) {
    let e = new CustomEvent(type, { detail: Object.assign(obj, { target: event.target }), bubbles: true })
    element.dispatchEvent(e)
}
/**
 * Type and AdditionalType information has a custom UI around it, so DEER cannot prefill those pieces.
 * Here we have the object with the type  
 * @param {Object} annotationData The expanded containing all annotation data for a form.
 * @param {Array(String)} keys The specific annotations we are looking for in annotationData
 * @param {HTMLElement} form The completely loaded HTML <form> containing the <selects>s
 * @return None
 */
LR.utils.populateCoordinates = function (object, form) {
    let geo = object.hasOwnProperty("geometry") ? object.geometry : {}
    let val = geo.hasOwnProperty("value") ? geo.value : {}
    let coords = val.hasOwnProperty("coordinates") ? val.coordinates : []
    if (coords.length) {
        let long = coords[0]
        let lat = coords[1]
        leafLat.value = lat
        leafLong.value = long
        updateGeometry(null, lat, long)
    }
    else {
        //There is are no coordinates in this geometry object, or geometry was missing
        console.warn("The coordinates for this object are not stored correctly.  Investigate around ")
        console.log(object)
    }
}

/**
 * Helper to populate the widget tracking field notes with the value gathered by expand() functionality.
 * @param {type} experienceLabel
 * @param {type} fieldNotesFromData
 * @return {undefined}
 */
LR.utils.prePopulateFieldNotes = function (fieldNotesFromData) {
    if (fieldNotesFromData !== undefined) {
        let notes_str = (typeof fieldNotesFromData === "object" && fieldNotesFromData.hasOwnProperty("value")) ? fieldNotesFromData.value : fieldNotesFromData
        document.getElementById("fieldNotesEntry").value = notes_str
    }
}
