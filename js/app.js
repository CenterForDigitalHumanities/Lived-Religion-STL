/**
 * Lived Religions
 * @author Bryan Haberberger <bryan.j.haberberger@slu.edu>
 *
 */

const LR = {}
LR.VERSION = "1.0.0"
LR.APPAGENT = "http://store.rerum.io/v1/id/5da8c165d5de6ba6e2028474"
//LR.APPAGENT = "http://devstore.rerum.io/v1/id/5afeebf3e4b0b0d588705d90"

LR.CONTEXT = "http://lived-religion.rerum.io/deer-lr/vocab/context.json"

///For dev-01
//LR.URLS = {
//    LOGIN: "login",
//    LOGOUT: "logout",
//    BASE_ID: "http://devstore.rerum.io/v1",
//    DELETE: "http://tinydev.rerum.io/app/delete",
//    CREATE: "http://tinydev.rerum.io/app/create",
//    UPDATE: "http://tinydev.rerum.io/app/update",
//    OVERWRITE: "http://tinydev.rerum.io/app/overwrite",
//    QUERY: "http://tinydev.rerum.io/app/query",
//    SINCE: "http://devstore.rerum.io/v1/since"
//}

//For prd-01
LR.URLS = {
    LOGIN: "login",
    LOGOUT: "logout",
    BASE_ID: "http://store.rerum.io/v1",
    DELETE: "delete",
    CREATE: "create",
    UPDATE: "update",
    OVERWRITE: "overwrite",
    QUERY: "query",
    SINCE: "http://store.rerum.io/v1/since"
}

LR.INPUTS = ["input", "textarea", "dataset", "select"]
if (typeof(Storage) !== "undefined") {
    LR.localInfo = window.localStorage
} else {
    alert("Please update your browser or use a different browser, this one is not supported. Sorry for the inconvenience.")
}
LR.ui = {}
LR.utils = {}

/**
 * Each interface has something triggered by user roles.  Implement contributor vs. admin
 * UI/UX here.  
 * @param {string} interface The name of the interface to draw
 * @param {object} user The user from localStorage or an event, parsed into JSON already
 * @param {string || null} entityID If ?id= was on the page, then there is an entity to load.
 * @return {undefined}
 */
