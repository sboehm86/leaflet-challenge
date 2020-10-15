//tile layer
var lightmap=L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tilesize:512,
    maxZoom: 18,
    zoomoffset:-1,
    id: "mapbox/satellite-v9",
    accessToken: "pk.eyJ1Ijoic2JvZWhtODYiLCJhIjoiY2tmcTE2bHl4MGducTJzczl2aTFnNGplcSJ9.SRPmHa_ljtSqNg08ev8rKw"
});
console.log("1");

//map object
var myMap=L.map("map",{
    center:[40,-94],
    zoom: 2
});

lightmap.addTo(myMap);

console.log("2");

//make the layers
//var layers={
  //  Major:new.L.LayerGroup(),
    //Minor:new.L.LayerGroup(),
    //All:new.L.LayerGroup()
//};

//create the map using the layers
//var map=L.map("map-id",{
    //center:[],
    //zoom:20,
    //layers:[layers.Major,layers.Minor,layers.All]
//}); 

//add the map tile to the mapspace
//map.addTo(myMap);

//now for some overlays (added to the layers)

//now lets get our data
var majorURL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
var allURL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(allURL,function(data){
    function styleInfo(feature){
        return{
            opacity:1,
            fillopacity:1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: .25
        };
    }
console.log("3");

//make it so the shape changes color based on magnitude
function getColor(magnitude){
    switch(true){
        case magnitude >5:
            return "#ff0000";
        case magnitude >4:
            return "#ff7300";
        case magnitude >3:
            return "#f6ff00";
        case magnitude >2:
            return "#37ff00";
        case magnitude >1:
            return "#00ffea";
        default:
            return "#1e00ff";
    }
}
console.log("4");

//change the radius based on magnitude
function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;}
        return magnitude * 4;
    }

// now we need to add our geo layer
  L.geoJson(data, {pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: (feature, layer) => {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(myMap);

 //legen--wait for it--d...legend
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var severity = [0, 1, 2, 3, 4, 5];
    var colors = [
        "#1e00ff",  //
        "#00ffea",
        "#37ff00",  //
        "#f6ff00",  //
        "#ff7300",  //
        "#ff0000"  //backwards from above
    ];

    // create a loop to create a square for each interval
    for (var i = 0; i < severity.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        severity[i] + (severity[i + 1] ? "&ndash;" + severity[i + 1] + "<br>" : "+");
    }
    return div;
  };
//
  var cautionIcon = L.Icon.extend({
        options: {
            iconSize:     [38, 95],
            shadowSize:   [50, 64],
            iconAnchor:   [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor:  [-3, -76]
        }
    });

  //make it real!
  legend.addTo(myMap);
});
