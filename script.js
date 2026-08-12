// GULAABI MEMORIES — FIXED TIMESTAMP VERSION

// Lyrics are already included below. You do NOT need to paste them again.
const lyricBlocks = [
  { start: 0, end: 4, text: "Gulaabi aankhen jo teri dekhi" },
  { start: 5, end: 9, text: "Sharaabi yeh dil ho gaya" },
  { start: 10, end: 18, text: "" }, // music
  { start: 19, end: 23, text: "Dil mein mere khwaab tere" },
  { start: 24, end: 27, text: "taswere jaise ho deewaar pe" },
  { start: 28, end: 32, text: "Tujhpe fida main kyoon hua" },
  { start: 33, end: 37, text: "Aata hai gussa mujhe pyaar pe" },
  { start: 38, end: 41, text: "Main lut gaya maanke dil ka kaha" },
  { start: 42, end: 45, text: "Main kahin tha na raha" },
  { start: 46, end: 51, text: "Kya kahoon main dilruba" },
  { start: 52, end: 55, text: "Pura yeh jaadu teri aankhon ka" },
  { start: 56, end: 60, text: "Yeh mera kaatil ho gaya" },
  { start: 60, end: 67, text: "Gulaabi aankhen jo teri dekhi\nSharaabi yeh dil ho gaya" }
];

const music = document.getElementById("music");
const lyricsEl = document.getElementById("lyrics");
const startScreen = document.getElementById("startScreen");
const begin = document.getElementById("begin");
const playBtn = document.getElementById("playBtn");
const muteBtn = document.getElementById("muteBtn");
const photoLayer = document.getElementById("photoLayer");
const progress = document.getElementById("progress");
const currentEl = document.getElementById("current");
const durationEl = document.getElementById("duration");
const ending = document.getElementById("ending");
const track = document.getElementById("track");

const photos = Array.from({length:20}, (_,i) =>
  `./photos/${String(i+1).padStart(2,"0")}.jpg`
);

photos.forEach(src => {
  const img = new Image();
  img.src = src;
});

let photoQueue = [];
let photoPos = 0;
let photoTimer = null;

function shufflePhotos() {
  photoQueue = [...photos];
  for (let i = photoQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [photoQueue[i], photoQueue[j]] = [photoQueue[j], photoQueue[i]];
  }
  photoPos = 0;
}

function showPhoto(src) {
  photoLayer.style.opacity = "0";
  photoLayer.style.transform = "scale(1.03)";
  setTimeout(() => {
    photoLayer.style.backgroundImage = `url("${src}")`;
    photoLayer.style.opacity = "1";
    photoLayer.style.transform = "scale(1.08)";
  }, 350);
}

function startPhotos() {
  clearInterval(photoTimer);
  shufflePhotos();
  showPhoto(photoQueue[photoPos++]);

  photoTimer = setInterval(() => {
    if (photoPos >= photoQueue.length) shufflePhotos();
    showPhoto(photoQueue[photoPos++]);
  }, 3200);
}

let activeBlock = -1;
let typingTimer = null;

function typeWriter(text) {
  clearInterval(typingTimer);

  lyricsEl.style.opacity = "0";
  lyricsEl.style.transform = "translateX(-14px)";

  setTimeout(() => {
    lyricsEl.textContent = "";
    lyricsEl.style.opacity = "1";
    lyricsEl.style.transform = "translateX(0)";

    if (!text) return;

    let i = 0;
    typingTimer = setInterval(() => {
      lyricsEl.textContent += text.charAt(i++);
      if (i >= text.length) clearInterval(typingTimer);
    }, 42);
  }, 170);
}

function updateLyrics() {
  let found = -1;

  for (let i = 0; i < lyricBlocks.length; i++) {
    if (
      music.currentTime >= lyricBlocks[i].start &&
      music.currentTime < lyricBlocks[i].end
    ) {
      found = i;
      break;
    }
  }

  if (found !== -1 && found !== activeBlock) {
    activeBlock = found;
    typeWriter(lyricBlocks[found].text);
  }
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2,"0")}`;
}

async function playMusic() {
  try {
    await music.play();
    playBtn.textContent = "❚❚";
    startPhotos();
  } catch (error) {
    console.error("Playback error:", error);
  }
}

function pauseMusic() {
  music.pause();
  playBtn.textContent = "▶";
  clearInterval(photoTimer);
}

begin.onclick = async () => {
  startScreen.classList.add("hide");
  await playMusic();
};

playBtn.onclick = () => {
  music.paused ? playMusic() : pauseMusic();
};

muteBtn.onclick = () => {
  music.muted = !music.muted;
  muteBtn.textContent = music.muted ? "🔇" : "🔊";
};

music.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(music.duration);
});

music.addEventListener("timeupdate", () => {
  updateLyrics();
  currentEl.textContent = formatTime(music.currentTime);

  if (music.duration) {
    progress.style.width =
      `${(music.currentTime / music.duration) * 100}%`;
  }
});

track.addEventListener("click", event => {
  if (!music.duration) return;

  const rect = track.getBoundingClientRect();
  music.currentTime =
    ((event.clientX - rect.left) / rect.width) * music.duration;
});

music.addEventListener("ended", () => {
  clearInterval(photoTimer);
  clearInterval(typingTimer);
  ending.classList.add("show");
});

// Floating particles
const particles = document.getElementById("particles");

for (let i = 0; i < 35; i++) {
  const p = document.createElement("div");
  p.className = "particle";
  p.style.left = `${Math.random() * 100}%`;
  p.style.animationDuration = `${5 + Math.random() * 8}s`;
  p.style.animationDelay = `${-Math.random() * 10}s`;

  const size = 2 + Math.random() * 3;
  p.style.width = `${size}px`;
  p.style.height = `${size}px`;

  particles.appendChild(p);
}