LR.ui.setInterfaceBasedOnRole = function(interface, user, entityID){
    switch(interface){
        case "experience":
            if (entityID) {
                if(user.roles.administrator){
                    theExperience.setAttribute("deer-id", entityID)
                    document.getElementById("startExperience").classList.add("is-hidden")
                    document.getElementById("experienceArtifacts").classList.remove("is-hidden")
                    document.getElementById("experienceReview").classList.remove("is-hidden")
                    document.getElementById("fieldNotesFloater").classList.remove("is-hidden")
                }
                else{
                    //Determine if the current user is the creator of this entity.  If so, they can view it.
                    //Note that if we need to do this elsewhere, this should become a helper function.
                    new Promise( resolve => {
                        resolve(LR.utils.isCreator(user["@id"], entityID))
                    })
                    .then(permitted => {
                        if(permitted){
                            theExperience.setAttribute("deer-id", entityID)
                            document.getElementById("startExperience").classList.add("is-hidden")
                            document.getElementById("experienceArtifacts").classList.remove("is-hidden")
                            document.getElementById("experienceReview").classList.remove("is-hidden")
                            document.getElementById("fieldNotesFloater").classList.remove("is-hidden")
                        }
                        else{
                            alert("Only an administrator can review this experience.  If this is your experience, contact an administrator.")
                            document.location.href = "dashboard.html"
                        }
                    })
                    .catch(err => {
                        console.error(err)
                        alert("There was an error checking permissions for this experience.  Try again.")
                        document.location.href = "dashboard.html"
                    }) 
                }
            }
        break
        case "object":
        case "person":
        case "place":
            let entity_form = document.querySelector("form[deer-type]")
            if (entityID) {
                if (user.roles.administrator) {
                    entity_form.setAttribute("deer-id", entityID)
                    document.querySelector("h2.text-primary").innerHTML = "Update Object"
                    document.querySelector("input[type='submit']").value = "Update"
                    let btn = document.createElement("a")
                    btn.href = window.location.pathname
                    btn.innerHTML = "Reset Page"
                    entity_form.append(btn)
                }
                else{
                    alert("Only administrators can review and edit entity details at this time.")
                    document.location.href="dashboard.html"
                }
            }
        break
        case "researcher":
            if (user.roles.administrator) {
                if (entityID) {
                    researcherForm.setAttribute("deer-id", entityID)
                    document.querySelector("h2.text-primary").innerHTML = "Update Researcher"
                    document.querySelector("input[type='submit']").value = "Update"
                    let btn = document.createElement("a")
                    btn.href = window.location.pathname
                    btn.innerHTML = "Reset Page"
                    researcherForm.append(btn)
                }
            }
            else{
                alert("You must be logged in as an administrator to use this!")
                document.location.href="dashboard.html"
            }
        break
        case "objects":
        case "people":
        case "places":
            if (user.roles.administrator) {
                for (let elem of event.target.querySelectorAll('.removeCollectionItem')) elem.style.display = 'inline-block'
            }         
        break
        case "researchers":
            if (user.roles.administrator) {
                for (let elem of event.target.querySelectorAll('.removeCollectionItem')) elem.style.display = 'inline-block'
            }
            else{
                alert("You must be logged in as an administrator to use this!")
                document.location.href="dashboard.html"
            }
        break
        case "userManagement":
            if (user.roles.administrator) {
                UM.interaction.drawUserManagement()
            }
            else{
                alert("You must be logged in as an administrator to use this!")
                document.location.href="dashboard.html"
            }    
        break
        case "experienceManagement":
            if (user.roles.administrator) {
                experiences.classList.remove("is-hidden")
                for (let elem of event.target.querySelectorAll('.removeCollectionItem')) elem.style.display = 'inline-block'
            }
            else{
                alert("You must be logged in as an administrator to use this!")
                document.location.href="dashboard.html"
            }
        break
        case "dashboard":
            LR.ui.getUserEntries(user)
            if (user.roles.administrator) {
                let adminTabs = `<a href="users.html">Users</a>
                <a href="researchers.html">Researchers</a>
                <a href="all_experiences.html">Experiences</a>`
                document.querySelector('.tabs').innerHTML += adminTabs
            }
        break
        default:
            alert("This interface is not yet supported")
            document.location.href = "dashboard.html"
    }
}

/**
 * A convention where area="xyz" will line up with tog="xyz" on some element(s) to toggle. 
 * @param {type} event
 * @return {undefined}
 */
LR.ui.toggleAreas = function(event){
    let area = event.target.getAttribute("area")
    let elems = document.querySelectorAll("div[tog='"+area+"']")
    for(let elem of elems){
        if(elem.classList.contains("is-hidden")){
            elem.classList.remove("is-hidden")
        }  
        else{
            elem.classList.add("is-hidden")
        }
    }
}

/**
 * A convention where area="xyz" will line up with tog="xyz" on some element(s) to toggle. 
 * @param {type} event
 * @return {undefined}
 */
LR.ui.toggleAreaHideOthers = function(event){
    let area = event.target.getAttribute("area")
    let elems = document.querySelectorAll("div[tog='"+area+"']")
    let all = document.querySelectorAll("div[tog]")
    for(let elem of all){
        if (elem.getAttribute("tog") && elem.getAttribute("tog") === area){
            if(elem.classList.contains("is-hidden")){
                elem.classList.remove("is-hidden")
            }  
            else{
                elem.classList.add("is-hidden")
            }
        }
        else{
            elem.classList.add("is-hidden")
        }
    }
}

/**
 * 
 * @param {type} event
 * @return {undefined}
 */
LR.ui.toggleFieldNotes = function(event){
    let floater = document.getElementById("fieldNotesFloater")
    if(floater.getAttribute("expanded") === "true"){
        floater.setAttribute("expanded", "false")
        floater.style.width = "40px"
        floater.style.height = "40px"
        floater.style["box-shadow"] = "none"
        document.querySelectorAll(".fieldNotesInnards").forEach(elem => elem.classList.add("is-hidden"))
    }
    else{
        floater.setAttribute("expanded", "true")
        floater.style.width = "550px"
        floater.style.height = "400px"
        floater.style["box-shadow"] = "1px 1px 18px black"
        document.querySelectorAll(".fieldNotesInnards").forEach(elem => elem.classList.remove("is-hidden"))
    }
    
}

