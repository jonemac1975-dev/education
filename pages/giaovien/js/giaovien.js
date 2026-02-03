import { ContentService } from "../../../src/services/contentService.js";

import { renderhosogv } from "./hosogv.js";
import { rendergiaoan } from "./giaoan.js";
import { renderbaitap } from "./baitap.js";
import { renderTestEnglish } from "./testenglish.js";

// ========================
// START APP
// ========================
async function start() {

  const GV_ID = localStorage.getItem("TEACHER_ID");

  if (!GV_ID) {
    alert("Chưa đăng nhập giáo viên");
    location.href = "../../index.html";
    return;
  }

  // kiểm tra giáo viên có tồn tại
  const gv = await ContentService.getTeacher(GV_ID);
  if (!gv) {
    alert("Tài khoản giáo viên không tồn tại");
    localStorage.removeItem("TEACHER_ID");
    location.href = "../../index.html";
    return;
  }

  // gán global dùng chung
  window.GV_ID = GV_ID;
  window.GV_PROFILE = gv;

  console.log("GV_ID:", GV_ID);

  // =======================
  // MENU
  // =======================
  const menu = document.getElementById("menu");
  menu.innerHTML = `
    <button data-tab="hoso">Hồ sơ</button>
    <button data-tab="giaoan">Giáo án</button>
    <button data-tab="baitap">Bài tập</button>
    <button data-tab="testenglish">Test English</button>
    
  `;

  // =======================
  // CLICK MENU
  // =======================
  menu.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      loadTab(btn.dataset.tab);
    });
  });

  // =======================
  // LOAD TAB
  // =======================
  function loadTab(tab) {

    if (!window.GV_ID) {
      alert("Chưa đăng nhập giáo viên");
      return;
    }

    switch (tab) {

      case "hoso":
        renderhosogv();
        break;

      case "giaoan":
        rendergiaoan();
        break;

      case "baitap":
        renderbaitap();
        break;

      case "testenglish":
        renderTestEnglish();
        break;
      

      default:
        document.getElementById("main").innerHTML =
          "<p>Tab không tồn tại</p>";
    }
  }

  // =======================
  // LOAD TAB MẶC ĐỊNH
  // =======================
  loadTab("hoso");

  // =======================
  // TOP BUTTON
  // =======================
  window.logout = function () {
    localStorage.removeItem("TEACHER_ID");
    location.href = "../../index.html";
  };

  window.goChangePass = function () {
    location.href = "changepassgv.html";
  };
}

// chạy app
start();
