import { getBaiGiang, getBaiTap } from "./data.js";
import { renderTree } from "./render.js";
import { enableMainBg } from "./bgMain.js";
import { initTestEnglish } from "./testEnglishStudent.js";

const map = {
  mBaiGiang: { fn: getBaiGiang, mode: "baigiang" },
  mBaiTap:   { fn: getBaiTap,   mode: "baitap" }
};

export function initMenu() {
  const tree = document.getElementById("menuTree");

  // ===== BÀI GIẢNG / BÀI TẬP =====
  Object.keys(map).forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.onclick = async () => {
      enableMainBg();
      tree.classList.remove("hidden");

      const data = await map[id].fn();
      renderTree("menuTree", data, map[id].mode);
    };
  });

  // ===== TEST ENGLISH =====
  const btnTest = document.getElementById("mTestEnglish");
  if (btnTest) {
    btnTest.onclick = () => {
      initTestEnglish(); // ✅ chỉ mở LOGIN
    };
  }
}
