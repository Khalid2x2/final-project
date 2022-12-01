// resize container height
window.addEventListener("resize", () => {
    const navbar = document.querySelector("nav");
    const div_container = document.getElementById("user-profile");
    let new_height = screen.height - navbar.offsetHeight;
    div_container.setAttribute("style", `min-height: ${new_height}px`);
});

// csrf finder
function getCSRF() {
    return document.querySelector("input[name=csrfmiddlewaretoken]").value;
}

// user info edit
const edit_btn = document.querySelector(".user-info .badge");
edit_btn.addEventListener("click", (event) => {
    let btn = event.target.innerText;
    if (btn == "Edit") {
        // edit mode
        event.target.innerText = "Save";
        document.querySelectorAll(".user-info tbody tr").forEach((row) => {
            let first_td = row.querySelector("td:first-child");
            let last_td = row.querySelector("td:last-child");
            let value = last_td.innerText;
            if (first_td.innerText == "Username") {
                last_td.innerHTML = `<input class="form-control form-control-sm" type="text" value=${value} disabled />`;
            } else {
                last_td.innerHTML = `<input class="form-control form-control-sm" type="text" value=${value} />`;
            }
        });
    } else {
        // visual mode
        let user = {
            name: document.querySelector(".user-info tbody tr:nth-child(1) input").value,
            email: document.querySelector(".user-info tbody tr:nth-child(3) input").value,
        };
        let http = new XMLHttpRequest();
        http.open("POST", document.location.origin + "/edit-user-profile/", true);
        http.setRequestHeader("X-CSRFToken", getCSRF());
        http.setRequestHeader("Access-Control-Allow-Origin", "*");
        http.setRequestHeader("Access-Control-Allow-Methods", "POST");
        http.setRequestHeader("Access-Control-Allow-Headers", "accept, content-type");
        http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
                let response = JSON.parse(http.responseText);
                if (response.status == 200) {
                    event.target.innerText = "Edit";
                    document.querySelectorAll(".user-info tbody tr").forEach((row) => {
                        let last_td = row.querySelector("td:last-child");
                        let value = last_td.querySelector("input").value;
                        last_td.innerText = value;
                    });
                }
            }
        };
        let formdata = new FormData();
        formdata.append("name", user.name);
        formdata.append("email", user.email);
        http.send(formdata);
    }
});
