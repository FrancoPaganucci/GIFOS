const GIPHY_URL = 'https://media.giphy.com/media/';


// CHECK FOR ADDED "Mis GIFOS"...
var list_mis_gifos = [];
function checkForAddedMisGifos() {
    console.log("chequeo added Mis GIFOS");
    if (localStorage.getItem('myGifoKey')) {
        list_mis_gifos = JSON.parse(localStorage.getItem('myGifoKey'));
    } else if (localStorage.getItem('myGifoKey') == null) {
        list_mis_gifos = [];
    }
    return list_mis_gifos;
}
checkForAddedMisGifos();

addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("btn-vermas") !== null) {
        document.getElementById("btn-vermas").remove();
    }
});

function getMyGifos() {
    if (list_mis_gifos.length !== 0) {
        document.getElementById("no-results").style.display = "none";
        let ctn_results = document.getElementById("results");
        console.log("entró el getMyGifos");
        for (let i = 0; i < list_mis_gifos.length; i++) {
            // parse each object within list to acces keys
            console.log("entró al for de GetMyGifos")
            let gifo_key = list_mis_gifos[i].id;
            console.log("gifo_key: " + gifo_key);
            let this_gif_src = `${GIPHY_URL}${gifo_key}/giphy.gif`;

            // IF DESKTOP, HOVER ON GIFS
            if (window.matchMedia("(min-width: 1024px").matches) {
                let hover_cnt = document.createElement("div");
                hover_cnt.className = "hover-containers";
                createHoverCardMisGifos(hover_cnt,this_gif_src,gifo_key)
                let mi_gifo = document.createElement('img');
                mi_gifo.className = "gifs-result";
                mi_gifo.id = "mi-GIFO-" + i;
                mi_gifo.setAttribute("src", `${GIPHY_URL}${gifo_key}/giphy.gif`);
                hover_cnt.appendChild(mi_gifo);
                ctn_results.appendChild(hover_cnt);
            }

            // IF MOBILE, FULL SIZE
            
        };

    }
};

function createHoverCardMisGifos(hover_cnt,this_gif_src,gifo_key) {
    // create hover card
    let violet_card = document.createElement("div");
    violet_card.className = "violet-cards";
    // div top
    let div_top = document.createElement("div");
    div_top.id = "hover-div-top";
    violet_card.appendChild(div_top);

    // ========= REMOVE FROM MIS GIFOS =========
    let trash_svg = document.createElement("img")
    trash_svg.id = "trash-svg";
    trash_svg.setAttribute('src', "assets/icon-trash-normal.svg");
    trash_svg.style.opacity = "0.7";
    trash_svg.style.display = "flex";
    trash_svg.style.backgroundColor = "white";
    trash_svg.style.borderRadius = "5px";
    trash_svg.style.cursor = "pointer";
    trash_svg.addEventListener('mouseenter', () => {
    trash_svg.style.opacity = "2";
    });
    trash_svg.addEventListener('mouseleave', () => {
        trash_svg.style.opacity = "0.7";
    })
    div_top.appendChild(trash_svg);

    // REMOVE FROM MIS GIFOS EVENT
    trash_svg.addEventListener('click', () => {
        removeFromMisGifos(gifo_key);
    });

    // ========= DOWNLOAD ============
    let a_download = document.createElement("a");
    a_download.setAttribute("download", "download");
    div_top.appendChild(a_download);
    console.log("LINK PARA CREAR BLOB EN MISGIFOS: "+ this_gif_src);
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

    // ========= FULLSIZE ============
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
    // FULLSIZE EVENT
    fullsize.addEventListener('click', () => {
        gifMax(gifo_key);
        window.scrollTo(0, 0);
    })
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
    gif_title.textContent = "Título GIFO";
    div_bottom.appendChild(gif_title);
    hover_cnt.appendChild(violet_card);
};

// REMOVE (trash icon)
function removeFromMisGifos(gifo_key) {
    console.log("entra el remove from my gifos")
    let list_mis_gifos = JSON.parse(localStorage.getItem("myGifoKey"));
    for (let i = 0; i < list_mis_gifos.length; i++) {
        console.log("entra al for")
        let gif_id = list_mis_gifos[i];
        console.log("gif id: " + gif_id.id);
        console.log("gifo_key: "+ gifo_key);
        if (gif_id.id === gifo_key) {
            localStorage.clear();
            list_mis_gifos.splice(i, 1);
            backToLocalStorage(list_mis_gifos);
            location.reload();
        }
    }
}
function backToLocalStorage(list) {
    console.log("In function back to LS. Lista importada: "+list);
    localStorage.setItem("myGifoKey", JSON.stringify(list));
}


// GIFMAX
//========== FUNCTION GIF MAX (DESKTOP) ===========
function gifMax(gifo_key) {
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
    gif_full.src = `${GIPHY_URL}${gifo_key}/giphy.gif`;
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
    gifos_title.innerHTML = "Título GIFO";
    div_left.appendChild(gifos_title);
    // Div right
    let div_right = document.createElement("div");
    div_right.id = "div-right";
    info_section.appendChild(div_right);
    let trash_svg_cnt = document.createElement("div");
    trash_svg_cnt.id = "svg-border-1";
    div_right.appendChild(trash_svg_cnt);
    let trash_svg = document.createElement("img");
    trash_svg.id = "fav-svg";
    trash_svg.src = "assets/icon-trash-normal.svg";
    trash_svg_cnt.appendChild(trash_svg);
    let download_svg_cnt = document.createElement("div");
    download_svg_cnt.id = "svg-border-2";
    div_right.appendChild(download_svg_cnt);

    // Create <a> for ==== DOWNLOAD FUNCTION ====
    let a_download = document.createElement("a");
    a_download.style.margin = "auto";
    a_download.setAttribute("download", "download");
    download_svg_cnt.appendChild(a_download);
    let href = createBlob(`${GIPHY_URL}${gifo_key}/giphy.gif`);
    href.then(url => {
        a_download.setAttribute("href", url);
    })
    a_download.setAttribute("download", "mygifo");
    let download_svg = document.createElement("img");
    download_svg.id = "download-svg";
    download_svg.src = "assets/icon-download.svg";
    a_download.appendChild(download_svg);

    // CARD EVENTS
    let close_card = document.getElementById("close-btn");
    close_card.addEventListener('click', () => {
        document.getElementById("cnt-card").remove();
    })


    // ========= DELETE EVENT =========
    trash_svg.addEventListener('click', () => {
        removeFromMisGifos(gifo_key);
    });


};


addEventListener('DOMContentLoaded',getMyGifos());