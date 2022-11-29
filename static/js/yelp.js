function getRestaurants() {

    // Get zipcode and radius value
    var zipcode = document.getElementById("zipcode").value;
    var radius = document.getElementById("radius").value;
    if (zipcode) {
        getYelp(zipcode,radius);
    } else {
        alert("zipcode can not be empty!");
    }

}

function Spinner(){
    let root = document.getElementById("results");
    root.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `
}

function fillResults(businesses){
    let search_result = document.getElementById("search-result");
    let root = document.getElementById("results");
    root.innerHTML = "";
    if(businesses.length > 0){
        search_result.innerHTML = `<p class="text-light mt-3">${businesses.length} Restaurants found</p>`
        businesses.forEach((b) => {
            let loc = b['location'];
            let address = `${loc['address1']}, ${loc['city']}, ${loc['state']}, ${loc['country']} ${loc['zip_code']}`;
            let rating = b['rating'];
            let reviews = b['review_count'];
            let item = `
                <div class="card mt-3 me-3" style="width: 18rem;">
                    <img class="card-img-top" src="${b['image_url']}" alt="${b['name']}">
                    <div class="card-body">
                        <h5 class="card-title"><a class="text-dark text-decoration-none" href="${b['url']}" target="_blank">${b['name']}</a></h5>
                        <p class="card-text small mb-0">Rating: ${rating} stars (${reviews.toLocaleString()})</p>
                        <p class="card-text small">${address}</p>
                    </div>
                </div>
            `
            root.insertAdjacentHTML("beforeEnd", item);
        })
    } else {
        search_result.innerHTML = `<p class="text-light mt-3">No Restaurants within that radius.</p>`
    }
}

function getYelp(zipcode,radius) {

    // Show the spinner after button pressed
    Spinner();
    
    // Prepare the endpoint and csrf token
    let url = "http://localhost:8000/search-restaurants/";
    let csrf = document.querySelector("input[name=csrfmiddlewaretoken]").value;

    let http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("X-CSRFToken",csrf);
    http.setRequestHeader('Access-Control-Allow-Origin', "*");
    http.setRequestHeader('Access-Control-Allow-Methods', 'POST');
    http.setRequestHeader("Access-Control-Allow-Headers", "accept, content-type");
    http.setRequestHeader("Access-Control-Max-Age", "1728000");
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            let response = JSON.parse(http.responseText);
            fillResults(response['data']);
        }
    };
    let formdata = new FormData();
    formdata.append("zipcode",zipcode);
    formdata.append("radius",radius);
    http.send(formdata);
}