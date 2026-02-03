

import {
  addItem,
  setItem,
  deleteItem,
  listenData
} from "../../../src/services/firebaseService.js";

/* =======================
   GLOBAL
======================= */
let GV_ID = localStorage.getItem("TEACHER_ID");
const PATH = `teacher/${GV_ID}/giaoan`;
let currentId = null;
let gaContent = null;
let elMonhoc, elLop, elTen, elSoTiet, elNgay;


/* =======================
   RENDER
======================= */
export function rendergiaoan() {

  GV_ID = localStorage.getItem("TEACHER_ID");
  if (!GV_ID) {
    document.getElementById("main").innerHTML = "<p>Chưa đăng nhập giáo viên</p>";
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const main = document.getElementById("main");

  main.innerHTML = `
  <h2>CẬP NHẬT GIÁO ÁN</h2>

  <div style="max-width:900px">

    <label>Giáo viên</label>
    <input id="tengv" readonly style="width:100%;padding:6px">

    <label>Môn học</label>
    <select id="monhoc" style="width:100%;padding:6px"></select>

    <label>Lớp</label>
    <select id="lop" style="width:100%;padding:6px"></select>

    <label>Tên bài giảng</label>
    <input id="ten" style="width:100%;padding:6px">

    <label>Số tiết</label>
    <input id="sotiet" type="number" style="width:100%;padding:6px">

    <label>Ngày cập nhật</label>
    <input id="ngaycapnhat" type="date" value="${today}" readonly style="width:100%;padding:6px">

    <label>Ngày bắt đầu</label>
    <input id="ngaybatdau" type="date" style="width:100%;padding:6px">

    <hr>

    <div style="margin:10px 0">
      <button id="btnChooseFile">Ảnh</button>
      <button id="btnAudio">Audio</button>
      <button id="btnMp4">MP4</button>
      <button id="btnYoutube">Youtube</button>
      <button id="btnPdf">PDF</button>
      <button id="btnPptx">PPTX- FlipHTML5</button>
      <button id="btnPreview">Preview</button>
    </div>

    <input type="file" id="fileInput" hidden>

    <div id="gaContent"
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
      <button onclick="addNewGiaoAn()">Thêm</button>
	<button onclick="saveGiaoAn()">Lưu</button>

    </div>
  </div>

  <h3 style="margin-top:30px">Danh sách giáo án</h3>
  <div id="list"></div>
  `;

  initEditor();
  loadTenGV();
  loadDanhMuc("monhoc", "category/monhoc");
  loadDanhMuc("lop", "category/lop");
  loadList();
}

/* =======================
   EDITOR (Y HỆT BAITAP)
======================= */
function initEditor() {

gaContent = document.getElementById("gaContent");
  const fileInput = document.getElementById("fileInput");

  const btnChooseFile = document.getElementById("btnChooseFile");
  const btnAudio = document.getElementById("btnAudio");
  const btnMp4 = document.getElementById("btnMp4");
  const btnYoutube = document.getElementById("btnYoutube");
  const btnPdf = document.getElementById("btnPdf");
  const btnPptx = document.getElementById("btnPptx");
  const btnPreview = document.getElementById("btnPreview");

  function insertAtCursor(html) {
    gaContent.focus();
    document.execCommand("insertHTML", false, html);
  }

  // FILE LOCAL
  btnChooseFile.onclick = () => fileInput.click();
  fileInput.onchange = () => {
    const f = fileInput.files[0];
    if (!f) return;

    const r = new FileReader();
    r.onload = e => {
      let html = "";
      if (f.type.startsWith("image/"))
        html = `<img src="${e.target.result}" style="max-width:70%;display:block;margin:16px auto">`;
      else if (f.type.startsWith("audio/"))
        html = `<audio controls src="${e.target.result}" style="width:70%;display:block;margin:16px auto"></audio>`;
      else if (f.type.startsWith("video/"))
        html = `<video controls src="${e.target.result}" style="width:70%;display:block;margin:16px auto"></video>`;
      else return alert("Chỉ hỗ trợ ảnh / audio / video");

      insertAtCursor(html);
      fileInput.value = "";
    };
    r.readAsDataURL(f);
  };

  // AUDIO DRIVE
  btnAudio.onclick = () => {
    const url = prompt("Dán link MP3 Google Drive:");
    if (!url) return;
    const m = url.match(/\/d\/([^/]+)/) || url.match(/id=([^&]+)/);
    if (!m) return alert("Link không hợp lệ");

    insertAtCursor(`
      <iframe src="https://drive.google.com/file/d/${m[1]}/preview"
        style="width:360px;height:60px;display:block;margin:16px auto;border:none"
        allow="autoplay"></iframe>
    `);
  };

  // MP4 DRIVE
  btnMp4.onclick = () => {
    const url = prompt("Dán link MP4 Google Drive:");
    if (!url) return;
    const m = url.match(/\/d\/([^/]+)/) || url.match(/id=([^&]+)/);
    if (!m) return alert("Link không hợp lệ");

    insertAtCursor(`
      <iframe src="https://drive.google.com/file/d/${m[1]}/preview"
        style="width:70%;height:340px;display:block;margin:16px auto;border:none"
        allow="autoplay"></iframe>
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
  btnPdf.onclick = () => {
    const url = prompt("Dán link PDF Google Drive:");
    if (!url) return;
    const m = url.match(/\/d\/([^/]+)/);
    if (!m) return alert("Link sai");

    insertAtCursor(`
      <iframe src="https://drive.google.com/file/d/${m[1]}/preview"
        style="width:100%;height:600px;border:none;margin:16px 0"></iframe>
    `);
  };

  // PPTX
  btnPptx.onclick = () => {
    const url = prompt("Dán link PPTX / Google Slides / FlipHTML5, HTML");
    if (!url) return;

    let iframe = "";
    if (url.includes("docs.google.com/presentation")) {
      const m = url.match(/\/d\/([^/]+)/);
      if (!m) return alert("Link Slides sai");
      iframe = `<iframe src="https://docs.google.com/presentation/d/${m[1]}/embed"
        style="width:100%;height:600px;border:none"></iframe>`;
    } else if (url.includes("drive.google.com/file")) {
      const m = url.match(/\/d\/([^/]+)/);
      if (!m) return alert("Link Drive sai");
      const fileUrl = `https://drive.google.com/uc?id=${m[1]}&export=download`;
      iframe = `<iframe src="https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true"
        style="width:100%;height:600px;border:none"></iframe>`;
    } else {
  // Link ngoài (FlipHTML5, HTML, ...)
  insertAtCursor(url);
}


    insertAtCursor(iframe);
  };

  // PREVIEW
 btnPreview.onclick = () => {
  if (!gaContent.innerHTML.trim()) {
    alert("Chưa có nội dung");
    return;
  }

  localStorage.setItem("lesson_preview", JSON.stringify({
    name: document.getElementById("ten").value || "Bài giảng",
    meta: `Môn: ${document.getElementById("monhoc").value || ""} | Lớp: ${document.getElementById("lop").value || ""} | Ngày: ${document.getElementById("ngaycapnhat").value || ""}`,
    content: gaContent.innerHTML
  }));

  window.open("/preview.html", "_blank");
};

}
/* =======================
   DATA + CRUD + LIST
   (GIỮ NGUYÊN LOGIC CŨ)
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

function getData() {
  return {
    gvId: GV_ID || "",
    monhoc: document.getElementById("monhoc").value || "",
    lop: document.getElementById("lop").value || "",
    ten: document.getElementById("ten").value || "",
    sotiet: Number(document.getElementById("sotiet").value) || 0,
    ngaycapnhat: document.getElementById("ngaycapnhat").value || "",
    ngaybatdau: document.getElementById("ngaybatdau").value || "",
    noidung: gaContent?.innerHTML || ""
  };
}




window.addNewGiaoAn = () => {
  if (!ten.value.trim()) {
    toast("⚠️ Chưa nhập tên bài giảng", "#f57c00");
    return;
  }

  const id = Date.now();
  setItem(PATH, id, getData());
  resetGiaoAnForm();
  toast("✅ Đã thêm giáo án", "#2e7d32");
};



window.saveGiaoAn = () => {
  if (!currentId) {
    toast("⚠️ Chưa chọn giáo án để lưu", "#f57c00");
    return;
  }

const data = getData();
console.log("DATA TYPE:", typeof data, data);


  setItem(PATH, currentId, getData());
  toast("💾 Đã lưu giáo án", "#0277bd");
};




window.preview = () => {
  if (!gaContent.innerHTML.trim()) {
    alert("Chưa có nội dung");
    return;
  }

  localStorage.setItem("preview_html", gaContent.innerHTML);
  window.open("../../preview.html", "_blank");
};

function resetGiaoAnForm() {
  currentId = null;

  elMonhoc.value = "";
  elLop.value = "";
  elTen.value = "";
  elSoTiet.value = "";
  elNgay.value = "";
  gaContent.innerHTML = "";
}



window.deleteGiaoAnUI = id => {
  if (!confirm("Xóa giáo án?")) return;

  deleteItem(PATH, id);
  resetGiaoAnForm();
  toast("🗑️ Đã xóa giáo án", "#c62828");
};



window.loadList = function () {
  listenData(PATH, data => {
    const main = document.getElementById("list");

    if (!data) {
      main.innerHTML = "<i>Chưa có bài giảng</i>";
      return;
    }

    main.innerHTML = "";

    elMonhoc = document.getElementById("monhoc");
    elLop = document.getElementById("lop");
    elTen = document.getElementById("ten");
    elSoTiet = document.getElementById("sotiet");
    elNgay = document.getElementById("ngaybatdau");

    const group = {};

    for (const id in data) {
      const it = data[id];
      const mon = it.monhoc || "Chưa chọn môn";
      if (!group[mon]) group[mon] = [];
      group[mon].push({ id, ...it });
    }

    for (const mon in group) {
      const h = document.createElement("h3");
      h.textContent = `Môn học : ${mon}`;
      main.appendChild(h);

      const table = document.createElement("table");
      table.border = 1;
      table.width = "100%";

      table.innerHTML = `
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên bài giảng</th>
            <th>Số tiết</th>
            <th>Ngày</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;

      const tb = table.querySelector("tbody");

      group[mon].forEach((it, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${i + 1}</td>
          <td>${it.ten || ""}</td>
          <td>${it.sotiet || ""}</td>
          <td>${it.ngaycapnhat || ""}</td>
          <td><button class="btn-xoa">Xóa</button></td>
        `;

        tr.onclick = () => {
          currentId = it.id;
          elMonhoc.value = it.monhoc || "";
          elLop.value = it.lop || "";
          elTen.value = it.ten || "";
          elSoTiet.value = it.sotiet || "";
          elNgay.value = it.ngaybatdau || "";
          gaContent.innerHTML = it.noidung || "";
        };

        tr.querySelector(".btn-xoa").onclick = e => {
  e.stopPropagation();
  deleteGiaoAnUI(it.id);
};


        tb.appendChild(tr);
      });

      main.appendChild(table);
    }
  });
};


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
