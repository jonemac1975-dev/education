// =========================
// IMPORT TAB
// =========================
import { rendermonhoc } from "./tabmonhoc.js";
import { renderhocham } from "./tabhocham.js";
import { renderchuyenmon } from "./tabchuyenmon.js";
import { renderchucvu } from "./tabchucvu.js";
import { renderphongban } from "./tabphongban.js";
import { renderkythi } from "./tabkythi.js";
import { renderlop } from "./tablop.js";
import { renderkhoahoc } from "./tabkhoahoc.js";
import { rendertheloai } from "./tabtheloai.js";
import { rendergiaovien } from "./tabgiaovien.js";
import { rendersinhvien } from "./tabsinhvien.js";

import { rendersach } from "./tabsach.js";
import { rendertailieu } from "./tabtailieu.js";
import { renderthoisu } from "./tabthoisu.js";
import { renderhoatdong } from "./tabhoatdong.js";
import { renderbaiviet } from "./tabbaiviet.js";
import { renderclip } from "./tabclip.js";
import { renderhinhhead } from "./tabhinhhead.js";
import { renderhinhmain } from "./tabhinhmain.js";
import { rendertabdethi } from "./tabdethi.js";


// =========================
// MENU DATA
// =========================
const menuData = [
  {
    title: "Danh mục",
    items: ["Môn học", "Học hàm", "Chuyên môn", "Chức vụ", "Phòng ban", "Kỳ thi", "Lớp","Khóa học","Thể loại sách - Tài liệu"]
  },
  {
    title: "Giáo viên",
    items: ["Hồ sơ giáo viên"]
  },
  {
    title: "Sinh viên",
    items: ["Hồ sơ sinh viên"]
  },
  {
    title: "Thư viện",
    items: ["Sách", "Tài liệu tham khảo"]
  },
  {
    title: "Tin tức – Sự kiện",
    items: ["Tin thời sự", "Hoạt động", "Bài viết", "Clip + Youtube"]
  },
  {
    title: "Hình nền",
    items: ["Hình nền Head", "Hình nền Main + Nhạc"]
  }
];

// =========================
// RENDER MENU
// =========================
const menu = document.getElementById("menu");

menuData.forEach(group => {
  const groupDiv = document.createElement("div");
  groupDiv.className = "menu-group";

  const title = document.createElement("div");
  title.className = "menu-title";
  title.textContent = group.title;

  const itemsDiv = document.createElement("div");
  itemsDiv.className = "menu-items";

  group.items.forEach(item => {
    const div = document.createElement("div");
    div.textContent = item;
    div.onclick = () => loadTab(item);
    itemsDiv.appendChild(div);
  });

  title.onclick = () => {
    itemsDiv.style.display =
      itemsDiv.style.display === "block" ? "none" : "block";
  };

  groupDiv.appendChild(title);
  groupDiv.appendChild(itemsDiv);
  menu.appendChild(groupDiv);
});

// =========================
// LOAD TAB CONTENT
// =========================
function loadTab(name) {
 // =========================
// TAB MÔN HỌC
// =========================
  if (name === "Môn học") {
    rendermonhoc();
    return;
  }

// =========================
// TAB HỌC HÀM
// =========================
  if (name === "Học hàm") {
    renderhocham();
    return;
  }
// =========================
// TA CHUYÊN MÔN
// =========================
  if (name === "Chuyên môn") {
    renderchuyenmon();
    return;
  }
// =========================
// TAB CHỨC VỤ
// =========================
  if (name === "Chức vụ") {
    renderchucvu();
    return;
  }
// =========================
// TAB PHÒNG BAN
// =========================
  if (name === "Phòng ban") {
    renderphongban();
    return;
  }
// =========================
// TAB KỲ THI
// =========================
  if (name === "Kỳ thi") {
    renderkythi();
    return;
  }

// =========================
// TAB LỚP
// =========================
  if (name === "Lớp") {
  renderlop();
  return;
}

// =========================
// TAB KHÓA HỌC
// =========================
  if (name === "Khóa học") {
  renderkhoahoc();
  return;
}

// =========================
// TAB THỂ LOẠI SÁCH
// =========================
  if (name === "Thể loại sách - Tài liệu") {
    rendertheloai();
    return;
  }
// =========================
// TAB Giáo viên
// =========================
if (name === "Hồ sơ giáo viên") {
  rendergiaovien();
  return;
}

// =========================
// TAB Sinh viên
// =========================
if (name === "Hồ sơ sinh viên") {
  rendersinhvien();
  return;
}

// =========================
// TAB Đề thi
// =========================
if (name === "Danh sách đề thi") {
  rendertabdethi();
  return;
}
// =========================
// TAB THƯ VIỆN
// =========================
  if (name === "Sách") {
    rendersach();
    return;
  }

 if (name === "Tài liệu tham khảo") {
    rendertailieu();
    return;
  }


// =========================
// TAB THOI SỰ
// =========================
  if (name === "Tin thời sự") {
    renderthoisu();
    return;
  }

if (name === "Hoạt động") {
    renderhoatdong();
    return;
  }

if (name === "Bài viết") {
    renderbaiviet();
    return;
  }

if (name === "Clip + Youtube") {
    renderclip();
    return;
  }

// =========================
// TAB HÌNH HEAD + MAIN
// =========================
  if (name === "Hình nền Head") {
    renderhinhhead();
    return;
  }

if (name === "Hình nền Main + Nhạc") {
    renderhinhmain();
    return;
  }



  // TAB CHƯA LÀM → FORM DEMO
  const main = document.getElementById("main");
  main.innerHTML = `
    <h2>${name}</h2>

    <div style="margin-top:10px">
      <label>Tên:</label>
      <input type="text" style="padding:6px;width:300px">
    </div>

    <div style="margin-top:10px">
      <button>Thêm</button>
      <button>Lưu</button>
      <button>Xóa</button>
    </div>

    <table border="1" cellpadding="6" cellspacing="0" style="margin-top:15px;width:100%">
      <tr>
        <th>STT</th>
        <th>Tên</th>
      </tr>
    </table>
  `;
}


// =========================
// TOP BUTTON (FIX MODULE SCOPE)
// =========================
window.goHome = function () {
  sessionStorage.removeItem("admin");
  window.location.href = "../../index.html";
};

window.goChange = function () {
  window.location.href = "changepass.html";
};
