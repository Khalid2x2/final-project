// Initialize and add the map
function initMap(center, res_coords) {
    // The location of Uluru
    const city = {
        coord: { lat: center["latitude"], lng: center["longitude"] },
    };

    // The map, centered at city
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: city.coord,
    });

    // Custom icon
    var icon = {
        url: "https://cdn-icons-png.flaticon.com/512/3161/3161930.png", // url
        scaledSize: new google.maps.Size(40, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(20, 40), // anchor
    };

    // The marker
    addMarker(city);

    // Place marker
    for (let i = 0; i < res_coords.length; i++) {
        let coord = res_coords[i]["coordinates"];
        let place = {
            coord: {
                lat: coord["latitude"],
                lng: coord["longitude"],
            },
            icon: icon,
            content: `<h5>${res_coords[i]["name"]}</h5>`,
        };
        addMarker(place);
    }

    function addMarker(props) {
        let marker = new google.maps.Marker({
            position: props.coord,
            map: map,
        });

        if (props.content) {
            var infoWindow = new google.maps.InfoWindow({
                content: props.content,
            });
        }

        if (props.icon) {
            marker.setIcon(props.icon);
        }

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
    }
}

function placeMap(name, lat, lng) {
    const center = {lat:lat, lng: lng}
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: center,
        content: `<h5>${name}</h5>`,
    });

    let marker = new google.maps.Marker({
        position: center,
        map: map,
    });
    
    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });
}
