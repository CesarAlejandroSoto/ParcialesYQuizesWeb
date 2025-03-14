let url = "https://api.github.com/users/hadley/orgs"
function mapearDatos(data){
    let lista = document.getElementById("listaAvatares");
    data.forEach(org => {
        let listItem = document.createElement("li");
        let img = document.createElement("img");
        img.src = org.avatar_url;
        listItem.appendChild(img);
        lista.appendChild(listItem);
        img.style.width = "100px";
        img.style.height = "100px";
    });
}
function cargarAvatares() {
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