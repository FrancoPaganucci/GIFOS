let btnrecord = document.getElementById('comenzar-btn');
let video = document.getElementById('video-rec');
var status_record = 0;
const APIKEY = "vPymXrvJlo5Hndwx1Ls1M2VXRUlumFHn";
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
        document.getElementById("main-logo").src = "./assets/logo-mobile-modo-noct.svg";
        document.getElementById("icon-hambur").src = "./assets/burger-modo-noct.svg";
        document.getElementById("icon-close").src = "./assets/close-modo-noct.svg";
        b = false
    }
    else if (!b) {
        document.getElementById("main-logo").src = "./assets/logo-mobile.svg";
        document.getElementById("icon-hambur").src = "./assets/burger.svg";
        document.getElementById("icon-close").src = "./assets/close.svg";
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

function captureCamera() {
    btnrecord.style.visibility = "hidden";
    document.getElementById("paso1").style.backgroundColor = "#572EE5";
    document.getElementById("inner-number-1").style.color = "#FFFFFF";
    document.getElementById("create-gifo-title").innerHTML = "¿Nos das acceso a tu cámara?";
    document.getElementById("create-gifo-p").innerHTML = "El acceso a tu camara será válido sólo por el tiempo en el que estés creando el GIFO.";
    // Obtener streaming de video y visualizarlo en el DOM
    navigator.mediaDevices.getUserMedia({
        video: true
    }).then(stream => {
        console.log(stream);
        video.srcObject = stream;
        video.play();
        video.style.height = "320px";
        video.style.width = "480px";
        video.style.display = "inherit";
        document.getElementById("create-gifo-title").remove();
        document.getElementById("create-gifo-p").remove();
        btnrecord.style.visibility = "visible";
        btnrecord.innerHTML = "Grabar";
        document.getElementById("paso1").style.backgroundColor = "#FFFFFF";
        document.getElementById("inner-number-1").style.color = "#572EE5";
        document.getElementById("paso2").style.backgroundColor = "#572EE5";
        document.getElementById("inner-number-2").style.color = "#FFFFFF";
        
        btnrecord.removeEventListener('click', captureCamera);
        
    }).catch(error =>{
        console.log(error);
        alert('Unable to capture your camera. Please check console logs.');
    });
    btnrecord.addEventListener('click', startRecording);
}




btnrecord.addEventListener('click', captureCamera);


// Start Recording
function startRecording() {
    console.log("entró a startRecording");
    navigator.mediaDevices.getUserMedia({
        video: true
    }).then(stream => {
        recorder = RecordRTC(stream, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 480,
            height: 320,
            hidden: 140,
            onGifRecordingStarted: function () {
                console.log('started');
            },
        });
        recorder.startRecording();
        // Timer
        dateStarted = new Date().getTime();
        setTimeout(looper, 1000);
        recorder.camera = stream;
        btnrecord.innerHTML = "Finalizar";
        btnrecord.removeEventListener('click',startRecording);
    }).catch(error => {
        console.log(error);
    });
    btnrecord.addEventListener('click',stopRecording);
}

// Stop recording
function stopRecording() {
    btnrecord.removeEventListener('click',stopRecording);
    recorder.stopRecording(stopRecordingCallback);
    stopTimer();
    document.getElementById("timer").innerHTML = "REPETIR CAPTURA";
    document.getElementById("timer").style.cursor = "pointer";
    // agregar evento repetir captura
    document.getElementById("timer").addEventListener('click', repetirCaptura);
    btnrecord.innerHTML = "SUBIR GIFO";
    document.getElementById("timer").style.textDecoration = "underline";
    document.getElementById("timer").style.textDecorationColor = "#50E3C2";
    document.getElementById("timer").style.textDecorationThickness = "3px";
    // agregar event listener uploadGif()
    btnrecord.addEventListener('click', uploadGif);
}

function repetirCaptura() {
    location.reload();
}

