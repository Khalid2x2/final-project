// User favorite
function fillTheHeart() {
    const heart = document.querySelector(".fa-heart");
    if (heart.classList.contains("fa-regular")) {
        heart.classList.remove("fa-regular");
        heart.classList.add("fa-solid");
    } else {
        heart.classList.remove("fa-solid");
        heart.classList.add("fa-regular");
    }
}

// Reviews drop down
function showReviews(element) {
    let parent = element.closest(".head").parentElement;
    let reviews = parent.querySelector(".reviews");
    let display = reviews.style.display;
    if (display == "block") {
        reviews.style.display = "none";
    } else {
        reviews.style.display = "block";
    }
}

function titleBottomBorder(element) {
    let parent = element.closest(".head");
    let parentBorderBottom = parent.style.borderBottom;
    if (parentBorderBottom == "0px") {
        parent.style.borderBottom = "1px solid #dee2e6";
    } else {
        parent.style.borderBottom = "0px";
    }
}

const reviewsDropdown = document.querySelectorAll("#reviews .head button");
reviewsDropdown.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        let element = event.target;
        titleBottomBorder(element);
        showReviews(element);
        if (element.localName == "i") {
            if (element.classList.value == "fa-solid fa-angle-down") {
                element.outerHTML = '<i class="fa-solid fa-chevron-left"></i>';
            } else {
                element.outerHTML = '<i class="fa-solid fa-angle-down"></i>';
            }
        } else if (element.localName == "button") {
            let fa = element.querySelector("i");
            if (fa.classList.value == "fa-solid fa-angle-down") {
                element.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
            } else {
                element.innerHTML = '<i class="fa-solid fa-angle-down"></i>';
            }
        }
    });
});

// Leave feedback
function getCSRF() {
    return document.querySelector("input[name=csrfmiddlewaretoken]").value;
}
function createStars(stars) {
    let spans = "";
    for (let i = 0; i < 5; i++) {
        if (i < stars) {
            spans += '<span><i class="fa-solid fa-star"></i></span>';
        } else {
            spans += '<span><i class="fa-regular fa-star"></i></span>';
        }
    }
    return spans;
}
function turnIntoReview(props) {
    // props [user_fullname,datestamp,stars,review]
    let stars_span = createStars(props.stars);
    let user_review = document.querySelector(".reviews__user .reviews");
    let review_tag = `
        <div class="review rounded border m-3 p-3">
            <div class="d-flex">
                <img class="border border-secondary" src="/static/images/user-icon.png" alt="${props.name} Avatar" />
                <div class="align-self-center ms-3">
                    <p class="m-0">
                        <span class="fw-bold">${props.name}</span>
                        <span>${props.date}</span>
                    </p>
                    <p class="rating-stars m-0">
                        ${stars_span}
                        <span class="badge bg-info px-2" type="button" onclick="editBtn(this);">Edit</span>
                    </p>
                </div>
            </div>
            <div class="mt-2">
                <p class="m-0">${props.review}</p>
            </div>
        </div>`;
    user_review.innerHTML = review_tag;
}
function editBtn(element) {
    let container = element.closest(".reviews");
    container.innerHTML = `
            <div class="review rounded border m-3 p-3">
                <div>
                    <h6>Leave Your Review</h6>
                    <div class="align-self-center">
                        <p id="rating-stars" class="rating-stars m-0" value="0">
                            <strong>Ratings:</strong>
                            <span><i class="fa-regular fa-star"></i></span>
                            <span><i class="fa-regular fa-star"></i></span>
                            <span><i class="fa-regular fa-star"></i></span>
                            <span><i class="fa-regular fa-star"></i></span>
                            <span><i class="fa-regular fa-star"></i></span>
                        </p>
                    </div>
                </div>
                <div class="mt-2 d-flex flex-column">
                    <textarea id="user-review" class="form-control w-100 m-0"></textarea>
                    <button id="review-btn" class="btn btn-primary mt-2" type="button">Submit</button>
                </div>
            </div>`;
    element.closest(".review").remove();
    ratingStarsListener();
    reviewSubmitListener();
}
function reviewSubmitListener() {
    const review_submit = document.getElementById("review-btn");
    review_submit.addEventListener("click", () => {
        // get csrftoken
        let csrf = getCSRF();

        // get the review data
        let stars = document.getElementById("rating-stars").getAttribute("value");
        let review = document.getElementById("user-review").value;
        let props = {
            name: "Full Name",
            date: "12 Nov 2022",
            review: review,
            stars: stars,
        };
        turnIntoReview(props);

        // prepare the form variable
        let formdata = new FormData();
        formdata.append("review", review);
        formdata.append("stars", stars);
    });
}
reviewSubmitListener();

function ratingStarsListener() {
    const feedback_stars = document.getElementById("rating-stars");
    const stars = feedback_stars.querySelectorAll(".fa-star");
    stars.forEach((star, i) => {
        star.addEventListener("click", () => {
            // set stars value
            feedback_stars.setAttribute("value", i + 1);

            // change the previous and the clicked stars to solid
            for (let j = 0; j < stars.length; j++) {
                if (j <= i) {
                    stars[j].classList.replace("fa-regular", "fa-solid");
                } else {
                    stars[j].classList.replace("fa-solid", "fa-regular");
                }
            }
        });
    });
}
ratingStarsListener();

