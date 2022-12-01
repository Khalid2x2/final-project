// resize container height
window.addEventListener("resize", () => {
    const navbar = document.querySelector("nav");
    const div_container = document.getElementById("user-profile");
    let new_height = screen.height - navbar.offsetHeight;
    div_container.setAttribute("style", `min-height: ${new_height}px`);
});