function stopRecordingCallback() {
    video.src = URL.createObjectURL(recorder.getBlob());
    const gif_preview = document.createElement("img");
    const screen = document.getElementById("screen");
    gif_preview.src = URL.createObjectURL(recorder.getBlob());
    gif_preview.style.position = "absolute";
    screen.appendChild(gif_preview);
    recorder.camera.stop();
}

// Recorder timer
function calculateTimeDuration(secs) {
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600)) / 60);
    var sec = Math.floor(secs - (hr * 3600) - (min * 60));
    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    if(hr <= 0) {
        hr = "0" + hr;
    }
    return hr + ':' + min + ':' + sec;
};

var timerView = null;
function looper() {
    if (!recorder) {
        return;
    } else {
        timerView = setInterval(printTimer,1000);
    }
};

function printTimer() {
    document.getElementById("timer").innerHTML = calculateTimeDuration((new Date().getTime() - dateStarted) / 1000);
};

function stopTimer() {
    console.log("se ejecuta stopTimer")
    clearInterval(timerView);
}


// Upload GIF
function uploadGif() {
    const form = new FormData();
    form.append('file', recorder.getBlob(), 'myGif.gif');
    console.log(form.get('file'));
    // UPLOADING BUFFER???
    gifBuffering();

    fetch(`https://upload.giphy.com/v1/gifs?api_key=${APIKEY}`, {
        method: "POST",
        body: form
    })
    .then(response => response.json())
    .then(response => {
        upload_card.remove();
        let this_gif_src = `${GIPHY_URL}${response.data.id}/giphy.gif`;
        uploadSuccesfull(this_gif_src,response.data.id);
        let id_toLocal = JSON.stringify(response.data);
        console.log("ID TO LOCAL: " + id_toLocal);
        list_mis_gifos.push(response.data);
        localStorage.setItem('myGifoKey',JSON.stringify(list_mis_gifos));
    })
    .catch(error => {
        console.log({error: `${error}`});
    });
};

// Uploading Gif buffer
function gifBuffering() {
    // Violet card
    const screen = document.getElementById("screen");
    const upload_card = document.createElement("div");
    upload_card.id = "upload_card";
    upload_card.style.backgroundColor = "#572EE5";
    upload_card.style.height = "320px";
    upload_card.style.width = "480px";
    upload_card.style.opacity = "0.6";
    upload_card.style.position = "absolute";
    upload_card.style.display = "flex";
    upload_card.style.flexDirection = "column";
    upload_card.style.alignItems = "center";
    upload_card.style.justifyContent = "center";
    const buffer_img = document.createElement("img");
    buffer_img.setAttribute('src', "./assets/loader.svg");
    buffer_img.style.height = "22px";
    buffer_img.style.width = "22px";
    buffer_img.style.marginBottom = "10px";
    const buffer_txt = document.createElement("p");
    buffer_txt.innerHTML = "Estamos subiendo tu GIFO";
    buffer_txt.style.color = "#FFFFFF";
    buffer_txt.style.fontSize = "15px";
    buffer_txt.style.textAlign = "center";
    buffer_txt.style.fontFamily = "'Montserrat'";
    buffer_txt.style.fontWeight = "800";
    upload_card.appendChild(buffer_img);
    upload_card.appendChild(buffer_txt);
    screen.appendChild(upload_card);
    // Clear btn and "repetir captura"
    document.getElementById("comenzar-btn").style.visibility = "hidden";
    document.getElementById("timer").style.visibility = "hidden";
    // Pintar paso 3, despintar paso 2
    document.getElementById("paso3").style.backgroundColor = "#572EE5";
    document.getElementById("inner-number-3").style.color = "#FFFFFF";
    document.getElementById("paso2").style.backgroundColor = "#FFFFFF";
    document.getElementById("inner-number-2").style.color = "#572EE5";

}

