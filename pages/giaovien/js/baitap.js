import {
  addItem,
  setItem,
  deleteItem,
  listenData
} from "../../../src/services/firebaseService.js";

/* =======================
   GIÁO VIÊN ĐĂNG NHẬP
======================= */

let GV_ID =
  localStorage.getItem("GV_ID") ||
  localStorage.getItem("TEACHER_ID");

if (!GV_ID) {
  alert("Chưa đăng nhập giáo viên");
  location.href = "../../index.html";
}

window.GV_ID = GV_ID;
const PATH = `teacher/${GV_ID}/baitap`;
let currentId = null;

/* =======================
   RENDER
======================= */

export function renderbaitap() {
  const main = document.getElementById("main");
  const today = new Date().toISOString().slice(0, 10);

  main.innerHTML = `
  <h2>CẬP NHẬT BÀI TẬP</h2>

  <div style="max-width:900px">

    <label>Giáo viên</label>
    <input id="tengv" readonly style="width:100%;padding:6px">

    <label>Môn học</label>
    <select id="monhoc" style="width:100%;padding:6px"></select>

    <label>Lớp</label>
    <select id="lop" style="width:100%;padding:6px"></select>

    <label>Tên bài giảng</label>
    <input id="tenbaigiang" style="width:100%;padding:6px">

    <label>Tiêu đề bài tập</label>
    <input id="tieude" style="width:100%;padding:6px">

    <label>Ngày</label>
    <input id="ngaycapnhat" type="date" value="${today}" readonly
           style="width:100%;padding:6px">

    <hr>

    <div style="margin:10px 0">
      <button id="btnChooseFile">Ảnh</button>
      <button id="btnAudio">Audio</button>
      <button id="btnMp4">MP4</button>
      <button id="btnYoutube">Youtube</button>
      <button id="btnpdf">PDF</button>
	<button id="btnPptx">Powerpoint</button>
      <button id="btnPreview">Preview</button>
    </div>

    <input type="file" id="fileInput" hidden>

    <div id="btContent"
      contenteditable="true"
      style="
        min-height:300px;
        max-height:500px;
        overflow:auto;
        border:1px solid #999;
        padding:12px;
        background:#fff">
    </div>

    <div style="margin-top:10px">
      <button onclick="addNew()">Thêm</button>
      <button onclick="saveItem()">Lưu</button>
    </div>
  </div>

  <h3 style="margin-top:30px">Danh sách bài tập</h3>
  <div id="list"></div>
  `;

  initEditor();   // ⭐ CHẠY NGAY SAU KHI HTML ĐƯỢC TẠO
  loadTenGV();
  loadDanhMuc("monhoc", "category/monhoc");
  loadDanhMuc("lop", "category/lop");
  loadList();
}

/* =======================
   EDITOR
======================= */

