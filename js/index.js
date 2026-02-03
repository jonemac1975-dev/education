import { initAuth } from "./auth.js";
import { initAdmin } from "./admin.js";
import { initMenu } from "./menu.js";
import { initHeaderBg } from "./bg.js";
import { initMainBg } from "./bgMain.js";
import { getBaiGiang } from "./data.js";
import { loadInfo } from "./info.js"; // ✅ import module



window.addEventListener("DOMContentLoaded", async () => {
  initAuth();
  initAdmin();
  initMenu();
  initHeaderBg();
  initMainBg();


  loadInfo(); // ✅ load thông tin các ô dưới
});
