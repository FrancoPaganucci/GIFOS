//funciones menú desplegable (if mobile)

let noct_a = document.getElementById("a-noct");
noct_a.addEventListener('click', () => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
        closeMenu();
    }
});

function openMenu() {
    document.getElementById("icon-hambur").style.display = "none";
    document.getElementById("icon-close").style.display = "block";
    document.getElementById("menu-display").style.display = "block";
}
function closeMenu() {
    document.getElementById("icon-hambur").style.display = "block";
    document.getElementById("icon-close").style.display = "none";
    document.getElementById("menu-display").style.display = "none";
}


// hover + svg
let create_gif_svg = document.getElementById("crear-gifo-icon");
create_gif_svg.addEventListener('mouseenter',() => {
    create_gif_svg.setAttribute('src', "assets/CTA-crear-gifo-hover.svg");
});
create_gif_svg.addEventListener('mouseleave', () => {
    create_gif_svg.setAttribute('src',"assets/button-crear-gifo.svg")
});
create_gif_svg.addEventListener('click', () => {
    create_gif_svg.setAttribute('src', "assets/CTA-crear-gifo-active.svg");
});