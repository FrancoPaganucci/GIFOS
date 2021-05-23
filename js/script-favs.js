// CHECK FOR ADDED FAVS
var list_favorites = [];
function checkForAddedFavs() {
    console.log("chequeo added favs");
    if (localStorage.getItem('favs-id')) {
        list_favorites = JSON.parse(localStorage.getItem('favs-id'));
    } else if (localStorage.getItem('favs-id') == null) {
        list_favorites = [];
    }
    return list_favorites;
}
checkForAddedFavs();

// parse list
for (let i = 0; i < list_favorites.length; i++) {
    JSON.parse(list_favorites[i]);
}
addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("btn-vermas") !== null) {
        document.getElementById("btn-vermas").remove();
    }
})
let ctn_vermas_favs = document.getElementById("ctn-btn-vermas-favs");
let limit_favs = 12;
let offset_favs = 0;
// getMoreFavs();
function getFavs() {
    if (list_favorites !== null) {
        let ctn_results_favs = document.getElementById("ctn-results-favs");
        
        for (let i = offset_favs; i < limit_favs; i++) {
            // parse each object within list
            let gif_json = JSON.parse(list_favorites[i]);
            let fav_gif_src = gif_json.images.original.url;
            let fav_gif_title = gif_json.title;
            // IF DESKTOP, HOVER ON GIFS
            if (window.matchMedia("(min-width: 1024px").matches) {
                let hover_cnt = document.createElement("div");
                hover_cnt.className = "hover-containers";

                createHoverCardFaved(fav_gif_title, hover_cnt, fav_gif_src, gif_json);
                let fav_gif = document.createElement('img');
                fav_gif.className = "gifs-result";
                fav_gif.id = "gifs-fav-" + i;
                fav_gif.setAttribute("src", fav_gif_src);
                hover_cnt.appendChild(fav_gif);
                ctn_results_favs.appendChild(hover_cnt);
            }

            // IF MOBILE, FULL GIF
            else if (window.matchMedia("(max-width: 1023px)").matches) {
                let fav_gif = document.createElement('img');
                fav_gif.className = "gifs-result";
                fav_gif.id = "gifs-" + i;
                fav_gif.setAttribute("src", fav_gif_src);
                ctn_results_favs.appendChild(fav_gif);
                fav_gif.addEventListener('click', () => {
                    fullGifFaved(fav_gif_src, fav_gif_title, gif_json);
                    window.scrollTo(0, 0);
                });
            }
        }
        createVerMasBtn();
    };
    offset_favs +=12;
    limit_favs += 12;
    if (limit_favs > (list_favorites.length-1)) {
        limit_favs = list_favorites.length; 
    }
};

// createVerMasBtn();
function createVerMasBtn() {
    console.log("entra el createVetMasBtn")
    if ((document.getElementById("btn-vermas-favs") !== null)) {
        document.getElementById("btn-vermas-favs").remove();
    }
    let ver_mas_favs = document.createElement("button");
    ver_mas_favs.id = "btn-vermas-favs";
    let ver_mas_p_favs = document.createElement("p");
    ver_mas_p_favs.id = "ver-mas-p-favs";
    ver_mas_p_favs.innerHTML = "Ver Más";
    ver_mas_favs.appendChild(ver_mas_p_favs);
    ctn_vermas_favs.appendChild(ver_mas_favs);
    ver_mas_favs.addEventListener('click', () => {
        getFavs();
    });
    ver_mas_favs.addEventListener('mouseenter', () => {
        ver_mas_favs.style.backgroundColor = "#572EE5";
        ver_mas_p_favs.style.color = "#FFFFFF";
    })
    ver_mas_favs.addEventListener('mouseleave', () => {
        ver_mas_favs.style.backgroundColor = "#FFFFFF";
        ver_mas_p_favs.style.color = "#572EE5";
    })
}


