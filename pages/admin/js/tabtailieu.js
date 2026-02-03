import {
  updateItem,
setItem,
  deleteItem,
  listenData
} from "../../../src/services/firebaseService.js";

// =======================
// CONFIG
// =======================
const PATH = "content/tailieu";
const PATH_THELOAI = "category/theloai";

let currentId = null;
let coverBase64 = "";

// =======================
// RENDER
// =======================
export function rendertailieu() {
  currentId = null;
  coverBase64 = "";

  const main = document.getElementById("main");

  main.innerHTML = `
    <h2>Thư viện Tài liệu</h2>

    <div style="display:flex;gap:20px;flex-wrap:wrap">

      <!-- ẢNH BÌA -->
      <div>
        <img id="coverPreview"
             style="width:120px;height:160px;border:1px solid #ccc;object-fit:cover">
        <br><br>
        <input type="file" id="coverInput" accept="image/*">
        <br>
        <button id="btnClearCover">Xóa ảnh</button>
      </div>

      <!-- FORM -->
      <div style="flex:1;min-width:300px">
        <label>Thể loại</label><br>
        <select id="theloai" style="width:100%;padding:6px">
          <option value="">-- Chọn thể loại --</option>
        </select>

        <br><br>
        <label>Tên sách</label><br>
        <input id="ten" style="width:100%;padding:6px">

        <br><br>
        <label>Link GG</label><br>
        <input id="link" style="width:100%;padding:6px">
      </div>
    </div>

    <div style="margin-top:10px">
      <button id="btnAdd">Thêm</button>
      <button id="btnSave">Lưu</button>
      <button id="btnDelete">Xóa</button>
    </div>

    <h3 style="margin-top:20px">Danh sách sách</h3>
    <table border="1" width="100%">
      <thead>
        <tr>
          <th>STT</th>
          <th>Ảnh</th>
          <th>Tên</th>
          <th>Thể loại</th>
        </tr>
      </thead>
      <tbody id="list"></tbody>
    </table>
  `;

  // EVENT
  document.getElementById("coverInput").onchange = handleImage;
  document.getElementById("btnClearCover").onclick = clearCover;
  document.getElementById("btnAdd").onclick = addNew;
  document.getElementById("btnSave").onclick = saveItem;
  document.getElementById("btnDelete").onclick = deleteItemUI;

  loadTheLoai();
  loadList();
}

// =======================
// LOAD THỂ LOẠI
// =======================
function loadTheLoai() {
  listenData(PATH_THELOAI, data => {
    const select = document.getElementById("theloai");
    select.innerHTML = `<option value="">-- Chọn thể loại --</option>`;

    for (const id in data) {
      const opt = document.createElement("option");
      opt.value = data[id].name;
      opt.textContent = data[id].name;
      select.appendChild(opt);
    }
  });
}

// =======================
// IMAGE
// =======================
function handleImage(e) {
  const file = e.target.files[0];
  if (!file) return;

  const r = new FileReader();
  r.onload = () => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      const max = 400;
      let w = img.width, h = img.height;

      if (w > max) { h *= max / w; w = max; }

      c.width = w;
      c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);

      coverBase64 = c.toDataURL("image/jpeg", 0.7);
      document.getElementById("coverPreview").src = coverBase64;
    };
    img.src = r.result;
  };
  r.readAsDataURL(file);
}

function clearCover() {
  coverBase64 = "";
  document.getElementById("coverPreview").src = "";
}

// =======================
// CRUD
// =======================
function addNew() {
  const ten = document.getElementById("ten").value.trim();
  if (!ten) {
    alert("Chưa nhập tên sách");
    return;
  }

  const id = "item_" + Date.now();

  setItem(PATH, id, getFormData());
  resetForm();
}

function saveItem() {
  if (!currentId) {
    alert("Chưa chọn sách để lưu");
    return;
  }

  setItem(PATH, currentId, getFormData());
  resetForm();
}

function deleteItemUI() {
  if (!currentId) return;
  if (confirm("Xóa sách này?")) {
    deleteItem(PATH, currentId);
    resetForm();
  }
}

// =======================
// LIST
// =======================
function loadList() {
  listenData(PATH, data => {
    const tbody = document.getElementById("list");
    tbody.innerHTML = "";
    let i = 1;

    for (const id in data) {
      const it = data[id];
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${i++}</td>
        <td><img src="${it.cover || ""}" style="width:40px"></td>
        <td>${it.ten || ""}</td>
        <td>${it.theloai || ""}</td>
      `;

      tr.onclick = () => {
        currentId = id;
        document.getElementById("theloai").value = it.theloai || "";
        document.getElementById("ten").value = it.ten || "";
        document.getElementById("link").value = it.link || "";
        coverBase64 = it.cover || "";
        document.getElementById("coverPreview").src = coverBase64;
      };

      tbody.appendChild(tr);
    }
  });
}

// =======================
// HELPER
// =======================
function getFormData() {
  return {
    theloai: document.getElementById("theloai").value,
    ten: document.getElementById("ten").value,
    link: document.getElementById("link").value,
    cover: coverBase64
  };
}

function resetForm() {
  currentId = null;
  coverBase64 = "";
  document.getElementById("theloai").value = "";
  document.getElementById("ten").value = "";
  document.getElementById("link").value = "";
  document.getElementById("coverPreview").src = "";
}
