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


//============== API KEY ================
const api_key = "vPymXrvJlo5Hndwx1Ls1M2VXRUlumFHn";

// night mode check
let nightmode_check = localStorage.getItem("nightmode-status");
console.log("nightmode_check al ppio del refresh: " + nightmode_check);

var btn_noct = document.getElementById("a-noct");
var night = document.getElementsByClassName("modo-nocturno-main");
var night_trending = document.getElementsByClassName("modo-nocturno-trending");
var night_menu = document.getElementsByClassName("modo-nocturno-menu");
var borders_noct = document.getElementsByClassName("borders-noct");
var contador = 0;
var input_almacenado = "";
// NIGHT MODE LISTENER
btn_noct.addEventListener('click', nightMode);


// FUNCIONES
//============ NIGHT MODE ====================
// nightMode() se mantiene en los distintos paths
btn_noct.addEventListener('click', () => {
    if (nightmode_check !== "true") {
        nightmode_check = "true";
        console.log(nightmode_check);
        localStorage.setItem("nightmode-status", "true");
    } else {
        nightmode_check = "false";
        console.log(nightmode_check);
        localStorage.setItem("nightmode-status", "false");
    }
})

let b = true;
function nightMode() {
    for (let i = 0; i < night.length; i++) {
        night[i].classList.toggle("modo-nocturno-main-on");
    }
    for (let i = 0; i < night_trending.length; i++) {
        night_trending[i].classList.toggle("modo-nocturno-trending-on");
    }
    for (let i = 0; i < night_menu.length; i++) {
        night_menu[i].classList.toggle("modo-nocturno-menu-on");
    }
    for (let i = 0; i < borders_noct.length; i++) {
        borders_noct[i].classList.toggle("borders-noct-on");
    }

    // toggle logo + menú icons
    if (b) {
        document.getElementById("main-logo").src = "assets/logo-mobile-modo-noct.svg";
        document.getElementById("icon-hambur").src = "assets/burger-modo-noct.svg";
        document.getElementById("icon-close").src = "assets/close-modo-noct.svg";
        b = false
    }
    else if (!b) {
        document.getElementById("main-logo").src = "assets/logo-mobile.svg";
        document.getElementById("icon-hambur").src = "assets/burger.svg";
        document.getElementById("icon-close").src = "assets/close.svg";
        b = true;
    }

    // toggle "modo nocturno" - "modo diurno"
    if (btn_noct.innerHTML === "Modo Nocturno") {
        btn_noct.innerHTML = "Modo Diurno";
    }
    else {
        btn_noct.innerHTML = "Modo Nocturno";
    }
}
// IF CHECK FOR NIGHTMODE STATUS IN LOCAL STORAGE
if (nightmode_check === "true") {
    nightMode();
}


//===================== GIF SEARCH ========================
let search_input = document.getElementById("search-input");
let search_icon = document.getElementById("search-icon")
let ctn_results = document.getElementById("ctn-results");
let ctn_vermas = document.getElementById("ctn-btn-vermas");
let keyword = document.createElement('h1');
keyword.id = "keyword-searched";
keyword.className = "modo-nocturno-main";
let ctn_gifs = document.createElement('div');
ctn_gifs.id = "ctn-gifs";

// cascarón search function
function search() {
    async function newSearch(q, offset) {
        const url = "https://api.giphy.com/v1/gifs/search?api_key=" + api_key + "&q=" + q + "&limit=12&offset=" + offset + "&rating=g";
        const resp = await fetch(url);
        const info = await resp.json();
        return info;
    }
    // fetch con promesa
    let input_value = search_input.value;
    console.log("input value: "+input_value)
    // Parámetros de newSearch(quote, offset)
    let info = newSearch(input_value, 0);
    info.then(response => {
        // CREAR SEPARADOR
        createSeparator();
        // CREAR TITULO
        createTitle(input_value);
        // LLAMA FUNCION QUE CREA GIFS
        createGif(response);
        // CREAR BTN 'VER MÁS'
        createVerMasBtn();
        // BORRAR INPUT - antes almacenar valor para el VER MÁS BTN
        input_almacenado = input_value;
        clearInput();
        // BORRAR DIV AUTOCOMPLETE
        if (document.getElementById("div-search") !== null) {
            console.log("acá encuentra el div search pero hay que borrarlo")
            document.getElementById("div-search").remove();
        }
        search_complete = 1;
        return input_almacenado;
    }).catch(error => {
        console.log(error);
    })
}