// createHoverCardFaved()
function createHoverCardFaved(this_gif_title,hover_cnt,this_gif_src,gif_json) {
    console.log("CREATE HOVER CARD FAVED")
    // create hover card
    let violet_card = document.createElement("div");
    violet_card.className = "violet-cards";
    // div top
    let div_top = document.createElement("div");
    div_top.id = "hover-div-top";
    violet_card.appendChild(div_top);
    // fav btn
    let fav_svg = document.createElement("img")
    fav_svg.id = "fav-svg";
    fav_svg.setAttribute('src', "assets/icon-fav-active.svg");
    fav_svg.style.opacity = "0.7";
    fav_svg.style.display = "flex";
    fav_svg.style.backgroundColor = "white";
    fav_svg.style.padding = "0px 6px";
    fav_svg.style.borderRadius = "5px";
    fav_svg.style.cursor = "pointer";
    fav_svg.addEventListener('mouseenter', () => {
        //fav_svg.setAttribute('src', "assets/icon-fav-hover.svg");
        fav_svg.style.opacity = "2";
    });
    fav_svg.addEventListener('mouseleave', () => {
        fav_svg.style.opacity = "0.7";
    })
    div_top.appendChild(fav_svg);
    // ========= REMOVE FROM FAVS =========
    fav_svg.addEventListener('click', () => {
        removeFromFavs(this_gif_src);
    });
    // create <a> for download btn
    let a_download = document.createElement("a");
    a_download.setAttribute("download", "download");
    div_top.appendChild(a_download);

    let href = createBlob(this_gif_src);
    href.then(url => {
        a_download.setAttribute("href", url);
    })
    a_download.setAttribute("download", "mygifo");
    // download btn
    let download_svg = document.createElement("img");
    download_svg.id = "download-svg";
    download_svg.setAttribute('src', "assets/icon-download.svg");
    download_svg.addEventListener('mouseenter', () => {
        download_svg.setAttribute('src', "assets/icon-download-hover.svg");
    });
    download_svg.addEventListener('mouseleave', () => {
        download_svg.setAttribute('src', "assets/icon-download.svg");
    })
    a_download.appendChild(download_svg);
    // fullsize btn
    let fullsize = document.createElement("img")
    fullsize.id = "fullsize-svg";
    fullsize.style.cursor = "pointer";
    fullsize.setAttribute('src', "assets/icon-max-normal.svg");
    fullsize.addEventListener('mouseenter', () => {
        fullsize.setAttribute('src', "assets/icon-max-hover.svg");
    });
    fullsize.addEventListener('mouseleave', () => {
        fullsize.setAttribute('src', "assets/icon-max-normal.svg");
    })

    // ====== GIFMAX EVENT ======
    fullsize.addEventListener('click', () => {
        fullGifFaved(this_gif_title,this_gif_src);
    });

    div_top.appendChild(fullsize);
    // div bottom
    let div_bottom = document.createElement("div");
    div_bottom.id = "hover-div-bottom";
    violet_card.appendChild(div_bottom);
    // user
    let p_user = document.createElement("p");
    p_user.id = "p-user";
    p_user.innerHTML = "User";
    div_bottom.appendChild(p_user);
    // gif title
    let gif_title = document.createElement("gif_title");
    gif_title.id = "gif-title";
    gif_title.textContent = this_gif_title;
    div_bottom.appendChild(gif_title);
    hover_cnt.appendChild(violet_card);
}


//========== FUNCTION GIF MAX (DESKTOP) ===========
function fullGifFaved(this_gif_src,this_gif_title,this_gif_object) {
    let main = document.getElementById("main-id");
    let cnt_card = document.createElement("div");
    cnt_card.id = "cnt-card";
    cnt_card.className = "mono-nocturno-main";
    main.appendChild(cnt_card);
    // Closebar at top
    let closebar = document.createElement("div");
    closebar.id = "closebar";
    cnt_card.appendChild(closebar);
    let close_btn = document.createElement("img");
    close_btn.id = "close-btn";
    close_btn.src = "assets/close.svg";
    closebar.appendChild(close_btn);
    //Gif fullsized
    let gif_full = document.createElement("img");
    gif_full.id = "gif-fullsize";
    gif_full.src = this_gif_src;
    cnt_card.appendChild(gif_full);
    let info_section = document.createElement("div");
    info_section.id = "info-section";
    cnt_card.appendChild(info_section);
    // Div left
    let div_left = document.createElement("div");
    div_left.id = "div-left";
    info_section.appendChild(div_left);
    let p_user = document.createElement("p");
    p_user.id = "p-user";
    p_user.innerHTML = "User";
    div_left.appendChild(p_user);
    let gifos_title = document.createElement("h3");
    gifos_title.id = "gifos-title";
    gifos_title.innerHTML = this_gif_title;
    div_left.appendChild(gifos_title);
    // Div right
    let div_right = document.createElement("div");
    div_right.id = "div-right";
    info_section.appendChild(div_right);
    let fav_svg_cnt = document.createElement("div");
    fav_svg_cnt.id = "svg-border-1";
    div_right.appendChild(fav_svg_cnt);
    let fav_svg = document.createElement("img");
    fav_svg.id = "fav-svg";
    fav_svg.src = "assets/icon-fav-active.svg";
    fav_svg_cnt.appendChild(fav_svg);
    let download_svg_cnt = document.createElement("div");
    download_svg_cnt.id = "svg-border-2";
    div_right.appendChild(download_svg_cnt);
    // Create <a> for ==== DOWNLOAD FUNCTION ====
    let a_download = document.createElement("a");
    a_download.style.margin = "auto";
    a_download.setAttribute("download", "download");
    download_svg_cnt.appendChild(a_download);

    let href = createBlob(this_gif_src);
    href.then(url => {
        a_download.setAttribute("href", url);
    })
    a_download.setAttribute("download", "mygifo");
    //download_svg_cnt.appendChild(a_download); se repite

    let download_svg = document.createElement("img");
    download_svg.id = "download-svg";
    download_svg.src = "assets/icon-download.svg";
    a_download.appendChild(download_svg);

    // CARD EVENTS
    let close_card = document.getElementById("close-btn");
    close_card.addEventListener('click', () => {
        document.getElementById("cnt-card").remove();
    })

    fav_svg.addEventListener('click', () => {
        removeFromFavs(this_gif_src);
    })
}




// function removeFromFavs() - Busca la coincidencia de src en el localStorage y lo elimina, actualiza el localStorage y recarga la página.
function removeFromFavs(this_gif_src) {
    let list_favorites2 = JSON.parse(localStorage.getItem("favs-id"));
    for (let i = 0; i < list_favorites2.length; i++) {
        let gif_object = JSON.parse(list_favorites2[i]);
        if (gif_object.images.original.url === this_gif_src) {
            localStorage.clear();
            list_favorites2.splice(i, 1);
            backToLocalStorage(list_favorites2);
            location.reload();
        }
    }
}

function backToLocalStorage(list) {
    localStorage.setItem("favs-id", JSON.stringify(list));
};

addEventListener('DOMContentLoaded',getFavs());