// Get Yelp Business Detail
function restaurantDetail(props) {
    document.title = props.name + " | Khaled's Project";
    document.querySelector(".restaurant__title").innerText = props.name;
    document.getElementById("restaurant__address1").innerText = props.location.display_address[0];
    document.getElementById("restaurant__address2").innerText = props.location.display_address[1];
    document.getElementById("restaurant__phonenumber").innerText = props.display_phone;
    document.getElementById("restaurant__url").href = props.url;
    document.getElementById("restaurant__is-open").innerText = props.hours[0].is_open_now ? "Open Now" : "Closed";

    // Restaurant Open/Close Hours
    restaurantOpenSchedule(props.hours[0].open);

    // Restaurant slide Images
    restaurantCarouselImages(props.name, props.photos);

    // Yelp Ratings
    let yelp_ratings = document.querySelector(".restaurant__ratings tbody tr:nth-child(1) td:nth-child(2)");
    restaurantRatings(yelp_ratings, props.rating, props.review_count);

    // Google Maps
    placeMap(props.name, props.coordinates.latitude, props.coordinates.longitude);
}
function restaurantOpenSchedule(hours) {
    let table = document.querySelector("#restaurant__schedule tbody");
    String.prototype.InsertAt = function (CharToInsert, Position) {
        return this.slice(0, Position) + CharToInsert + this.slice(Position);
    };
    let days = {
        0: "Monday",
        1: "Tuesday",
        2: "Wednesday",
        3: "Thursday",
        4: "Friday",
        5: "Saturday",
        6: "Sunday",
    };
    for (let i in hours) {
        let day = days[hours[i]["day"]];
        let start = hours[i]["start"].InsertAt(":", 2);
        let close = hours[i]["end"].InsertAt(":", 2);
        let row = `
            <tr>
                <td>${day}</td>
                <td>${start} - ${close}</td>
            </tr>`;
        table.insertAdjacentHTML("beforeEnd", row);
    }
}
function restaurantCarouselImages(restaurant, image_urls) {
    let carousel = document.getElementById("carouselExampleIndicators");
    let inner_carousel = carousel.querySelector(".carousel-inner");
    for (let i in image_urls) {
        let img_url = image_urls[i];
        if (i == 0) {
            let image = `<div class="carousel-item active"><img src="${img_url}" class="d-block w-100" alt="${restaurant} #${i + 1}" /></div>`;
            inner_carousel.insertAdjacentHTML("beforeEnd", image);
        } else {
            let image = `<div class="carousel-item"><img src="${img_url}" class="d-block w-100" alt="${restaurant} #${i + 1}" /></div>`;
            inner_carousel.insertAdjacentHTML("beforeEnd", image);
        }
    }
}
function restaurantRatings(element, stars, review_count) {
    for (let i = 1; i < 6; i++) {
        let star = `
            <span>
                <i class="${i <= stars ? "fa-solid fa-star" : i - 0.5 == stars ? "fa-solid fa-star-half-stroke" : "fa-regular fa-star"}">
            <span>
        `;
        element.insertAdjacentHTML("beforeEnd", star);
    }
    element.insertAdjacentHTML("beforeEnd", ` <span>${stars}</span>`);
    if (review_count) {
        element.insertAdjacentHTML("beforeEnd", ` <span>(${review_count} reviews)</span>`);
    }
}
function getRestaurantsDetail() {
    let restaurant_id = document.querySelector(".restaurant__title").getAttribute("id");
    let http = new XMLHttpRequest();
    http.open("GET", "http://localhost:8000/restaurant/yelp/" + restaurant_id, true);
    http.setRequestHeader("Access-Control-Allow-Origin", "*");
    http.setRequestHeader("Access-Control-Allow-Methods", "GET");
    http.setRequestHeader("Access-Control-Allow-Headers", "accept, content-type");
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            let response = JSON.parse(http.responseText);
            restaurantDetail(response);

            // make a call to google maps place api
            getGoogleReviews(response.name);
        }
    };
    http.send();
}

getRestaurantsDetail();

// Yelp Business Reviews
function restaurantsReviews(reviews) {
    for (let i = reviews.length - 1; i >= 0; i--) {
        let review = reviews[i];
        let created_date = new Date(review["time_created"]);
        let username = review["user"]["name"];
        let profile_url = review["user"]["profile_url"];
        let reviews_container = document.querySelector(".reviews__yelp .reviews");
        let review_tag = `
                <div class="review rounded border m-3 p-3">
                    <div class="d-flex">
                        <img class="border border-secondary" src="${review["user"]["image_url"]}" alt="avatar of ${username}" />
                        <div class="align-self-center ms-3">
                            <p class="m-0">
                                <span class="fw-bold"><a class="text-dark text-decoration-none" href="${profile_url}">${username}</a></span>
                                <span>${created_date.getDate()} ${months[created_date.getMonth()]} ${created_date.getFullYear()}</span>
                            </p>
                            <p class="rating-stars m-0">
                                <span><i class="fa-solid fa-star"></i></span>
                                <span><i class="fa-solid fa-star"></i></span>
                                <span><i class="fa-solid fa-star"></i></span>
                                <span><i class="fa-solid fa-star"></i></span>
                                <span><i class="fa-solid fa-star"></i></span>
                            </p>
                        </div>
                    </div>
                    <div class="mt-2">
                        <p class="m-0">${review["text"]}</p>
                    </div>
                </div>`;
        reviews_container.insertAdjacentHTML("beforeEnd", review_tag);
    }
}

function getRestaurantReviews() {
    let restaurant_id = document.querySelector(".restaurant__title").getAttribute("id");
    let http = new XMLHttpRequest();
    http.open("GET", "http://localhost:8000/restaurant/yelp-reviews/" + restaurant_id, true);
    http.setRequestHeader("Access-Control-Allow-Origin", "*");
    http.setRequestHeader("Access-Control-Allow-Methods", "GET");
    http.setRequestHeader("Access-Control-Allow-Headers", "accept, content-type");
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            let response = JSON.parse(http.responseText);
            restaurantsReviews(response["reviews"]);
        }
    };
    http.send();
}

getRestaurantReviews();