LR.ui.toggleEntityAddition = function(event, areaToToggle){
    if(areaToToggle){
        if(areaToToggle.classList.contains("is-hidden")){
            areaToToggle.classList.remove("is-hidden")
            document.querySelector(".pageShade").classList.remove("is-hidden")
            areaToToggle.querySelector("input").value = ""
            //event.target.innerHTML = "&#8722;"
        }
        else{
            areaToToggle.classList.add("is-hidden")
            document.querySelector(".pageShade").classList.add("is-hidden")
            //event.target.innerHTML = "&#x2b;"
        }
    }
}

/*
 * Proide a feedback message for users.  This is meant to encompas any generic feedback message.
 * @param {DOMEvent} The event triggering this feedback
 * @param {string} message The message to show as feedback
 
 */
LR.ui.globalFeedbackBlip = function(event, message, success){
    globalFeedback.innerText = message
    globalFeedback.classList.add("show")
    if(success){
        globalFeedback.classList.add("bg-success")
    } else {
        globalFeedback.classList.add("bg-error")
    }
    setTimeout(function(){ 
        globalFeedback.classList.remove("show")
        globalFeedback.classList.remove("bg-error")
        // backup to page before the form
        LR.utils.broadcastEvent(event, "globalFeedbackFinished", globalFeedback, { message: message })
    }, 3000)
}

LR.ui.showPopover = function(which, event){
    console.error("Sorry, these popovers are not ready yet :(")
}


/**
 * A helper function to get the entity ID from the URLs with ?id= parameter.
 * @return {string || null}
 */
LR.utils.getEntityIdFromURL = function(){
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('id') ? urlParams.get('id') : null
}

/**
 * An abstract method to handle which interface to trigger.  Each interface needs to know the user and which interface.
 * Either local storage or the event that triggered this will know the user.  If not, then don't pretend to.
 * @param {object} event LRUserKnown or deer-loaded event
 * @param {string} interface The name of the interface to load. 
 * @return {undefined}
 */
LR.utils.drawInterface = function (event, interface){
    let user = localStorage.getItem("lr-user") ? localStorage.getItem("lr-user") : (event.detail && event.detail.user) ? event.detail.user : null
    if(typeof user === "string"){
        try{
            user = JSON.parse(user)
        }
        catch(err){
            console.error(err)
            user = null
        }
    }
    if (user !== null) {
        LR.utils.setUserAttributionFields(user)
        LR.ui.setInterfaceBasedOnRole(interface, user, LR.utils.getEntityIdFromURL())
    }
    else {
        console.log("User identity reset; user is null. ")
        document.location.href = "logout.html"
    }
}

/**
 * Broadcast a message about some event
 * DO NOT collide with DEER events.  
 */
LR.utils.broadcastEvent = function(event = {}, type, element, obj = {}) {
    let e = new CustomEvent(type, { detail: Object.assign(obj, { target: event.target }), bubbles: true })
    element.dispatchEvent(e)
}

/**
 * Disassociate a particular object from the experience.  This means that the 'object' annotation on the experience needs alterations.  
 * @param {string} The @id of the particular object
 * @param {string} The @#id of the experience to disaasociate it from
 * @return {Promise}
 */
LR.utils.disassociateObject = function(event, objectID, experienceID){
    let trackedObjs = document.getElementById("objects").value
    let delim = document.getElementById("objects").hasAttribute("deer-array-delimeter") ? document.getElementById("objects").getAttribute("deer-array-delimeter") : ","
    let trackedArr = trackedObjs.split(delim)
    if(trackedArr.indexOf(objectID) > -1){
        trackedObjs =  trackedArr.filter(e => e !== objectID).join(delim)
        document.getElementById("objects").value = trackedObjs
        document.getElementById("objects").$isDirty = true //This DEER thing was tricky to know off hand.  3rd party developers may struggle to know to do this.
        document.getElementById("theExperience").$isDirty = true
        //NOTE form.submit() does not create/fire the submit event.  This is a problem for our 3rd party software, DEER.
        document.getElementById("theExperience").querySelector("input[type='submit']").click()
        //FIXME this should really only happen if the form submit seen above is successful
        event.target.parentNode.remove()
        LR.ui.globalFeedbackBlip(event,`'${event.detail.name||"Item"}' dropped from list`,true)
    }
}

