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

let api_key = "5BaQMKuG1Q5BosQhGskZjg51FERY84BR";
let url_geo = "https://api.geocodify.com/v2/reverse?api_key=" + api_key;
let banderas_url = "https://restcountries.com/v3.1/alpha/";
let base_url = "https://api.open-meteo.com/v1/forecast?";
let end_url = "&current=temperature_2m,relative_humidity_2m";

function cargarGeolocalizacion(latitud, longitud) {
    let url = url_geo + "&lat=" + latitud + "&lng=" + longitud;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Geolocalización no encontrada");
            }
            return response.json();
        })
        .then(data => {
            let location = data.response.features[0].properties;
            
            let pais = location.country;
            let region = location.region;
            let ciudad = location.county;
            
            document.getElementById("pais").innerText = pais;
            document.getElementById("region").innerText = region;
            document.getElementById("ciudad").innerText = ciudad;
            cargarBandera(location.country_code);

        
            agregarAlHistorial(latitud, longitud, pais, region, ciudad, window.tempActual, window.humActual);
        })
        .catch(error => {
            console.log("Error", error);
        });
}

function cargarBandera(country_code) {
    let url = banderas_url + country_code;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Bandera no encontrada");
            }
            return response.json();
        })
        .then(data => {
            let bandera = data[0].flags.png;
            document.getElementById("bandera").src = bandera;
        })
        .catch(error => {
            console.log("Error", error);
        });
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

function mapearDatos(datos) {
    let latitud = datos.latitude;
    let longitud = datos.longitude;
    let temperatura = datos.current.temperature_2m;
    let humedad = datos.current.relative_humidity_2m;

    document.getElementById("v_lat").innerText = latitud;
    document.getElementById("v_lon").innerText = longitud;
    document.getElementById("v_tem").innerText = temperatura;
    document.getElementById("v_hum").innerText = humedad;

    
    window.tempActual = temperatura;
    window.humActual = humedad;
}

function agregarAlHistorial(lat, lon, pais, region, ciudad, temp, hum) {
    let tabla = document.getElementById("tabla_historial");
    let fila = tabla.insertRow();

    let columnaPais = fila.insertCell(0);
    let columnaRegion = fila.insertCell(1);
    let columnaCiudad = fila.insertCell(2);
    let columnaLat = fila.insertCell(3);
    let columnaLon = fila.insertCell(4);
    let columnaTemp = fila.insertCell(5);
    let columnaHum = fila.insertCell(6);

    columnaPais.innerText = pais;
    columnaRegion.innerText = region;
    columnaCiudad.innerText = ciudad;
    columnaLat.innerText = lat;
    columnaLon.innerText = lon;
    columnaTemp.innerText = temp + "°C";
    columnaHum.innerText = hum + "%";
}

function cargarDatosCompletos(latitud, longitud) {
    cargarDatos(latitud, longitud);
    cargarGeolocalizacion(latitud, longitud);
}

let mapa;

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
        let coordinates = ol.proj.toLonLat(evt.coordinate);
        let latitud = coordinates[1];
        let longitud = coordinates[0];
        console.log("Latitud:", latitud);
        console.log("Longitud:", longitud);
        cargarDatosCompletos(latitud, longitud);
    });
});
