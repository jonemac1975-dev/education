import { FirebaseService } from "../src/services/firebaseService.js";

let images = [];
let index = 0;
let bgEl = null;
let timer = null;
let enabled = false;

/* ================= LOAD DATA ================= */
async function loadMainBg(){
  const data = await FirebaseService.get("content/hinh/hinhmain");
  if(!data) return;

  images = Object.values(data)
    .map(item => item.image)
    .filter(Boolean);

  if(images.length === 0) return;

  bgEl = document.getElementById("mainBg");
  if(!bgEl) return;

  index = 0;
  bgEl.style.backgroundImage = `url(${images[0]})`;
}

/* ================= SLIDE ================= */
function startSlide(){
  stopSlide();               // ❗ đảm bảo không bị chồng timer
  enabled = true;

  if(!bgEl || images.length === 0) return;

  bgEl.style.display = "block";
  bgEl.style.opacity = 1;

  timer = setInterval(()=>{
    if(!enabled) return;

    bgEl.style.opacity = 0;
    setTimeout(()=>{
      index = (index + 1) % images.length;
      bgEl.style.backgroundImage = `url(${images[index]})`;
      bgEl.style.opacity = 1;
    }, 600);
  }, 10000);
}

function stopSlide(){
  enabled = false;
  if(timer){
    clearInterval(timer);
    timer = null;
  }
}

/* ================= API ================= */

// gọi 1 lần khi load trang
export async function initMainBg(){
  await loadMainBg();
  startSlide();
}

// gọi khi load preview / exam
export function disableMainBg(){
  stopSlide();
  if(bgEl){
    bgEl.style.display = "none";
  }
}

// gọi khi quay lại menu / trang thường
export function enableMainBg(){
  if(!bgEl) return;
  startSlide();
}
