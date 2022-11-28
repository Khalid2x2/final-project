function printFeedback(element){
    let parent = element.closest(".restaurant");
    let id = parent.getAttribute("id");
    let feedback = parent.querySelector("#feedbackInput").value; 
    let stars = parent.querySelector(".stars").getAttribute("value");

    let xhttp = new XMLHttpRequest();
    let csrftoken = document.querySelector("input[name=csrfmiddlewaretoken]").value;
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(xhttp.responseText);
            if(response.status == 200){
                appendFeedback(
                    parent,
                    response['data']
                );
            } else {
                alert("Sending feedback is failed");
            }
        }
    };

    xhttp.open("POST", `/${id}/feedback/`, true);
    xhttp.setRequestHeader("X-CSRFToken", csrftoken);

    const formdata = new FormData()
    formdata.append("feedback",feedback);
    formdata.append("stars",stars);

    xhttp.send(formdata);
}

function appendFeedback(parent,data){
    let feedback_containers = parent.querySelector(".feedback-containers");
    let new_feedback = `
        <div class="feedback__comment small p-2">
            <hr class="mt-0 mb-1">
            <p class="m-0">
                <span><strong>${data['username']}</strong></span>
                <span>${data['date']}</span>
            </p>
            <p class="m-0">${data['feedback']}</p>
        </div>`
    feedback_containers.innerHTML += new_feedback;
}

function showFeedback(element){
    let parent = element.closest(".restaurant");
    let feedbackInput = parent.querySelector("#add-feedback");
    if(feedbackInput.style.display == "flex"){
        feedbackInput.style.display = "none";
    } else {
        feedbackInput.style.display = "flex";
    }
}

function showStars(element){
    let value = element.getAttribute("value");
    let wrapper = element.closest(".stars");
    wrapper.setAttribute("value",value);
    for(let i=1; i <= 5; i++){
        let star = wrapper.querySelector(`span[value="${i}"]`);
        let fa_star = star.querySelector("i");
        if(i <= value){
            fa_star.setAttribute("class","fa-solid");
        } else {
            fa_star.setAttribute("class","fa-regular");
        }
        fa_star.classList.add("fa-star")
    }
}