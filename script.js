// ==========================================
// MUSIC + PHOTO MEMORY WEBSITE
// Part 3 — script.js
// ==========================================


// ==========================================
// SETTINGS
// ==========================================

const TOTAL_PHOTOS = 20;

// Photo change interval.
// 40 photos over ~64 seconds ≈ 1.6 sec each.
const PHOTO_INTERVAL = 3200;


// ==========================================
// ELEMENTS
// ==========================================

const music = document.getElementById("music");

const playBtn = document.getElementById("playBtn");

const muteBtn = document.getElementById("muteBtn");

const startBtn = document.getElementById("startBtn");

const startScreen =
    document.getElementById("startScreen");

const photoLayer =
    document.getElementById("photoLayer");

const photoNumber =
    document.getElementById("photoNumber");

const totalPhotos =
    document.getElementById("totalPhotos");

const lyricsElement =
    document.getElementById("lyrics");

const progress =
    document.getElementById("progress");

const currentTimeElement =
    document.getElementById("currentTime");

const durationElement =
    document.getElementById("duration");

const musicStatus =
    document.getElementById("musicStatus");

const particles =
    document.getElementById("particles");

const ending =
    document.getElementById("ending");


// ==========================================
// PHOTOS
// ==========================================

const photos = [];

for(let i = 1; i <= TOTAL_PHOTOS; i++){

    const number =
        String(i).padStart(2,"0");

    photos.push(
        `./photos/${number}.jpg`
    );
}

totalPhotos.textContent =
    String(TOTAL_PHOTOS).padStart(2,"0");


// ==========================================
// PRELOAD PHOTOS
// ==========================================

photos.forEach(src => {

    const img = new Image();

    img.src = src;

});


// ==========================================
// PHOTO SLIDESHOW
// ==========================================

let currentPhoto = 0;

let photoTimer = null;


function showPhoto(index){

    if(index >= photos.length){

        index = 0;

    }

    currentPhoto = index;


    // Fade out

    photoLayer.style.opacity = "0";

    photoLayer.style.transform =
        "scale(1.02)";


    setTimeout(() => {

        photoLayer.style.backgroundImage =
            `url("${photos[currentPhoto]}")`;

        photoLayer.style.backgroundPosition =
            "center";

        photoLayer.style.backgroundSize =
            "cover";


        // Slight zoom

        requestAnimationFrame(() => {

            photoLayer.style.opacity = "1";

            photoLayer.style.transform =
                "scale(1.07)";

        });


        photoNumber.textContent =
            String(currentPhoto + 1)
            .padStart(2,"0");

    },500);
}


function startSlideshow(){

    clearInterval(photoTimer);

    showPhoto(0);

    photoTimer = setInterval(() => {

        currentPhoto++;

        if(currentPhoto >= photos.length){

            currentPhoto = 0;

        }

        showPhoto(currentPhoto);

    }, PHOTO_INTERVAL);
}


function stopSlideshow(){

    clearInterval(photoTimer);

    photoTimer = null;

}


// ==========================================
// YOUR LYRICS
// ==========================================
//
// IMPORTANT:
// Apni legally available lyrics/text
// yahan paste karo.
//
// time = song ke seconds
//
// Example:
//
// { time: 0, text: "YOUR LINE 💕" },
// { time: 5, text: "NEXT LINE ✨" },
//
// ==========================================

const lyrics = [

    {
        time: 0,
        text: "Gulaabi aankhen jo teri dekhi 👀✨"
    },

    {
        time: 5,
        text: "Sharaabi yeh dil ho gaya 💕"
    },

    {
        time: 15,
        text: "Music 🎶.."
    },

    {
        time: 15,
        text: "Dil mein mere.. khwaab tere🍂"
    },

    {
        time: 20,
        text: "Taswere jaise ho deewaar pe..💭"
    },

    {
        time: 25,
        text: " Tujh par Fida.. me kyu hua💕"
    },

    {
        time: 30,
        text: "Aata hai gussa mujhe pyaar pe ❤️‍🔥"
    },

    {
        time: 35,
        text: "Main Lut gya.. manke dil ka khaa 🌙"
    },

    {
        time: 40,
        text: "Me khi ka na rha ❤️‍🔥"
    },

    {
        time: 45,
        text: "Kya khu me dilruba ❤️‍🩹"
    },

    {
        time: 50,
        text: "Bura ye jaadu.. teri aankhon ka 👀"
    },

    {
        time: 55,
        text: "Ye mera Katil hogya..🔪"
    },

    {
        time: 60,
        text: "Gulabi Aankhen jo teri dekhi "
    }

];


// ==========================================
// TYPEWRITER
// ==========================================

let currentLyricIndex = -1;

let typingTimer = null;


function typeLyric(text){

    clearInterval(typingTimer);

    lyricsElement.style.opacity = "0";

    lyricsElement.style.transform =
        "translateY(8px)";


    setTimeout(() => {

        lyricsElement.textContent = "";

        lyricsElement.style.opacity = "1";

        lyricsElement.style.transform =
            "translateY(0)";


        let character = 0;


        typingTimer = setInterval(() => {

            lyricsElement.textContent +=
                text.charAt(character);

            character++;


            if(character >= text.length){

                clearInterval(typingTimer);

            }

        },35);

    },250);
}