// generar gif
function createGif(x) {
    if (x.data.length > 0) {
        for (let i = 0; i < x.data.length; i++) {
            let this_gif_src = x.data[i].images.original.url;
            let this_gif_title = x.data[i].title;
            let this_gif_object = x.data[i];

            // IF DESKTOP
            if (window.matchMedia("(min-width: 1024px)").matches) {
                let hover_cnt = document.createElement("div");
                hover_cnt.className = "hover-containers";
                // === CREATE HOVER CARD FUNCTION ===
                createHoverCard(this_gif_title, hover_cnt, this_gif_src,this_gif_object, i);
                // create gif
                let gif = document.createElement('img');
                gif.className = "gifs-result";
                gif.id = "gifs-" + i;
                gif.setAttribute("src", x.data[i].images.original.url);
                hover_cnt.appendChild(gif);
                ctn_gifs.appendChild(hover_cnt);
            }


            // IF MOBILE, remove hover cards & apply fullGif
            else if (window.matchMedia("(max-width: 1023px)").matches) {
                console.log("fullGif!!!");
                let gif = document.createElement('img');
                gif.className = "gifs-result";
                gif.id = "gifs-" + i;
                gif.style.height = "120px";
                gif.style.width = "156px";
                gif.setAttribute("src", x.data[i].images.original.url);
                let this_gif_src = x.data[i].images.original.url;
                let this_gif_title = x.data[i].title;
                let this_gif_object = x.data[i];
                ctn_gifs.appendChild(gif);
                gif.addEventListener('click', () => {
                    fullGif(this_gif_src, this_gif_title, this_gif_object);
                    window.scrollTo(0, 0);
                });
            }

        }
        ctn_results.appendChild(ctn_gifs);
    } else {
        // else, no se encontraron resultados.
        let ouch = document.createElement('img');
        ouch.src = "assets/icon-busqueda-sin-resultado.svg";
        ouch.style.height = "150px";
        ouch.style.width = "150px";
        ouch.style.alignSelf = "center";
        ouch.id = "ouch-img";
        ctn_results.appendChild(ouch);
        let sub_ouch = document.createElement('h3');
        sub_ouch.innerText = "Intenta con otra búsqueda";
        sub_ouch.style.fontFamily = "'Montserrat', bold";
        sub_ouch.style.color = "#50E3C2";
        sub_ouch.style.alignSelf = "center";
        sub_ouch.style.fontSize = "22px";
        sub_ouch.style.marginTop = "29px";
        sub_ouch.style.marginBottom = "149px";
        sub_ouch.id = "ouch-sub";
        ctn_results.appendChild(sub_ouch);
    }

}

// limpiar imput
function clearInput() {
    search_input.value = '';
}

// generar h1
function createTitle(q) {
    keyword.innerHTML = q;
    if (nightmode_check === "true") {
        keyword.setAttribute("class", "modo-nocturno-main-on modo-nocturno-main");
    } else {
        keyword.setAttribute("class", "modo-nocturno-main");
    }
    ctn_results.appendChild(keyword);
}

// crear separador
function createSeparator() {
    if (document.getElementById("separador-results") != null) {
        document.getElementById("separador-results").remove();
    }
    let separator = document.createElement("div");
    separator.id = "separador-results";
    ctn_results.appendChild(separator);
}

// crear botón VER MÁS
function createVerMasBtn() {
    if ((document.getElementById("btn-vermas") !== null)) {
        document.getElementById("btn-vermas").remove();
    }

    let ver_mas = document.createElement("button");
    ver_mas.id = "btn-vermas";
    let ver_mas_p = document.createElement("p");
    ver_mas_p.id = "ver-mas-p";
    ver_mas_p.innerHTML = "Ver Más";
    ver_mas.appendChild(ver_mas_p);
    ctn_vermas.appendChild(ver_mas);


    ver_mas.addEventListener('click', () => {
        async function newSearch2(q, offset) {
            const url = "https://api.giphy.com/v1/gifs/search?api_key=" + api_key + "&q=" + q + "&limit=12&offset=" + offset + "&rating=g";
            const resp = await fetch(url);
            const info = await resp.json();
            return info;
        }
        // fetch
        contador += 12;
        let info = newSearch2(input_almacenado, contador);
        info.then(response => {
            if (response.data.length > 0) {
                createVerMasGifs(response, contador);
            }
        }).catch(error => {
            console.log(error);
        })
        return contador;
    });
    ver_mas.addEventListener('mouseenter', () => {
        ver_mas.style.backgroundColor = "#572EE5";
        ver_mas_p.style.color = "#FFFFFF";
    })
    ver_mas.addEventListener('mouseleave', () => {
        ver_mas.style.backgroundColor = "#FFFFFF";
        ver_mas_p.style.color = "#572EE5";
    })

}

