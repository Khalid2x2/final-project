function getRestaurants() {
    // get zipcode and radius value
    var zipcode = document.getElementById("zipcode").value;
    var radius = document.getElementById("radius").value;
    if (zipcode) {
        alert("Good!");
        // fillResults(zipcode, radius);
    } else {
        alert("zipcode can not be empty");
    }

    // Make get request to Yelp API
    // function fillResults(zipcode,radius){
    //     const root = document.getElementById("results");
    //     root.innerHTML = `<p class="text-light">Zip Code: ${zipcode}, Radius: ${radius} M</p>`
    // }
}

function loadingSpinner(){
    let root = document.getElementById("results");
    root.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `
}

function fillResults(businesses){
    let root = document.getElementById("results");
    root.innerHTML = "";
    businesses.forEach((business) => {
        let item = `<p><a class="text-decoraion-none" href=${business['url']}>${business['name']}</a></p>`
        root.insertAdjacentHTML("beforeEnd", item);
    })
}

function getYelp() {

    loadingSpinner();
    
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
            // Output as search results
            let response = JSON.parse(http.responseText);
            fillResults(response['data']);
        }
    };
    let formdata = new FormData();
    formdata.append("zipcode",10118);
    formdata.append("radius",8024);
    http.send(formdata);
}
// getYelp();