// Gif uploaded violet card
function uploadSuccesfull(this_gif_src,gif_id) {
    const screen = document.getElementById("screen");
    const upload_card = document.createElement("div");
    upload_card.id = "upload_card";
    upload_card.style.backgroundColor = "#572EE5";
    upload_card.style.height = "320px";
    upload_card.style.width = "480px";
    upload_card.style.opacity = "0.6";
    upload_card.style.position = "absolute";
    upload_card.style.display = "flex";
    upload_card.style.flexDirection = "column";
    upload_card.style.alignItems = "center";
    upload_card.style.justifyContent = "center";
    const buffer_img = document.createElement("img");
    buffer_img.setAttribute('src', "./assets/ok.svg");
    buffer_img.style.height = "22px";
    buffer_img.style.width = "22px";
    buffer_img.style.marginBottom = "10px";
    const buffer_txt = document.createElement("p");
    buffer_txt.innerHTML = "GIFO subido con éxito";
    buffer_txt.style.color = "#FFFFFF";
    buffer_txt.style.fontSize = "15px";
    buffer_txt.style.textAlign = "center";
    buffer_txt.style.fontFamily = "'Montserrat'";
    buffer_txt.style.fontWeight = "800";
    // download and link btns
    const btns_cnt = document.createElement("div");
    btns_cnt.style.position = "absolute";
    btns_cnt.style.top = "0";
    btns_cnt.style.right = "0";
    btns_cnt.style.marginTop = "11px";
    btns_cnt.style.marginRight = "12px";
    const link_icon = document.createElement("img");
    link_icon.setAttribute('src', "./assets/icon-link-normal.svg");
    link_icon.style.height = "32px";
    link_icon.style.width = "32px";
    link_icon.style.marginLeft = "10px"
    const download_icon = document.createElement("img");
    download_icon.setAttribute('src', "./assets/icon-download.svg");
    download_icon.style.height = "32px";
    download_icon.style.width = "32px";
    download_icon.id = "download-icon"

    // ===== DOWNLOAD ====
    console.log("esto es el gif src: " + this_gif_src)
    let a_download = document.createElement("a");
    a_download.setAttribute("download", "download");
    a_download.appendChild(download_icon);
    
    let href = createBlob(this_gif_src);
    href.then(url => {
        a_download.setAttribute("href", url);
    })
    a_download.setAttribute("download", "mygifo");

    btns_cnt.appendChild(a_download);
    btns_cnt.appendChild(link_icon);
    upload_card.appendChild(btns_cnt);
    upload_card.appendChild(buffer_img);
    upload_card.appendChild(buffer_txt);
    screen.appendChild(upload_card);


    // Hover events
    download_icon.addEventListener('mouseenter', () => {
        download_icon.setAttribute('src', "./assets/icon-download-hover.svg");
    });
    download_icon.addEventListener('mouseleave', () => {
        download_icon.setAttribute('src', "./assets/icon-download.svg");
    });
    link_icon.addEventListener('mouseenter', () => {
        link_icon.setAttribute('src', "./assets/icon-link-hover.svg");
    });
    link_icon.addEventListener('mouseleave', () => {
        link_icon.setAttribute('src', "./assets/icon-link-normal.svg")
    });
    // ===== COPY LINK TO CLIPBOARD =====
    link_icon.addEventListener('click', () => {
        const copyLink = `${GIPHY_URL}${gif_id}/giphy.gif`;
        console.log("copy link: " + copyLink);
        copy(copyLink);
    })

}


// ============ FUNCTIONS ============
function copy(x) {
    const copyText = x;
    const el = document.createElement('textarea');
    el.value = copyText;
    el.setAttribute('readonly', '');
    el.style = {
        position: 'absolute',
        left: '-9999px'
    };
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert("Link copiado en clipboard! :)");
};

// Async function createBlob
async function createBlob(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.log("ERROR: ", error);
    }
};