/**
 * Set the required fields for attribution to have a value of this user's @id.
 * This should apply to all <input>s that result in "creator" Annotations (user of this application)
 * It should also set all deer-creator attributes, for DEER.ATTRIBUTION
 * Any HTMLElement that should show the username must also be populated.
 * @param {object} userInfo A JSON object representing the user, the standard Lived Religion user object from event handlers.
 */
LR.utils.setUserAttributionFields = function(userInfo){
    let attributionInputs = ["[deer-key='creator']"] //For annotations that assert a creator
    let attributionFrameworkElems = ["[deer-creator]"] //For DEER framework elements that have deer-creator (DEER.ATTRIBUTION)
    attributionInputs.forEach(selector => document.querySelectorAll(selector).forEach(elem => elem.value = userInfo['@id']))
    document.querySelectorAll(attributionFrameworkElems).forEach(elem => elem.setAttribute("deer-creator",userInfo['@id']))
    //Populate anything that is supposed to know the username
    document.querySelectorAll(".theUserName").forEach(elem => elem.innerHTML = userInfo.name)
}

/**
 * Clear out all DEER attributes and input values of the form so that the next submission of this form creates a new object and new annotations.  
 * @param {HTMLElement} The form to perform this action on
 */
LR.utils.scrubForm = function(form){
    form.removeAttribute("deer-id")
    form.removeAttribute("deer-source")
    form.querySelectorAll(LR.INPUTS.join(",")).forEach(i => {
        //Anything you need to ignore should go here
        if(i.getAttribute("type") !== "submit" && i.getAttribute("deer-key") !== "creator"){
            i.value = ""
            i.removeAttribute("deer-source")
            i.removeAttribute("deeer-id")
        }
    })
    //Special primary type selector
    form.querySelectorAll("[data-rdf").forEach(el => {
        el.classList.remove("bg-light")
    })
}


/**
 * Populate the value of the <input> tracking the options selected in the <select multiple>.
 * @param {type} event A change in the options selected in a <select multipe>.
 * @param {type} fromTemplate Indicates this multi select is from a template and wrapped in a <deer-view> element.
 * @return None
 */
LR.utils.handleMultiSelect = function(event, fromTemplate){
    let sel = event.target
    let selectedTagsArea = sel.nextElementSibling
    selectedTagsArea.innerHTML = ""
    let arr_id = Array.from(sel.selectedOptions).map(option=>option.value)
    let arr_names = Array.from(sel.selectedOptions).map(option=>option.text)
    let input = (fromTemplate) ? sel.parentElement.previousElementSibling : sel.previousElementSibling
    let delim = (input.hasAttribute("deer-array-delimeter")) ? input.getAttribute("deer-array-delimeter") : ","
    let str_arr = arr_id.join(delim)
    arr_names.forEach(selection => {
       let tag = `<span class="tag is-small">${selection}</span>` 
       selectedTagsArea.innerHTML += tag
    })
    input.value=str_arr
    input.setAttribute("value", str_arr)
}

/**
 * 
 * Make sure not to select options outside the <form> and <select> involved here.  
 * @param {Object} annotationData The expanded containing all annotation data for a form.
 * @param {Array(String)} keys The specific annotations we are looking for in annotationData
 * @param {HTMLElement} form The completely loaded HTML <form> containing the <selects>s
 * @return None
 */
LR.utils.preSelectMultiSelects = function(annotationData, keys, form){
    keys.forEach(key =>{
        if(annotationData.hasOwnProperty(key)){
            let data_arr = annotationData[key].hasOwnProperty("value") ? annotationData[key].value.items : annotationData[key].items
            let input = form.querySelector("input[deer-key='"+key+"']")
            let area = input.nextElementSibling //The view or select should always be just after the input tracking the values from it.
            let selectElemExists = true
            let sel
            if(area.tagName === "DEER-VIEW"){
                //Then it is a <deer-view> template and we need to get the child to have the <select>
                sel = area.firstElementChild
            }
            else if(area.tagName === "SELECT"){
                sel = area
            }
            else{
                //We did not expect this and it is an error.  Perhaps the <select> does not exist at all.
                // Rememeber: the <input> with deer key tracking the select must come immediately before the select. 
                console.warn("There is no select related to "+key+" to pre-select.")
            }
            if(sel && sel.tagName === "SELECT"){
                data_arr.forEach(val => {
                    let option = sel.querySelector("option[value='"+val+"']")
                    if(option){
                        option.selected = true
                    }
                    else{
                        //The <option> is not available in the <select> HTML.
                    }  
                })
            }
            else{
                //This is disconcerting.  The deer-view either didn't load or the DOM didn't draw it fast enough...
                console.warn("Could not pre-select multi selects.  The deer-view either didn't load or the DOM didn't draw it fast enough!"
                        +"  A multi select may not be preselected.")
            }
        }
        else{
            //There is no annotation data for this key.
            console.warn("LR App tried to find '"+key+"' in this form data and could not.  A multi select may not be preselected.")
        }
    })
}

