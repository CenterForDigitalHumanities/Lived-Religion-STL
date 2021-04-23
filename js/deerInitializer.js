/**
 * @module DEER Data Encoding and Exhibition for RERUM (DEER)
 * @author Patrick Cuba <cubap@slu.edu>
 
 * This code should serve as a basis for developers wishing to
 * use TinyThings as a RERUM proxy for an application for data entry,
 * especially within the Eventities model.
 * @see tiny.rerum.io
 */

// Identify an alternate config location or only overwrite some items below.
import { default as DEER } from 'https://centerfordigitalhumanities.github.io/deer/releases/alpha-.11/deer-config.js'

// Identify a UTILS package
import { default as UTILS } from 'https://centerfordigitalhumanities.github.io/deer/releases/alpha-.11/deer-utils.js'
UTILS.getSafeValue = (property, alsoPeek, asType) => property ? UTILS.getValue(property, alsoPeek, asType) : ""

DEER.URLS = {
    QUERY: "http://tiny.rerum.io/app/query",
    BASE_ID: "http://store.rerum.io/v1"
}

DEER.TEMPLATES.Event = function (experienceData, options = {}) {
    try {
        let tmpl = `<h2>${UTILS.getLabel(experienceData)}</h2>
        <dl>`
        let contributors = experienceData.contributor ? UTILS.getSafeValue(experienceData.contributor) : { "items": [] }
        let people = experienceData.attendee ? UTILS.getSafeValue(experienceData.attendee) : { "items": [] }
        let relatedObjects = experienceData.object ? UTILS.getSafeValue(experienceData.object) : { "items": [] }
        let relatedSenses = experienceData.relatedSenses ? UTILS.getSafeValue(experienceData.relatedSenses) : { "items": [] }
        let relatedPractices = experienceData.relatedPractices ? UTILS.getSafeValue(experienceData.relatedPractices) : { "items": [] }
        let place = experienceData.location ? UTILS.getSafeValue(experienceData.location) : " no location "
        let date = experienceData.startDate ? UTILS.getSafeValue(experienceData.startDate) : " no date "
        let description = experienceData.description ? UTILS.getSafeValue(experienceData.description) : " no description "

        //experienceData.location is most likely a String that is a URI, we want the label
        let placeLabelHTML = ""
        if (typeof place === "object") {
            //Then the URI is the value
            let placeURI = UTILS.getSafeValue(place)
            if (placeURI.indexOf("http://") > -1 || placeURI.indexOf("https://") > -1) {
                placeLabelHTML = `<a href="place.html?id=${placeURI}"><deer-view deer-id="${placeURI}" deer-template="label"></deer-view></a>`
            }
            else {
                //We know it is just a string of some kind, probably the label they want to display, so just use it.
                //TODO what should we do here?
                placeLabelHTML = placeURI
            }
        }
        else {
            // The URI is this string, probably
            if (place.indexOf("http://") > -1 || place.indexOf("https://") > -1) {
                //Gamble that it is a resolvable ID...
                placeLabelHTML = `<a href="place.html?id=${place}"><deer-view deer-id="${place}" deer-template="label"></deer-view></a>`
            }
            else {
                //We know it is just a string of some kind, probably the label they want to display, so just use it.
                placeLabelHTML = place
            }
        }

        //experienceData.contributors is probably a Set or List of URIs and we want their labels
        let contributorsByName = ``
        contributors.items.filter(v => v.length > 0).forEach((val) => {
            let name = ""
            if (typeof val === "object") {
                let itemURI = UTILS.getSafeValue(val)
                if (itemURI.indexOf("http://") > -1 || itemURI.indexOf("https://") > -1) {
                    //item.value is a string and it is a URI value, as expected.
                    name = `<li><deer-view deer-id="${itemURI}" deer-template="label"></deer-view></li>`
                }
                else {
                    //We know it is just a string of some kind, probably the label they want to display, so just use it.
                    //TODO what should we do here?
                    name = `<li> ${itemURI} </li>`
                }
            }
            else {
                if (val.indexOf("http://") > -1 || val.indexOf("https://") > -1) {
                    //item is a string and it is a URI value, as expected.
                    name = `<li><deer-view deer-id="${val}" deer-template="label"></deer-view></li>`
                }
                else {
                    //We know it is just a string of some kind, probably the label they want to display, so just use it.
                    //TODO what should we do here?
                    name = `<li> ${val || " no contributors recorded "} </li>`
                }
            }
            contributorsByName += name
        })

        //experienceData.contributors is probably a Set or List of URIs and we want their labels
        let peopleByName = ``
        people.items.filter(v => v.length > 0).forEach((val) => {
            let name = ""
            if (typeof val === "object") {
                let itemURI = UTILS.getSafeValue(val)
                if (itemURI.indexOf("http://") > -1 || itemURI.indexOf("https://") > -1) {
                    //item.value is a string and it is a URI value, as expected.
                    name = `<li><deer-view deer-id="${itemURI}" deer-template="label"></deer-view></li>`
                }
                else {
                    //We know it is just a string of some kind, probably the label they want to display, so just use it.
                    //TODO what should we do here?
                    name = `<li> ${itemURI} </li>`
                }
            }
            else if (typeof val === "string") {
                if (val.indexOf("http://") > -1 || val.indexOf("https://") > -1) {
                    //item is a string and it is a URI value, as expected.
                    name = `<li><deer-view deer-id="${val}" deer-template="label"></deer-view></li>`
                }
                else {
                    //We know it is just a string of some kind, probably the label they want to display, so just use it.
                    //TODO what should we do here?
                    name = `<li> ${val} </li>`
                }
            } else {
                name += `<li> no people recorded </li>`
            }
            peopleByName += name
        })
        //Gather relatedObjects, an array of URIs
        let relatedObjectsByName = ``
        //experienceData.relatedObjects is probably a Set or List of String URIs, we want their label
        relatedObjects.items.filter(v => v.length > 0).forEach((val) => {
            let name = ""
            if (typeof val === "object") {
                //See if the value is the URI we want
                let itemURI = UTILS.getSafeValue(val)
                if (itemURI.indexOf("http://") > -1 || itemURI.indexOf("https://") > -1) {
                    name = `
                    <li>
                        <a href="object.html?id=${itemURI}><deer-view deer-id="${itemURI}" deer-template="label"></deer-view></a>
                    </li>
                    `
                }
                else {
                    //We know it is just a string of some kind.  Just use it.
                    //TODO what should we do here?
                    name = `
                    <li>
                        ${itemURI}
                    </li>
                    `
                }
            }
            else if (typeof val === "string") {
                if (val.indexOf("http://") > -1 || val.indexOf("https://") > -1) {
                    //We expect this is item entry is the URI we were looking for
                    name = `
                    <li>
                        <a href="object.html?id=${val}"><deer-view deer-id="${val}" deer-template="label"></deer-view></a>
                    </li>
                    `
                }
                else {
                    //We know it is just a string of some kind and not the URI, so we can show this string.  
                    //TODO what should we do here?
                    name = `
                    <li>
                        ${val}
                    </li>
                    `
                }
            } else {
                name += `<li> no objects recorded </li>`
            }
            relatedObjectsByName += name
        })
        let objectsHTML = `
            <h4>Objects at Experience "${UTILS.getLabel(experienceData)}"</h4>
            <ul id="objectsInExperience">
                ${relatedObjectsByName}
            </ul>
        `

        //Gather relatedPractices, an array of URIs
        let relatedPracticesByName = ``
        //experienceData.relatedPractices is probably a Set or List of String URIs, we want their label
        relatedPractices.items.filter(v => v.length > 0).forEach((val) => {
            let name = ""
            if (typeof val === "object") {
                //See if the value is the URI we want
                let itemURI = UTILS.getSafeValue(val)
                if (itemURI.indexOf("http://") > -1 || itemURI.indexOf("https://") > -1) {
                    name = `
                    <li>
                        <deer-view deer-id="${itemURI}" deer-template="label"></deer-view>
                    </li>
                    `
                }
                else {
                    //We know it is just a string of some kind.  Just use it.
                    //TODO what should we do here?
                    name = `
                    <li>
                        ${itemURI}
                    </li>
                    `
                }
            }
            else if (typeof val === "string") {
                if (val.indexOf("http://") > -1 || val.indexOf("https://") > -1) {
                    //We expect this is item entry is the URI we were looking for
                    name = `
                    <li>
                        <deer-view deer-id="${val}" deer-template="label"></deer-view>
                    </li>
                    `
                }
                else {
                    //We know it is just a string of some kind and not the URI, so we can show this string.  
                    //TODO what should we do here?
                    name = `
                    <li>
                        ${val}
                    </li>
                    `
                }
            } else {
                name += `<li> no practices recorded </li>`
            }
            relatedPracticesByName += name
        })
        let practicesHTML = `
            <h4>Practices at Experience "${UTILS.getLabel(experienceData)}"</h4>
            <ul id="practicesInExperience">
                ${relatedPracticesByName}
            </ul>
        `

        //Gather relatedSenses, an array of URIs
        let relatedSensesByName = ``
        //experienceData.relatedSenses is probably a Set or List of String URIs, we want their label
        relatedSenses.items.filter(v => v.length > 0).forEach((val) => {
            let name = ""
            if (typeof val === "object") {
                //See if the value is the URI we want
                let itemURI = UTILS.getSafeValue(val)
                if (itemURI.indexOf("http://") > -1 || itemURI.indexOf("https://") > -1) {
                    name = `
                    <li>
                        <deer-view deer-id="${itemURI}" deer-template="mostUpToLabelHelper"></deer-view>
                    </li>
                    `
                }
                else {
                    //We know it is just a string of some kind.  Just use it.
                    //TODO what should we do here?
                    name = `
                    <li>
                        ${itemURI}
                    </li>
                    `
                }
            }
            else if (typeof val === "string") {
                if (val.indexOf("http://") > -1 || val.indexOf("https://") > -1) {
                    //We expect this is item entry is the URI we were looking for
                    name = `
                    <li>
                        <deer-view deer-id="${val}" deer-template="label"></deer-view>
                    </li>
                    `
                }
                else {
                    //We know it is just a string of some kind and not the URI, so we can show this string.  
                    //TODO what should we do here?
                    name = `
                    <li>
                        ${val}
                    </li>
                    `
                }
            } else {
                name += `<li> no senses recorded </li>`
            }
            relatedSensesByName += name
        })
        let sensesHTML = `
            <h4>Senses at Experience "${UTILS.getLabel(experienceData)}"</h4>
            <ul id="sensesInExperience">
                ${relatedSensesByName}
            </ul>
        `
        let researchersHTML = `<dt>LRDA Researchers Involved</dt><dd><ul id="researchersInExperience">${contributorsByName}</ul></dd>`
        let peopleHTML = `<dt>People Involved</dt><dd><ul id="peopleInExperience">${peopleByName}</ul></dd>`
        let placeHTML = `<dt>Location</dt><dd>${placeLabelHTML}</dd>`
        let dateHTML = `<dt>Associated Date</dt><dd>${date}</dd>`
        let descriptionHTML = `<dt>Description</dt><dd>${description}</dd>`
        let artifactsHTML = objectsHTML + practicesHTML + sensesHTML

        tmpl += placeHTML + dateHTML + researchersHTML + peopleHTML + descriptionHTML + artifactsHTML
        return tmpl
    } catch (err) {
        console.log("Could not build Event-detail template.")
        console.error(err)
        return null
    }
}

