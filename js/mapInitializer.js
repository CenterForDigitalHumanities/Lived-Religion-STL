/**
 * @module Lived Religion Map Module Initializer
 * @author Bryan Haberberger <bryan.j.haberberger@slu.edu>
 */

// Identify an alternate config location or only overwrite some items below.
import { default as DEER } from 'https://deer.rerum.io/releases/alpha-0.11/deer-config.js'

import { default as UTILS } from 'https://deer.rerum.io/releases/alpha-0.11/deer-utils.js'

import { default as renderer, initializeDeerViews } from 'https://deer.rerum.io/releases/alpha-0.11/deer-render.js'

DEER.URLS = {
    QUERY: "http://tiny.rerum.io/app/query",
    BASE_ID: "http://store.rerum.io/v1"
}

let MAP = {
    COLLECTION: "LivedReligionLocations",
    mymap: {}
}

MAP.init = async function () {
    let latlong = [38.6360699, -90.2348349] //default starting coords
    document.getElementById("leafLat").oninput = MAP.updateGeometry
    document.getElementById("leafLong").oninput = MAP.updateGeometry
    
    let entitiesInCollection = await fetchLocations(MAP.COLLECTION)
    let expandedEntities = entitiesInCollection.map(async function (location) {
        return await UTILS.expand( location )
            .then(expandedLocation => {
                let targetProps = { "targetID": expandedLocation["@id"] ?? expandedLocation.id, "label": UTILS.getLabel(expandedLocation), "description": UTILS.getValue(expandedLocation.description), "madeByApp": "Lived_Religion" }
                return { "@id": expandedLocation.geometry?.source.citationSource, "properties": targetProps, "type": "Feature", "geometry": expandedLocation.geometry?.value }
            })
            .catch(err => {
                console.error(err)
                return {}
            })
    })
    Promise.all(expandedEntities).then(LR_geos => {
        return LR_geos.filter(geo => { return geo.geometry?.type })
    })
        .then(filtered_geos => { MAP.initializeMap(latlong, filtered_geos) })
        .catch(err => {
            console.error(err)
            alert("Could not gather coordinate data.  Refresh to Try Again.")
        })
}

MAP.initializeMap = async function (coords, geoMarkers) {
    MAP.mymap = L.map('leafletInstanceContainer')
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidGhlaGFiZXMiLCJhIjoiY2pyaTdmNGUzMzQwdDQzcGRwd21ieHF3NCJ9.SSflgKbI8tLQOo2DuzEgRQ', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 100,
        id: 'mapbox.satellite', //mapbox.streets
        accessToken: 'pk.eyJ1IjoidGhlaGFiZXMiLCJhIjoiY2pyaTdmNGUzMzQwdDQzcGRwd21ieHF3NCJ9.SSflgKbI8tLQOo2DuzEgRQ'
    }).addTo(MAP.mymap);
    MAP.mymap.setView(coords, 9);

    L.geoJSON(geoMarkers, {
        pointToLayer: function (feature, latlng) {
            let appColor
            let creating_app = feature.properties.madeByApp ? feature.properties.madeByApp : "Unknown"
            switch (creating_app) {
                case "MapDemo":
                    appColor = "#336699"
                    break
                case "Lived_Religion":
                    appColor = "#00cc00"
                    break
                case "T-PEN":
                    appColor = "#ff9900"
                    break
                case "Mirador":
                    appColor = "#ff3333"
                    break
                case "IIIF_Coordinates_Annotator":
                    appColor = "#800060"
                    break
                default:
                    appColor = "red"
            }
            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: appColor,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: MAP.pointEachFeature
    }).addTo(MAP.mymap)
    leafletInstanceContainer.style.backgroundImage = "none"
    loadingMessage.classList.add("is-hidden")

    //We cannot initalize another map, and there is no Leaflet getter for a map.  We need to expose this map to mapping.js.  mapping.js uses MAPPER
    //Since this is called after MAPINTERACTION and MAP have both been initialized thanks to the deer-loaded listener, we can do this.
    //@FIXME is this the right way to do this?
    MAPINTERACTION.mymap = MAP.mymap
}

MAP.pointEachFeature = function (feature, layer) {
    //@id, label, description
    layer.hasMyPoints = true
    layer.isHiding = false
    let popupContent = ""
    if (feature.properties) {
        if (feature.properties.label) {
            popupContent += `<div class="featureInfo"><label>Target Label:</label>${feature.properties.label}</div>`
        }
        if (feature.properties.targetID || feature.properties["@id"]) {
            let targetURI = feature.properties["@id"] ? feature.properties["@id"] : feature.properties.targetID ? feature.properties.targetID : ""
            popupContent += `<div class="featureInfo"><label> Target URI:</label><a target='_blank' href='${targetURI}'>See Target Data</a></div>`
        }
        if (feature.properties.description) {
            popupContent += `<div class="featureInfo"><label> Target Description:</label>${feature.properties.description}</div>`
        }
        if (feature.properties.madeByApp) {
            popupContent += `<div class="featureInfo"><label>Annotation Generated By</label>${feature.properties.madeByApp}</div>`
        }
        if (feature["@id"]) {
            popupContent += `<div class="featureInfo"><label>Annotation URI:</label><a target='_blank' href='${feature["@id"]}'>See Annotation Data</a></div>`
        }
    }
    layer.bindPopup(popupContent);
}

/**
* Determine what to do with the items in the Lived Religion Locations collection
* @param {type} event
* @returns {undefined}
*/
MAP.init()

async function fetchLocations(collectionName) {
    // Look not only for direct objects, but also collection annotations
    // Only the most recent, do not consider history parent or children history nodes
    let historyWildcard = { "$exists": true, "$size": 0 }
    let queryObj = {
        $or: [{
            "targetCollection": collectionName
        }, {
            "body.targetCollection": collectionName
        }],
        "__rerum.history.next": historyWildcard
    }
    return fetch(DEER.URLS.QUERY, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(queryObj)
    }).then(response => response.json())
        .then(pointers => {
            let list = []
            pointers.map(tc => list.push(fetch(tc.target ?? tc["@id"] ?? tc.id).then(response => response.json()).catch(err => { console.log(err) })))
            return Promise.all(list).then(l => l.filter(i => !i.hasOwnProperty("__deleted")))
        })
}
// fire up the element detection as needed
/**
 * Note that VIEWS can be building blocks of FORMS.  VIEWS may also be the FORM in its entirety.
 * It follows that VIEWS must finish populating to the DOM before initializing forms which interact with the
 * elements in the DOM to do things like pre-filling or pre-select values, which much exist in the DOM for such interaction.
 * We seek to streamline the logic around these threads in the near future.  Make sure these remain treated as asyncronous.
 */
initializeDeerViews(DEER)

