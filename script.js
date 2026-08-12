// =====================================================
// PASTE ALL YOUR LYRICS ONCE HERE.
// Keep your original line breaks. Do NOT paste timestamps.
// =====================================================
const lyricsText = `
Gulaabi aankhen jo teri dekhi
Sharaabi yeh dil ho gaya
Music..
Dil mein mere khwaab tere
taswere jaise ho deewaar pe
Tujhpe fida main kyoon hua
Aata hai gussa mujhe pyaar pe
Main lut gaya maanke dil ka kaha
Main kahin tha na raha
Kya kahoon main dilruba
Pura yeh jaadu teri aankhon ka
Yeh mera kaatil ho gaya
Gulaabi aankhen jo teri dekhi
Sharaabi yeh dil ho gaya
`;

// Your timing blocks:
const TIMING_OFFSET = -0.30;
const timingBlocks = [
  [0,4],[5,9],[10,18],[19,23],[24,27],[28,32],[33,37],
  [38,41],[42,45],[46,51],[52,55],[56,60],[60,67]
];

const music=document.getElementById("music");
const lyricsEl=document.getElementById("lyrics");
const startScreen=document.getElementById("startScreen");
const begin=document.getElementById("begin");
const playBtn=document.getElementById("playBtn");
const muteBtn=document.getElementById("muteBtn");
const photoLayer=document.getElementById("photoLayer");
const progress=document.getElementById("progress");
const currentEl=document.getElementById("current");
const durationEl=document.getElementById("duration");
const ending=document.getElementById("ending");
const track=document.getElementById("track");

const rawLines=lyricsText.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);

// 13 timing blocks. If your pasted lyrics have more lines,
// they are automatically grouped into these 13 blocks.
function makeBlocks(lines,blocks){
  if(!lines.length)return [];
  const out=[];
  const count=Math.min(lines.length,blocks.length);
  for(let i=0;i<count;i++){
    const a=Math.floor(i*lines.length/count);
    const b=Math.max(a+1,Math.floor((i+1)*lines.length/count));
    out.push({
      start:blocks[i][0]+(i===0?0:TIMING_OFFSET),
      end:blocks[i][1],
      text:lines.slice(a,b).join("\n")
    });
  }
  return out;
}
const lyricBlocks=makeBlocks(rawLines,timingBlocks);

// 20 photos: random order, then all 20 again in a new order
const photos=Array.from({length:20},(_,i)=>`./photos/${String(i+1).padStart(2,"0")}.jpg`);
photos.forEach(src=>{const img=new Image();img.src=src;});
let queue=[],photoPos=0,photoTimer=null;
function shuffle(){queue=[...photos];for(let i=queue.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[queue[i],queue[j]]=[queue[j],queue[i]]}photoPos=0}
function showPhoto(src){photoLayer.style.opacity="0";photoLayer.style.transform="scale(1.03)";setTimeout(()=>{photoLayer.style.backgroundImage=`url("${src}")`;photoLayer.style.opacity="1";photoLayer.style.transform="scale(1.08)"},350)}
function startPhotos(){clearInterval(photoTimer);shuffle();showPhoto(queue[photoPos++]);photoTimer=setInterval(()=>{if(photoPos>=queue.length)shuffle();showPhoto(queue[photoPos++])},3200)}

let active=-1,typingTimer=null;
function typeWriter(text){
  clearInterval(typingTimer);
  lyricsEl.style.opacity="0";lyricsEl.style.transform="translateX(-14px)";
  setTimeout(()=>{
    lyricsEl.textContent="";lyricsEl.style.opacity="1";lyricsEl.style.transform="translateX(0)";
    let i=0;typingTimer=setInterval(()=>{lyricsEl.textContent+=text.charAt(i++);if(i>=text.length)clearInterval(typingTimer)},42);
  },170);
}
function updateLyrics(){
  let found=-1;
  for(let i=0;i<lyricBlocks.length;i++){
    if(music.currentTime>=lyricBlocks[i].start&&music.currentTime<lyricBlocks[i].end){found=i;break}
  }
  if(found!==-1&&found!==active){active=found;typeWriter(lyricBlocks[found].text)}
}

function fmt(s){return Number.isFinite(s)?`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`:"0:00"}
async function playMusic(){try{await music.play();playBtn.textContent="❚❚";startPhotos()}catch(e){console.error(e)}}
function pauseMusic(){music.pause();playBtn.textContent="▶";clearInterval(photoTimer)}

begin.onclick=async()=>{startScreen.classList.add("hide");await playMusic()};
playBtn.onclick=()=>music.paused?playMusic():pauseMusic();
muteBtn.onclick=()=>{music.muted=!music.muted;muteBtn.textContent=music.muted?"🔇":"🔊"};

music.onloadedmetadata=()=>durationEl.textContent=fmt(music.duration);
music.ontimeupdate=()=>{
  updateLyrics();currentEl.textContent=fmt(music.currentTime);
  if(music.duration)progress.style.width=`${music.currentTime/music.duration*100}%`;
};
track.onclick=e=>{if(music.duration){const r=track.getBoundingClientRect();music.currentTime=((e.clientX-r.left)/r.width)*music.duration}};
music.onended=()=>{clearInterval(photoTimer);clearInterval(typingTimer);ending.classList.add("show")};

const particles=document.getElementById("particles");
for(let i=0;i<35;i++){const p=document.createElement("div");p.className="particle";p.style.left=`${Math.random()*100}%`;p.style.animationDuration=`${5+Math.random()*8}s`;p.style.animationDelay=`${-Math.random()*10}s`;const s=2+Math.random()*3;p.style.width=`${s}px`;p.style.height=`${s}px`;particles.appendChild(p)}