/**
 * This is to override the normal behavior for drawing collection types.  
 * We need the targetCollection annotation ID exposed for removal
 * We need all eleemtns that cause removal to be classed so we can hide/show them.  
 * We need the most up to date label/name to appear.
 * @param {type} obj
 * @param {type} options
 * @return {tmpl}
 */

DEER.TEMPLATES.completeLabel = function (obj, options = {}) {
    try {
        let key = options.key || "@id"
        let prop = obj[key] || "[ undefined ]"
        let label = options.label || UTILS.getLabel(obj, prop)
        let isDescribed = obj["@type"] === "Researcher" || Object.keys(obj).some(i => ["description", "geometry", "email", "fieldNotes"].includes(i))
        return isDescribed ? `${label}` : `<span class="needs-more" title="This entry may require more details">${label}</span>`
    } catch (err) {
        console.log("Could not build complete label template.")
        console.error(err)
        return null
    }
}

/**
 * Ensure the most up to date additionalType annotation is gathered.  Often used when rendering collection items.
 * Using a template ensures that expand(obj) has happened, so we have all up to date annotations in obj.
 * @param {Object} obj some obj  containing some label annotating it.
 */
DEER.TEMPLATES.mostUpToDateAdditionalTypeHelper = function (obj, options = {}) {
    try {
        let at = options.additionalType ? UTILS.getSafeValue(options.additionalType) : obj.additionalType ? UTILS.getSafeValue(obj.additionalType) : ""
        return at
    } catch (err) {
        console.log("Could not build most up to date additional type template.")
        console.error(err)
        return null
    }
}