// createVerMasGifs
// callback = createCard()
function createVerMasGifs(x, idnum) {
    if (x.data.length < 12) {
        document.getElementById("btn-vermas").remove();
    }
    for (let i = 0; i < x.data.length; i++) {
        let this_gif_src = x.data[i].images.original.url;
        let this_gif_title = x.data[i].title;
        let this_gif_object = x.data[i];
        // IF DESKTOP, HOVER ON GIFS
        if (window.matchMedia("(min-width: 1024px").matches) {
            // create individual cnt for each gif (hover)
            let hover_cnt = document.createElement("div");
            hover_cnt.className = "hover-containers";
            // === CREATE HOVER CARD FUNCTION ===
            createHoverCard(this_gif_title, hover_cnt, this_gif_src,this_gif_object, i);
            // create gif
            let gif = document.createElement('img');
            gif.className = "gifs-result";
            gif.id = "gifs-" + idnum;
            gif.setAttribute("src", x.data[i].images.original.url);
            hover_cnt.appendChild(gif);
            ctn_gifs.appendChild(hover_cnt);
        }

        // IF MOBILE, FULL GIF CARD
        else if (window.matchMedia("(max-width: 1023px)").matches) {
            console.log("fullGif!!!");
            let gif = document.createElement('img');
            gif.className = "gifs-result";
            gif.id = "gifs-" + i;
            gif.style.height = "120px";
            gif.style.width = "156px";
            gif.setAttribute("src", x.data[i].images.original.url);
            let this_gif_src = x.data[i].images.original.url;
            let this_gif_title = x.data[i].title;
            let this_gif_object = x.data[i];
            ctn_gifs.appendChild(gif);
            gif.addEventListener('click', () => {
                fullGif(this_gif_src, this_gif_title, this_gif_object);
                window.scrollTo(0, 0);
            });
        }
        idnum++;
    }
    ctn_results.appendChild(ctn_gifs);
}





 //============= CREATE HOVER CARDS ==============
