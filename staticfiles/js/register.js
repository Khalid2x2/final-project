// all input event listener
document.querySelectorAll("input").forEach((element) => {
    element.addEventListener("input", () => {
        let value = element.value;
        if (value == "") {
            element.classList.add("is-invalid");
        } else {
            element.classList.remove("is-invalid");
        }
        submitBtnValidation();
    });
});

function submitBtnValidation() {
    let count = 0;
    document.querySelectorAll("input.form-control").forEach((element,index) => {
        if (element.value == "") {
            document.getElementById("register-btn").setAttribute("disabled", "");
        } else {
            count += 1;
        }
        if (count == 4) {
            document.getElementById("register-btn").removeAttribute("disabled");
        }
    });
}