DEER.TEMPLATES.object = function (obj, options = {}) {
    try {
        return `
        <h2>${UTILS.getSafeValue(obj.name)}</h2>
        <dl>
        
        <dt>Type:</dt>
        <dd> ${UTILS.getSafeValue(obj.additionalType)}</dd>

        <dt>Former Locations:</dt>
        <dd> ${obj.FormerLocations && UTILS.getSafeValue(obj.FormerLocations).items.reduce((a, b, i) => a += `<deer-view deer-template="completeLabel" deer-id="${b}">${i}</deer-view>`, ``)}</dd>

        <dt>Former Uses:</dt>
        <dd> ${obj.FormerUses && UTILS.getSafeValue(obj.FormerUses).items.join(", ")}</dd>
        
        <dt>Material:</dt>
        <dd> ${UTILS.getSafeValue(obj.material)}</dd>
        
        <dt>Typical Use:</dt>
        <dd> ${UTILS.getSafeValue(obj.purpose)}</dd>
        
        <dt>Depiction:</dt>
        <dd> <a href="${UTILS.getSafeValue(obj.image)}">${UTILS.getSafeValue(obj.image) || "no record"}</a> </dd>
        
        <dt>Recordings:</dt>
        <dd> <a href="${UTILS.getSafeValue(obj.associatedMedia)}">${UTILS.getSafeValue(obj.associatedMedia) || "no record"}</a> </dd>

        </dl>
        `
    } catch (err) {
        return null
    }
}

let LR_primitives = ["additionalType"]
//let LR_experience_primitives = ["startDate", "location", "event", "relatedSenses", "relatedPractices", "relatedObjects"]
let DEERprimitives = DEER.PRIMITIVES
DEER.PRIMITIVES = [...DEERprimitives, ...LR_primitives]

// Render is probably needed by all items, but can be removed.
// CDN at https://centerfordigitalhumanities.github.io/deer/releases/
import { default as renderer, initializeDeerViews } from 'https://centerfordigitalhumanities.github.io/deer/releases/alpha-.11/deer-render.js'

// fire up the element detection as needed
initializeDeerViews(DEER)