function initEditor() {
  const btContent = document.getElementById("btContent");
  const fileInput = document.getElementById("fileInput");

  const btnChooseFile = document.getElementById("btnChooseFile");
  const btnAudio = document.getElementById("btnAudio");
  const btnMp4 = document.getElementById("btnMp4");
  const btnYoutube = document.getElementById("btnYoutube");
  const btnpdf = document.getElementById("btnpdf");
  const btnPptx = document.getElementById("btnPptx");


  const btnPreview = document.getElementById("btnPreview");

  function insertAtCursor(html) {
    btContent.focus();
    document.execCommand("insertHTML", false, html);
  }

  // FILE LOCAL
  btnChooseFile.onclick = () => fileInput.click();

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (!file) return;

    const r = new FileReader();
    r.onload = e => {
      let html = "";
      if (file.type.startsWith("image/"))
        html = `<img src="${e.target.result}" style="max-width:70%;display:block;margin:16px auto">`;
      else if (file.type.startsWith("audio/"))
        html = `<audio controls src="${e.target.result}" style="width:70%;display:block;margin:16px auto"></audio>`;
      else if (file.type.startsWith("video/"))
        html = `<video controls src="${e.target.result}" style="width:70%;display:block;margin:16px auto"></video>`;
      else return alert("Chỉ hỗ trợ ảnh / audio / video");

      insertAtCursor(html);
      fileInput.value = "";
    };
    r.readAsDataURL(file);
  };

  // AUDIO LINK
  btnAudio.onclick = () => {
  const url = prompt("Dán link MP3 Google Drive:");
  if (!url) return;

  // bắt FILE_ID từ link Drive
  const m = url.match(/\/d\/([^/]+)/) || url.match(/id=([^&]+)/);
  if (!m) {
    alert("Link Google Drive không hợp lệ");
    return;
  }

  const fileId = m[1];

  insertAtCursor(`
    <iframe
      src="https://drive.google.com/file/d/${fileId}/preview"
      style="
        width:360px;
        max-width:100%;
        height:60px;
        display:block;
        margin:16px auto;
        border:none;
      "
      allow="autoplay">
    </iframe>
  `);
};


  // MP4 LINK
  btnMp4.onclick = () => {
  const url = prompt("Dán link MP4 Google Drive:");
  if (!url) return;

  // BẮT FILE_ID
  let fileId = "";
  const m1 = url.match(/\/d\/([^/]+)/);
  if (m1) fileId = m1[1];

  const m2 = url.match(/id=([^&]+)/);
  if (!fileId && m2) fileId = m2[1];

  if (!fileId) {
    alert("Link Google Drive không hợp lệ");
    return;
  }

  insertAtCursor(`
    <iframe
      src="https://drive.google.com/file/d/${fileId}/preview"
      style="
        width:70%;
        max-width:600px;
        height:340px;
        display:block;
        margin:16px auto;
        border:none;
        border-radius:8px;
      "
      allow="autoplay">
    </iframe>
    <br>
  `);
};


  // YOUTUBE
  btnYoutube.onclick = () => {
    const url = prompt("Dán link YouTube:");
    if (!url) return;

    let id = "";
    if (url.includes("v=")) id = url.split("v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) id = url.split("/").pop();
    if (!id) return alert("Link sai");

    insertAtCursor(`
      <iframe src="https://www.youtube.com/embed/${id}"
        style="width:70%;height:360px;display:block;margin:16px auto"
        allowfullscreen></iframe>
    `);
  };

  // PDF
 btnpdf.onclick = () => {
  const url = prompt("Dán link PDF / PPT Google Drive:");
  if (!url) return;

  // bắt FILE_ID
  let fileId = "";
  const m1 = url.match(/\/d\/([^/]+)/);
  if (m1) fileId = m1[1];

  const m2 = url.match(/id=([^&]+)/);
  if (!fileId && m2) fileId = m2[1];

  if (!fileId) {
    alert("Link Google Drive không hợp lệ");
    return;
  }

  insertAtCursor(`
    <div style="
      margin:16px 0;
      padding:12px;
      border:1px solid #ddd;
      border-radius:8px;
      background:#fafafa;
    ">
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:8px;
        font-weight:600;
      ">
        <span>📄 Tài liệu</span>
        <a
          href="https://drive.google.com/file/d/${fileId}/view"
          target="_blank"
          style="font-size:13px;color:#1976d2;text-decoration:none">
          Mở toàn màn hình
        </a>
      </div>

      <iframe
        src="https://drive.google.com/file/d/${fileId}/preview"
        style="
          width:100%;
          height:600px;
          border:none;
          border-radius:6px;
        "
        loading="lazy">
      </iframe>
    </div>
    <br>
  `);
};


btnPptx.onclick = () => {
  const url = prompt("Dán link PPTX / Google Slides:");
  if (!url) return;

  let iframe = "";

  // ===== GOOGLE SLIDES =====
  if (url.includes("docs.google.com/presentation")) {
    const m = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!m) {
      alert("❌ Link Google Slides không hợp lệ");
      return;
    }

    const id = m[1];

    iframe = `
      <iframe
        src="https://docs.google.com/presentation/d/${id}/embed"
        style="width:100%; height:600px; border:none; border-radius:8px;"
        allowfullscreen>
      </iframe><br>
    `;
  }

  // ===== PPTX TRÊN GOOGLE DRIVE =====
  else if (url.includes("drive.google.com/file")) {
    const m = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!m) {
      alert("❌ Link Google Drive không hợp lệ");
      return;
    }

    const id = m[1];
    const fileUrl = `https://drive.google.com/uc?id=${id}&export=download`;

    iframe = `
      <iframe
        src="https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true"
        style="width:100%; height:600px; border:none; border-radius:8px;">
      </iframe><br>
    `;
  }

  else {
    alert("❌ Không phải link Google Slides hoặc PPTX Google Drive");
    return;
  }

  insertAtCursor(iframe);
};



  // PREVIEW
