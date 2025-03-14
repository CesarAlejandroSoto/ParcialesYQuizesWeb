/*
  Parcial 1 - PROGRAMACIÓN WEB
  Respetado estudiante teniendo en cuenta el proyecto proporcionado deberá desarrollar las siguientes funcionalidades en el sitio web:

  1) Solicitar datos del clima a la API de https://open-meteo.com/en/docs usando las coordenadas seleccionadas por el usuario en el mapa. 
  2) Solicitar los datos de Geolocalización en la API de https://geocodify.com/
  3) Solicitar la imágen de la bandera del pais donde está ubicado el punto seleccionado al servicio:https://documenter.getpostman.com/view/1134062/T1LJjU52#89ad7ab2-e3e1-4d8a-b99d-44e1c149e788  
  2) Cuando llega la respuesta del servidor, si es correcta mostrar los datos en la tabla correspondiente. 
  3) Desarrollar un historial de busquedas anteriores que vaya cargando en la medida que el usuario 
  selecciona diferentes ubicaciones en el mapa, dicho historial debe ser una TABLA.
*/

function obtenerGeolocalizacion(latitud, longitud) {
    let url = `https://api.geocodify.com/v2/reverse?api_key=5BaQMKuG1Q5BosQhGskZjg51FERY84BR&lat=${latitud}&lng=${longitud}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Geolocalización no encontrada");
            }
            return response.json();
        })
        .then(data => {
            console.log("Geolocalización:", data);
            // Aquí puedes agregar el código para manejar los datos de geolocalización

        })
        .catch(error => {
            console.log("Error", error);
        });
}
function mapearGeolocalizacion(data) {
    let country = data.response.features[0].properties.country;
    let city = data.response.features[0].properties.city;
    let region = data.response.features[0].properties.state;

    document.getElementById("v_pais").innerText = country;
    document.getElementById("v_ciudad").innerText = city;
    document.getElementById("v_region").innerText = region;
}
https://api.geocodify.com/v2/reverse?api_key=5BaQMKuG1Q5BosQhGskZjg51FERY84BR&lat=7.139328634899883&lng=-73.12027021878984
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