function createHoverCard(this_gif_title,hover_cnt,this_gif_src,this_gif_object, i) {
    // create hover card
    let violet_card = document.createElement("div");
    violet_card.className = "violet-cards";
    violet_card.id = "violet-card-"+i;
    // div top
    let div_top = document.createElement("div");
    div_top.id = "hover-div-top";
    violet_card.appendChild(div_top);
    // fav btn
    let fav_svg = document.createElement("img")
    fav_svg.id = "fav-svg";
    fav_svg.style.cursor = "pointer";
    fav_svg.setAttribute('src', "assets/icon-fav.svg");
    fav_svg.addEventListener('mouseenter', () => {
        fav_svg.setAttribute('src', "assets/icon-fav-hover.svg");
    });('mouseleave', () => {
        if (fav_svg.src = "assets/icon-fav-hover.svg") {
            fav_svg.setAttribute('src', "assets/icon-fav.svg");
        }
    })
    fav_svg.addEventListener('click', () => {
        // remove hover card, create hover card faved
        document.getElementById("violet-card-"+i).remove();
        console.log("borraste la hover card")
        createHoverCardFaved(this_gif_title,hover_cnt,this_gif_src,this_gif_object);
    })
    div_top.appendChild(fav_svg);
    // ========= ADD TO FAVS =========
    let this_gif_string = JSON.stringify(this_gif_object);
    addToFavs(this_gif_string,fav_svg);
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
    // ====== GIF MAX (DESKTOP) ======
    fullsize.addEventListener('click', () => {
        gifMax(this_gif_title,this_gif_src, this_gif_object);
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
    gif_title.textContent = this_gif_title;
    div_bottom.appendChild(gif_title);
    hover_cnt.appendChild(violet_card);
};



// evento keyup enter para input
if (search_input) {
    search_input.addEventListener('keyup', (e) => {
        if (e.which === 13 || e.keyCode === 13) {
            if ((ctn_gifs.innerHTML != null) && (keyword.innerHTML !== null)) {
                ctn_gifs.innerHTML = null;
                keyword.innerHTML = null;
            }

            if (document.getElementById("ouch-img") !== null) {
                document.getElementById("ouch-img").remove();
                document.getElementById("ouch-sub").remove();
            }
            search();
            
            if (document.getElementById("div-search") !== null) {
                console.log("entró al borrar div-search")
                document.getElementById("div-search").remove();
            }
        }
    });
}


// evento click para searchbar icon
if (search_icon) {
    search_icon.addEventListener('click', () => {
        if ((ctn_gifs.innerHTML != null) && (keyword.innerHTML != null)) {
            ctn_gifs.innerHTML = null;
            keyword.innerHTML = null;
        }
        search()
    });
}




//==================== PREDICTIVE SEARCH ====================
if (search_input) {
    search_input.addEventListener('input', () => {

        async function predict(q) {
            const url_pred = "https://api.giphy.com/v1/gifs/search/tags?api_key=" + api_key + "&q=" + q;
            const resp = await fetch(url_pred);
            const info = await resp.json();
            return info
        }

        //fetch
        let input_value = search_input.value;
        let info = predict(input_value);
        info.then(response => {
            console.log(response.data);
            //creo contenedor
            if ((document.getElementById("div-search") !== null) || (input_value == "") || (response.data.length === 0)) {
                console.log("ya creaste un div search! borralo antes de crear otro")
                document.getElementById("div-search").remove();
                if (document.getElementById("exit-icon")) {
                    document.getElementById("exit-icon").remove();
                }
            }
            let div_search = document.createElement('div');
            div_search.id = "div-search";
            // agrego el contenedor al searchbar
            let searchbar = document.getElementById("searchbar");
            searchbar.appendChild(div_search);
            // paso la lupa del otro lado del search bar
            let move_search_icon = document.getElementById("search-icon");
            move_search_icon.style.marginLeft = "15px";
            move_search_icon.style.background = "$pred-magnif-color";
            // agrego X al searchbar lado derecho
            if (document.getElementById("exit-icon") !== null) {
                document.getElementById("exit-icon").remove();
            }
            let exit_icon = document.createElement('img');
            exit_icon.src = "assets/close.svg";
            exit_icon.id = "exit-icon";
            // agrego evento cerrar buscador
            exit_icon.addEventListener('click', () => {
                if (document.getElementById("pred-ul")) {
                    document.getElementById("pred-ul").remove();
                    document.getElementById("search-input").value = "";
                    move_search_icon.style.marginLeft = "";
                    exit_icon.remove();
                }
            })
            searchbar.appendChild(exit_icon);
            // creo lista
            let pred_ul = document.createElement('ul');
            pred_ul.id = "pred-ul";
            // agrego lista ul al contenedor
            div_search.appendChild(pred_ul);
            // seteo límite de predicciones a 5
            let limit = Math.min(5, response.data.length);
            for (let i = 0; i < limit; i++) {
                // creo span y agrego evento click de búsqueda
                let span = document.createElement('span');
                span.className = "predictive-span";

                //========= EVENTO CLICK EN SUGERENCIA PREDICTIVA --> NUEVA BÚSQUEDA =========
                span.addEventListener('click', () => {

                    if ((ctn_gifs.innerHTML != null) && (keyword.innerHTML != null)) {
                        ctn_gifs.innerHTML = null;
                        keyword.innerHTML = null;
                    }
                    // search function for click suggestion event
                    function searchClicked() {
                        async function newSearch(q, offset) {
                            const url = "https://api.giphy.com/v1/gifs/search?api_key=" + api_key + "&q=" + q + "&limit=12&offset=" + offset + "&rating=g";
                            const resp = await fetch(url);
                            const info = await resp.json();
                            return info;
                        }
                        // fetch con promesa
                        if (document.getElementsByClassName("pred-lis") !== null) {
                            let input_value = document.getElementById("li-search-" + i).innerText;
                            // Parámetros de newSearch(quote, offset)
                            let info = newSearch(input_value, 0);
                            info.then(response => {
                                // CREAR SEPARADOR
                                createSeparator();
                                // CREAR TITULO
                                createTitle(input_value);
                                // LLAMA FUNCION QUE CREA GIFS
                                createGif(response);
                                // CREAR BTN 'VER MÁS'
                                createVerMasBtn();
                                // BORRAR INPUT - antes almacenar valor para el VER MÁS BTN
                                input_almacenado = input_value;
                                clearInput();
                                search_complete = 1;
                                return input_almacenado;
                            }).catch(error => {
                                console.log(error);
                            })
                        }
                    }
                    searchClicked();
                    document.getElementById("div-search").remove();
                    document.getElementById("exit-icon").remove();
                    document.getElementById("search-icon").style.marginLeft = "294px";
                    if (window.matchMedia("(min-width: 1024px").matches) {
                        document.getElementById("search-icon").style.marginLeft = "509px";
                    };

                })
                // creo item
                let pred_li = document.createElement('li');
                pred_li.id = "li-search-" + i;
                pred_li.className = "pred-lis";
                // agrego lupas a cada li
                let lupa_li = document.createElement('img');
                lupa_li.className = "lupa-pred";
                lupa_li.src = "assets/icon-search.svg";
                span.appendChild(lupa_li);
                // escribo item
                pred_li.textContent = response.data[i].name;
                // agrego li al span
                span.appendChild(pred_li);
                //agrego span a ul
                pred_ul.appendChild(span);
            }

            if (response.data.length === 0) {
                console.log("Entra?")
                document.getElementById("div-search").remove();
                document.getElementById("exit-icon").remove();
                document.getElementById("search-icon").style.marginLeft = "294px";
                if (window.matchMedia("(min-width: 1024px").matches) {
                    document.getElementById("search-icon").style.marginLeft = "509px";
                };
            }
            return response;
        }).then(response => {
            if (response.data.length === 0) {
                document.getElementById("div-search").remove();
            }
        }).catch(error => {
            console.log(error);
        })

    })
}



//================= CARD GENERATOR FAV/DOWNLOAD =======================
function fullGif(this_gif_src, this_gif_title, this_gif_object) {
    console.log("prueba de agregar click evento a gifs")
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
    fav_svg.src = "assets/icon-fav.svg";
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


    

    // ========= ADD TO FAVS =========
    let this_gif_string = JSON.stringify(this_gif_object);
    addToFavs(this_gif_string,fav_svg);


    // ========= DOWNLOAD SVG ACTIVE WHEN CLICKED =========
    let download = document.getElementById("download-svg");
    let download_opacity_cnt = document.getElementById("svg-border-2")
    download.addEventListener('click', () => {
        download.src = "assets/icon-download-hover.svg";
        download_opacity_cnt.style.opacity = 1;
    });

}

// Async function createBlob
async function createBlob(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

// function Add to favorites
function addToFavs(this_gif_string,add_to_favs) {
    add_to_favs.addEventListener('click', () => {
        list_favorites.push(this_gif_string);
        let stringified = JSON.stringify(list_favorites);
        localStorage.setItem('favs-id', stringified);

        // Cambiar svg de fav a active
        add_to_favs.setAttribute("src", "assets/icon-fav-active.svg");
        add_to_favs.style.height = "36px";
        add_to_favs.style.width = "36px";

    })
}



//TRENDINGS
let reel = document.getElementById("reel");
getGiphyTrendings("https://api.giphy.com/v1/gifs/trending?api_key=" + api_key + "&limit=12");

function getGiphyTrendings(url) {
    fetch(url)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            let idnum = 0;
            for (let i = 0; i < json.data.length; i++) {
                let this_gif_src = json.data[i].images.original.url;
                let this_gif_object = json.data[i];
                let this_gif_title = json.data[i].title;
                // IF DESKTOP
                if (window.matchMedia("(min-width: 1024px)").matches) {
                    console.log("Entra en modo Desktop");
                    // create individual cnt for each gif (hover)
                    let hover_cnt = document.createElement("div");
                    hover_cnt.className = "hover-containers";
                    // === CREATE HOVER CARD FUNCTION ===
                    createHoverCard(this_gif_title, hover_cnt,this_gif_src,this_gif_object, i);
                    // === CREATE HOVER GIFS ===
                    let gif = document.createElement('img');
                    gif.className = "gifs";
                    gif.id = "trend-gifs-" + idnum;
                    gif.setAttribute("src", json.data[i].images.original.url);
                    hover_cnt.appendChild(gif);
                    reel.appendChild(hover_cnt);
                    // ELSE MOBILE
                } else if (window.matchMedia("(max-width: 1023px)").matches) {
                    console.log("Entra en modo Mobile");
                    let gif = document.createElement('img');
                    gif.className = "gifs";
                    gif.id = "trend-gifs-" + idnum;
                    gif.setAttribute("src", json.data[i].images.original.url);
                    ctn_gifs.appendChild(gif);
                    gif.addEventListener('click', () => {
                        fullGif(this_gif_src, this_gif_title, this_gif_object);
                        window.scrollTo(0, 0);
                    });
                    reel.append(gif);
                }
                idnum++;
            }
    })
    .catch(err => {
        console.error("el fetch falló", err);
    })
};

// ======= TRENDING SLIDER EVENTS ==========
let btn_slide_left = document.getElementById("slide-btn-left");
let btn_slide_right = document.getElementById("slide-btn-right");
btn_slide_right.addEventListener('click', () => {
    reel.scrollBy({left: 384, behavior: 'smooth'});
});

btn_slide_left.addEventListener('click', () => {
    reel.scrollBy({left: -384, behavior: 'smooth'});
});

//============= HOVER EVENTS ==============
let fb_hover = document.getElementById("facebook-hover");
let tw_hover = document.getElementById("twitter-hover");
let ig_hover = document.getElementById("instagram-hover");
let slide_left = document.getElementById("slide-btn-left");
let slide_right = document.getElementById("slide-btn-right");
fb_hover.addEventListener('mouseenter', () => {
    fb_hover.src = "assets/icon_facebook_hover.svg";
});
fb_hover.addEventListener('mouseleave', () => {
    fb_hover.src = "assets/icon_facebook.svg";
});
tw_hover.addEventListener('mouseenter', () => {
    tw_hover.src = "assets/icon-twitter-hover.svg";
});
tw_hover.addEventListener('mouseleave', () => {
    tw_hover.src = "assets/icon-twitter.svg";
});
ig_hover.addEventListener('mouseenter', () => {
    ig_hover.src = "assets/icon_instagram-hover.svg";
});
ig_hover.addEventListener('mouseleave', () => {
    ig_hover.src = "assets/icon_instagram.svg";
});
slide_left.addEventListener('mouseenter', () => {
    slide_left.src = "assets/button-slider-left-hover.svg";
});
slide_left.addEventListener('mouseleave', () => {
    slide_left.src = "assets/button-slider-left.svg";
});
slide_right.addEventListener('mouseenter', () => {
    slide_right.src = "assets/button-slider-right-hover.svg";
});
slide_right.addEventListener('mouseleave', () => {
    slide_right.src = "assets/button-slider-right.svg";
});



// CreateHoverCardFaved (Se repite-- ver cómo importarla directamente de script-favs.js)
// createHoverCardFaved()
function createHoverCardFaved(this_gif_title,hover_cnt,this_gif_src,this_gif_object) {
    console.log("crear una nueva hover card pero ahora faveada")
    // create hover card
    let violet_card = document.createElement("div");
    violet_card.className = "violet-cards-faved";
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
        fav_svg.style.opacity = "2";
    });
    fav_svg.addEventListener('mouseleave', () => {
        fav_svg.style.opacity = "0.7";
    })
    div_top.appendChild(fav_svg);
    // ========= REMOVE FROM FAVS =========
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
    // ====== GIF MAX (DESKTOP) ======
    fullsize.addEventListener('click', () => {
        console.log("entró en gifMAx");
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
    gif_title.textContent = this_gif_title;
    div_bottom.appendChild(gif_title);
    hover_cnt.appendChild(violet_card);
}


//========== FUNCTION GIF MAX (DESKTOP) ===========
function gifMax(this_gif_title,this_gif_src,this_gif_object) {
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
    fav_svg.src = "assets/icon-fav.svg";
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


    

    // ========= ADD TO FAVS =========
    let this_gif_string = JSON.stringify(this_gif_object);
    addToFavs(this_gif_string,fav_svg);


    // ========= DOWNLOAD SVG ACTIVE WHEN CLICKED =========
    let download = document.getElementById("download-svg");
    let download_opacity_cnt = document.getElementById("svg-border-2")
    download.addEventListener('click', () => {
        download.src = "assets/icon-download-hover.svg";
        download_opacity_cnt.style.opacity = 1;
    });
};