import { listenData } from "../../../src/services/firebaseService.js";

const PATH = "teacher";

// =======================
// RENDER HỒ SƠ GIÁO VIÊN
// =======================
export function renderhosogv() {
  const main = document.getElementById("main");

  // 👉 SỬA CHỖ NÀY
  const GV_ID = localStorage.getItem("TEACHER_ID");

  if (!GV_ID) {
    main.innerHTML = "<p>Chưa đăng nhập giáo viên</p>";
    return;
  }

  main.innerHTML = `
    <h2>HỒ SƠ GIÁO VIÊN</h2>

    <p style="color:#555;font-style:italic;margin-bottom:15px">
      Nếu thông tin có sai sót, mời quý cô thầy liên hệ phòng chức năng để chỉnh sửa. Cám ơn.
    </p>

    <div style="margin-bottom:10px;color:#006;font-weight:bold">
      ID đăng nhập: ${GV_ID}
    </div>

    <div id="hosoBox" style="display:flex;gap:20px;flex-wrap:wrap">
      <div id="avatarBox"></div>
      <div id="infoBox" style="flex:1;min-width:300px"></div>
    </div>
  `;

  loadhoso(GV_ID);
}

// =======================
// LOAD DATA
// =======================
function loadhoso(id) {

  listenData(`${PATH}/${id}`, gv => {

    if (!gv) {
      document.getElementById("main").innerHTML =
        "<p>Không tìm thấy hồ sơ giáo viên</p>";
      return;
    }

    renderAvatar(gv);
    renderInfo(gv);
  });
}

// =======================
// AVATAR
// =======================
function renderAvatar(gv) {
  const box = document.getElementById("avatarBox");

  box.innerHTML = `
    <div style="text-align:center">

      <img src="${gv.avatar || ""}"
           style="width:160px;height:160px;
                  object-fit:cover;
                  border:1px solid #ccc">

      <div style="margin-top:8px;font-weight:bold">
        ${gv.hoten || ""}
      </div>

      <div style="color:#777;font-size:13px">
        ${gv.ngaysinh || ""}
      </div>

    </div>
  `;
}

// =======================
// INFO TABLE
// =======================
function renderInfo(gv) {
  const box = document.getElementById("infoBox");

  box.innerHTML = `
    <table border="1" cellpadding="8" width="100%"
           style="border-collapse:collapse">

      ${row("Giới tính", gv.gioitinh)}
      ${row("Ngày sinh", gv.ngaysinh)}
      ${row("Điện thoại", gv.dienthoai)}
      ${row("Học hàm", gv.hocham)}
      ${row("Chuyên môn", gv.chuyenmon)}
      ${row("Chức vụ", gv.chucvu)}
      ${row("Phòng ban", gv.phongban)}
      ${row("Gmail", gv.gmail)}
      ${row("Facebook", gv.facebook)}
      ${row("Zalo", gv.zalo)}

    </table>
  `;
}

function row(label, value) {
  return `
    <tr>
      <td style="width:180px;background:#f4f4f4">${label}</td>
      <td>${value || ""}</td>
    </tr>
  `;
}
