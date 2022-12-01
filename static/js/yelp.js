function Spinner() {
    let root = document.getElementById("results");
    root.innerHTML = `
        <div class="spinner-border text-primary mt-5" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
}

function imgStars(rating) {
    let stars = "";
    for (let i = 1; i < 6; i++) {
        if (i < rating) {
            stars += '<span><img src="/static/images/rating-star_full.png" alt="rating-star" /></span>';
        } else {
            if (i - 0.5 == rating) {
                stars += '<span><img src="/static/images/rating-star_half.png" alt="rating-star" /></span>';
            } else {
                stars += '<span><img src="/static/images/rating-star_empty.png" alt="rating-star" /></span>';
            }
        }
    }
    return stars
}

function fillResults(businesses) {
    let search_result = document.getElementById("search-result");
    let root = document.getElementById("results");
    root.innerHTML = "";
    if (businesses.length > 0) {
        search_result.innerHTML = `<p class="text-light mt-3">${businesses.length} restaurants found</p>`;
        businesses.forEach((b) => {
            let loc = b["location"];
            let address = `${loc["address1"]}, ${loc["city"]}, ${loc["state"]}, ${loc["country"]} ${loc["zip_code"]}`;
            let rating = imgStars(b['rating']);
            let reviews = b["review_count"];
            let item = `
                <div class="card mt-3 me-3" style="width: 18rem;">
                    <img class="card-img-top" src="${b["image_url"]}" alt="${b["name"]}">
                    <div class="card-body">
                        <h5 class="card-title"><a class="text-dark text-decoration-none" href="/restaurant/${b["id"]}" target="_blank">${b["name"]}</a></h5>
                        <p class="card-text small mb-0">
                            <span class="stars">${rating}</span>
                            <span class="ms-1">(${reviews.toLocaleString()} reviews)</span>
                        </p>
                        <p class="card-text small">${address}</p>
                    </div>
                </div>
            `;
            root.insertAdjacentHTML("beforeEnd", item);
        });
    } else {
        search_result.innerHTML = `<p class="text-light mt-3">No restaurants within the radius.</p>`;
    }
}

function getYelp(zipcode, radius) {
    // Show the spinner after button pressed
    Spinner();

    // Prepare the endpoint and csrf token
    let url = document.location.origin + "/search-restaurants/";
    let csrf = document.querySelector("input[name=csrfmiddlewaretoken]").value;

    let http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("X-CSRFToken", csrf);
    http.setRequestHeader("Access-Control-Allow-Origin", "*");
    http.setRequestHeader("Access-Control-Allow-Methods", "POST");
    http.setRequestHeader("Access-Control-Allow-Headers", "accept, content-type");
    http.setRequestHeader("Access-Control-Max-Age", "1728000");
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            let response = JSON.parse(http.responseText);
            if (response.status == 200) {
                // look for map div
                var after_result = document.querySelector("#search-result + div").getAttribute("id");
                if (after_result != "map") {
                    let result_div = document.getElementById("search-result");
                    result_div.insertAdjacentHTML("afterEnd", '<div id="map" class="mt-3"></div>');
                }
                // get retaurant data
                let restaurants = response["data"]["businesses"];
                fillResults(restaurants);
                // draw the map
                let center = response["data"]["region"]["center"];
                initMap(center, restaurants);
            } else {
                document.getElementById("search-result").innerHTML = `<p class="text-light mt-3">No restaurants within the radius.</p>`;
                document.getElementById("results").innerHTML = "";
            }
        }
    };
    let formdata = new FormData();
    formdata.append("zipcode", zipcode);
    formdata.append("radius", radius);
    http.send(formdata);
}

function getRestaurants() {
    // Get zipcode and radius value
    var zipcode = document.getElementById("zipcode").value;
    var radius = document.getElementById("radius").value;
    if (zipcode) {
        getYelp(zipcode, radius);
    } else {
        alert("zipcode can not be empty!");
    }
}
