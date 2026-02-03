import { ContentService } from "../src/services/contentService.js";

// ===== HEADER BG =====
export async function initHeaderBg() {
  const header = document.querySelector(".header-bg");
  if (!header) return;

  const list = await ContentService.getImages("hinhhead");
  if (!list.length) return;

  let i = 0;
  header.style.backgroundImage = `url(${list[0].image})`;

  setInterval(() => {
    i = (i + 1) % list.length;
    header.style.backgroundImage = `url(${list[i].image})`;
  }, 10000);
}

// ===== MAIN BG =====
export async function initMainBg() {
  const main = document.querySelector(".main-bg");
  if (!main) return;

  const list = await ContentService.getImages("hinhmain");
  if (!list.length) return;

  let i = 0;
  main.style.backgroundImage = `url(${list[0].image})`;

  setInterval(() => {
    i = (i + 1) % list.length;
    main.style.backgroundImage = `url(${list[i].image})`;
  }, 10000);
}