btnPreview.onclick = () => {
  if (!btContent.innerHTML.trim()) {
    alert("Chưa có nội dung");
    return;
  }

  localStorage.setItem("lesson_preview", JSON.stringify({
    name: tieude.value || "Bài tập",
    meta: `Môn: ${monhoc.value || ""} | Lớp: ${lop.value || ""} | Ngày: ${ngaycapnhat.value || ""}`,
    content: btContent.innerHTML
  }));

  window.open("/preview.html", "_blank");
};

}

/* =======================
   LOAD DATA
======================= */

function loadTenGV() {
  listenData(`teacher/${GV_ID}`, d => {
    document.getElementById("tengv").value = d?.hoten || GV_ID;
  });
}

function loadDanhMuc(id, path) {
  listenData(path, data => {
    const sel = document.getElementById(id);
    sel.innerHTML = `<option value="">-- chọn --</option>`;
    if (!data) return;
    for (const k in data) {
      const o = document.createElement("option");
      o.value = data[k].name;
      o.textContent = data[k].name;
      sel.appendChild(o);
    }
  });
}

/* =======================
   FORM
======================= */

function getData() {
  return {
    monhoc: monhoc.value,
    lop: lop.value,
    tenbaigiang: tenbaigiang.value,
    tieude: tieude.value,
    ngaycapnhat: ngaycapnhat.value,
    noidung: btContent.innerHTML
  };
}

function resetForm() {
  currentId = null;
  tenbaigiang.value = "";
  tieude.value = "";
  btContent.innerHTML = "";
}

/* =======================
   CRUD
======================= */

window.addNew = () => {
  if (!tieude.value.trim()) {
    toast("⚠️ Chưa nhập tiêu đề bài tập", "#f57c00");
    return;
  }

  setItem(PATH, Date.now(), getData());
  resetForm();
  toast("✅ Đã thêm bài tập", "#2e7d32");
};


window.saveItem = () => {
  if (!currentId) {
    toast("⚠️ Chưa chọn bài tập để lưu", "#f57c00");
    return;
  }

  setItem(PATH, currentId, getData());
  toast("💾 Đã lưu bài tập", "#0277bd");
};


window.deleteItemUI = id => {
  if (!confirm("Xóa bài tập?")) return;

  deleteItem(PATH, id);
  resetForm();
  toast("🗑️ Đã xóa bài tập", "#c62828");
};


/* =======================
   LIST
======================= */

function loadList() {
  listenData(PATH, data => {
    const box = document.getElementById("list");
    box.innerHTML = "";
    if (!data) return;

    const table = document.createElement("table");
    table.border = 1;
    table.width = "100%";
    table.innerHTML = `
      <tr>
        <th>STT</th>
        <th>Bài giảng</th>
        <th>Tiêu đề</th>
        <th>Ngày</th>
        <th>Xóa</th>
      </tr>
    `;

    let i = 1;
    for (const id in data) {
      const it = data[id];
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i++}</td>
        <td>${it.tenbaigiang || ""}</td>
        <td>${it.tieude || ""}</td>
        <td>${it.ngaycapnhat || ""}</td>
        <td><button>Xóa</button></td>
      `;
      tr.onclick = () => {
        currentId = id;
        monhoc.value = it.monhoc || "";
        lop.value = it.lop || "";
        tenbaigiang.value = it.tenbaigiang || "";
        tieude.value = it.tieude || "";
        btContent.innerHTML = it.noidung || "";
      };
      tr.querySelector("button").onclick = e => {
        e.stopPropagation();
        deleteItemUI(id);
      };
      table.appendChild(tr);
    }
    box.appendChild(table);
  });
}

function toast(msg, bg = "#333", time = 2500) {
  let t = document.createElement("div");
  t.textContent = msg;

  Object.assign(t.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    background: bg,
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,.3)",
    zIndex: 9999,
    opacity: 0,
    transition: "opacity .3s"
  });

  document.body.appendChild(t);
  requestAnimationFrame(() => t.style.opacity = 1);

  setTimeout(() => {
    t.style.opacity = 0;
    setTimeout(() => t.remove(), 300);
  }, time);
}