function updateLyrics(){

    const time = music.currentTime;


    let newIndex = -1;


    for(let i = 0; i < lyrics.length; i++){

        if(time >= lyrics[i].time){

            newIndex = i;

        }else{

            break;

        }

    }


    if(
        newIndex !== -1 &&
        newIndex !== currentLyricIndex
    ){

        currentLyricIndex =
            newIndex;

        typeLyric(
            lyrics[newIndex].text
        );

    }

}


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(seconds){

    if(!Number.isFinite(seconds)){

        return "0:00";

    }


    const minutes =
        Math.floor(seconds / 60);

    const secs =
        Math.floor(seconds % 60);


    return `${minutes}:${String(secs).padStart(2,"0")}`;
}


// ==========================================
// MUSIC PLAY
// ==========================================

async function playMusic(){

    try{

        await music.play();

        playBtn.textContent = "❚❚";

        musicStatus.textContent =
            "Playing...";

        startSlideshow();

    }catch(error){

        console.log(
            "Music could not start:",
            error
        );

        musicStatus.textContent =
            "Tap play to start";

    }

}


// ==========================================
// MUSIC PAUSE
// ==========================================

function pauseMusic(){

    music.pause();

    playBtn.textContent = "▶";

    musicStatus.textContent =
        "Paused";

    stopSlideshow();

}


// ==========================================
// PLAY BUTTON
// ==========================================

playBtn.addEventListener(
    "click",
    () => {

        if(music.paused){

            playMusic();

        }else{

            pauseMusic();

        }

    }
);


// ==========================================
// START BUTTON
// ==========================================

startBtn.addEventListener(
    "click",
    async () => {

        startScreen.classList.add("hide");

        await playMusic();

    }
);


// ==========================================
// MUTE BUTTON
// ==========================================

muteBtn.addEventListener(
    "click",
    () => {

        music.muted =
            !music.muted;


        muteBtn.textContent =
            music.muted
            ? "🔇"
            : "🔊";

    }
);


// ==========================================
// PROGRESS BAR
// ==========================================

music.addEventListener(
    "timeupdate",
    () => {

        if(music.duration){

            const percentage =
                (music.currentTime /
                music.duration) * 100;


            progress.style.width =
                `${percentage}%`;

        }


        currentTimeElement.textContent =
            formatTime(
                music.currentTime
            );


        updateLyrics();

    }
);


// ==========================================
// DURATION
// ==========================================

music.addEventListener(
    "loadedmetadata",
    () => {

        durationElement.textContent =
            formatTime(
                music.duration
            );

    }
);


// ==========================================
// CLICK PROGRESS BAR
// ==========================================

const progressTrack =
    document.querySelector(
        ".progress-track"
    );


progressTrack.addEventListener(
    "click",
    (event) => {

        if(!music.duration){

            return;

        }


        const rect =
            progressTrack.getBoundingClientRect();


        const clickPosition =
            event.clientX - rect.left;


        const percentage =
            clickPosition / rect.width;


        music.currentTime =
            percentage * music.duration;

    }
);


// ==========================================
// SONG ENDED
// ==========================================

music.addEventListener(
    "ended",
    () => {

        stopSlideshow();

        clearInterval(typingTimer);

        playBtn.textContent =
            "▶";

        musicStatus.textContent =
            "Finished";


        setTimeout(() => {

            ending.classList.remove(
                "hidden"
            );

            createEndingParticles();

        },500);

    }
);


// ==========================================
// FLOATING PARTICLES
// ==========================================

function createParticles(){

    for(let i = 0; i < 30; i++){

        const particle =
            document.createElement("div");


        particle.className =
            "particle";


        particle.style.left =
            Math.random() * 100 + "%";


        particle.style.animationDuration =
            (6 + Math.random() * 8) + "s";


        particle.style.animationDelay =
            (-Math.random() * 10) + "s";


        particle.style.opacity =
            (0.2 + Math.random() * 0.6);


        const size =
            1 + Math.random() * 3;


        particle.style.width =
            size + "px";

        particle.style.height =
            size + "px";


        particles.appendChild(
            particle
        );

    }

}


// ==========================================
// ENDING PARTICLES
// ==========================================

function createEndingParticles(){

    for(let i = 0; i < 40; i++){

        const particle =
            document.createElement("div");


        particle.className =
            "particle";


        particle.style.left =
            Math.random() * 100 + "%";


        particle.style.animationDuration =
            (3 + Math.random() * 5) + "s";


        particle.style.animationDelay =
            "0s";


        particles.appendChild(
            particle
        );

    }

}


// ==========================================
// INITIALIZE
// ==========================================

createParticles();


// Set first photo

photoLayer.style.backgroundImage =
    `url("${photos[0]}")`;


// ==========================================
// KEYBOARD CONTROLS
// ==========================================

document.addEventListener(
    "keydown",
    (event) => {

        if(event.code === "Space"){

            event.preventDefault();


            if(music.paused){

                playMusic();

            }else{

                pauseMusic();

            }

        }


        if(event.code === "ArrowRight"){

            if(music.duration){

                music.currentTime =
                    Math.min(
                        music.currentTime + 5,
                        music.duration
                    );

            }

        }


        if(event.code === "ArrowLeft"){

            music.currentTime =
                Math.max(
                    music.currentTime - 5,
                    0
                );

        }

    }
);
