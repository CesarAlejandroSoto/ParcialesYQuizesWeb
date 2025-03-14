/*
  QUIZ 1 - PROGRAMACIÓN WEB
  Respetado estudiante teniendo en cuenta el proyecto proporcionado deberá desarrollar las siguientes funcionalidades en el sitio web:

  1) Solicitar datos del clima a la API de https://api.open-meteo.com/ usando las coordenadas seleccionadas por el usuario en el mapa. 
  2) Cuando llega la respuesta del servidor, si es correcta mostrar los datos en la tabla correspondiente. 
  3) Desarrollar un historial de busquedas anteriores que vaya cargando en la medida que el usuario selecciona diferentes ubicaciones en el mapa.
  
https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,relative_humidity_2m 
*/

let base_url = "https://api.open-meteo.com/v1/forecast?";
let end_url = "&current=temperature_2m,relative_humidity_2m";

function mapearDatos(datos) {
    
    let datoPrevio = document.getElementById("v_lat").innerText;
    if (datoPrevio !== "#") {
        agregarAlHistorial(datoPrevio, document.getElementById("v_lon").innerText, document.getElementById("v_tem").innerText, document.getElementById("v_hum").innerText);
    }

    document.getElementById("v_lat").innerText = datos.latitude;
    document.getElementById("v_lon").innerText = datos.longitude;
    document.getElementById("v_tem").innerText = datos.current.temperature_2m;
    document.getElementById("v_hum").innerText = datos.current.relative_humidity_2m;
}

function agregarAlHistorial(lat, lon, temp, hum) {
    let tabla = document.getElementById("tabla_historial");
    let fila = tabla.insertRow();
  
    let columnaLat = fila.insertCell(0);
    let columnaLon = fila.insertCell(1);
    let columnaTemp = fila.insertCell(2);
    let columnaHum = fila.insertCell(3);
  
    columnaLat.innerText = lat;
    columnaLon.innerText = lon;
    columnaTemp.innerText = temp;
    columnaHum.innerText = hum;
}


function cargarDatos(latitud, longitud) {

    let url = base_url + "latitude=" + latitud + "&longitude=" + longitud + end_url;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Datos no encontrados");
            }
            return response.json();
        })
        .then(data => { 
            mapearDatos(data);
        })
        .catch(error => {
            console.log("Error", error);
        });
}

let map;

window.addEventListener("load", function() {
    map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM(),
          }),
        ],
        view: new ol.View({
          center: ol.proj.transform([-72.265911, 3.7644111], 'EPSG:4326', 'EPSG:3857'),
          zoom: 5,
        }),
    });

    map.on('click', function(evt) {
        let coordinates = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
        let latitud = coordinates[1];
        let longitud = coordinates[0];
        console.log("Latitud:", latitud, "Longitud:", longitud);
        cargarDatos(latitud, longitud);
    });
});