/**
 * 
 * Type and AdditionalType information has a custom UI around it, so DEER cannot prefill those pieces.
 * Here we have the object with the type  
 * @param {Object} annotationData The expanded containing all annotation data for a form.
 * @param {Array(String)} keys The specific annotations we are looking for in annotationData
 * @param {HTMLElement} form The completely loaded HTML <form> containing the <selects>s
 * @return None
 */
LR.utils.preSelectType = function(object, form){
    let type = object.hasOwnProperty("additionalType") ? object.additionalType : ""
    type = type[0] // It is saving twice right now, so this handles the bug for DEMO purposes.  TODO FIXME
    if(type){
        var data_key_elements = form.querySelectorAll("[data-rdf]")
        Array.from(data_key_elements).forEach(el => {
            el = el.closest("[data-rdf]")
            if (el.getAttribute("data-rdf") === type) {
                el.classList.add("bg-light")
            } 
            else {
                el.classList.remove("bg-light")
            }
        })
        form.querySelector(".otherPrimaryTypes").value = type
    }
    else{
        //There is no annotation data for this key.
        console.warn("This object did not have a primary type!")
        console.log(object)
    }
}

/**
 * 
 * Type and AdditionalType information has a custom UI around it, so DEER cannot prefill those pieces.
 * Here we have the object with the type  
 * @param {Object} annotationData The expanded containing all annotation data for a form.
 * @param {Array(String)} keys The specific annotations we are looking for in annotationData
 * @param {HTMLElement} form The completely loaded HTML <form> containing the <selects>s
 * @return None
 */
LR.utils.populateCoordinates = function(object, form){
    let geo = object.hasOwnProperty("geometry") ? object.geometry : {}
    let val = geo.hasOwnProperty("value") ? geo.value : {}
    let coords = val.hasOwnProperty("coordinates") ? val.coordinates : []
    if(coords.length){
        let long = coords[0]
        let lat = coords[1]
        leafLat.value = lat
        leafLong.value = long
        updateGeometry(null, lat, long)
    }
    else{
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
LR.utils.prePopulateFieldNotes = function(fieldNotesFromData){
    if(fieldNotesFromData !== undefined){
        let notes_str = (typeof fieldNotesFromData === "object" && fieldNotesFromData.hasOwnProperty("value")) ? fieldNotesFromData.value : fieldNotesFromData
        document.getElementById("fieldNotesEntry").value = notes_str
    }
}

/**
 * Check if the user from session is the creator of some given Linked Data node or URI.
 * 
 * Note that we control the parameter for item.  In cases where possible, we should preferences passing
 * the object so that we don't need to perform the fetch.
 * 
 * @param {string} user The agent ID of the user in session
 * @param {object || string} item A Linked Data node or URI.  Lived Religion has the option to use either.
 * @return {Boolean}
 */
LR.utils.isCreator = async function(agentID, item){
    let creatorID
    if(typeof item === "string"){
        //It is probably just a URI.  We need to fetch the object and perhaps expand it
        item = await fetch(item).then(response => response.json()).catch(err => {
            console.error(err)
            return {}
        })
    }
    // Now item is an object and we expect it to have creator on it.
    if(item.creator){
        // This is a string URI, because this app uses the URI as the value for creator.
        creatorID = item.creator
    }
    else{
        //This is bad data that does not note the creator correctly.  Fail the check.
        return false
    }
    return ((agentID && creatorID) && agentID === creatorID)
}
