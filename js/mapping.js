/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const MAPINTERACTION = {}

MAPINTERACTION.goToCoords = function(event){
    if(!MAPINTERACTION.mymap){
        //This should have been set by mapInitializer.js
        MAPINTERACTION.mymap = L.map('leafletInstanceContainer')
    }
    if(leafLat.value && leafLong.value){
        let coords = [leafLat.value, leafLong.value]
        MAPINTERACTION.mymap.flyTo(coords,8)
        document.getElementById("currentCoords").innerHTML = "["+coords.toString()+"]"
    }
}

MAPINTERACTION.filterMarkers = async function(event){
    if(!MAPINTERACTION.mymap){
        //This should have been set by mapInitializer.js
        MAPINTERACTION.mymap = L.map('leafletInstanceContainer')
    }
    let app = event.target.getAttribute("app")
    MAPINTERACTION.mymap.eachLayer(function(layer) {
        if ( layer.hasMyPoints ) {
            if(layer.feature.properties && layer.feature.properties.madeByApp && layer.feature.properties.madeByApp === app){
                if(layer.isHiding){
                    layer.isHiding = false
                    let creating_app = layer.feature.properties.madeByApp ? layer.feature.properties.madeByApp : "Unknown"
                    const appMap = new Map([
                        ["MapDemo","#336699"],
                        ["Lived_Religion","#00cc00"],
                        ["T-PEN","#ff9900"],
                        ["Mirador","#ff3333"],
                        ["IIIF_Coordinates_Annotator","#800060"],
                        ["default","#b5a4a3"]
                    ])
                    layer.setStyle({
                        color: "#000",
                        fillColor : appMap.get(creating_app) ?? appMap.get("default")
                    })
                }
                else{
                    layer.isHiding = true 
                    layer.setStyle({
                        color: 'rgba(0,0,0,0)',
                        fillColor : 'rgba(0,0,0,0)'
                    })
                }
            }
        }
    })
}

