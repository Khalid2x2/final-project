var months = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
};

function getGoogleReviews(place) {
    let query = `?q="${place}"`;
    let http = new XMLHttpRequest();
    http.open("GET", "http://localhost:8000/google-restaurants/" + query, true);
    http.setRequestHeader("Access-Control-Allow-Origin", "*");
    http.setRequestHeader("Access-Control-Allow-Methods", "GET");
    http.setRequestHeader("Access-Control-Allow-Headers", "accept, content-type");
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            let response = JSON.parse(http.responseText);
            googleRestaurantsReviews(response);

            // Google Rating
            let google_ratings = document.querySelector(".restaurant__ratings tbody tr:nth-child(2) td:nth-child(2)");
            let rating = response.result.rating;
            let review_count = null;
            restaurantRatings(google_ratings, rating, review_count);

            // Restaurant Website
            document.getElementById("restaurant__website").href = response.result.website;
        }
    };
    http.send();
}

function googleRestaurantsReviews(props) {
    let reviews = props.result.reviews;
    for (let i = reviews.length - 1; i >= 0; i--) {
        let review = reviews[i];
        let created_date = review.relative_time_description;
        let username = review.author_name;
        let profile_url = review.author_url;
        let profile_img = review.profile_photo_url;
        let reviews_container = document.querySelector(".reviews__google .reviews");
        let review_tag = `
                <div class="review rounded border m-3 p-3">
                    <div class="d-flex">
                        <img class="border border-secondary" src="${profile_img}" alt="avatar of ${username}" />
                        <div class="align-self-center ms-3">
                            <p class="m-0">
                                <span class="fw-bold"><a class="text-dark text-decoration-none" href="${profile_url}">${username}</a></span>
                                <span>${created_date}</span>
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
                        <p class="m-0">${review.text}</p>
                    </div>
                </div>`;
        reviews_container.insertAdjacentHTML("beforeEnd", review_tag);
    }
}
