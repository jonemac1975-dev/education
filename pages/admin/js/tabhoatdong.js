import {
  updateItem,
  setItem,
  deleteItem,
  listenData
} from "../../../src/services/firebaseService.js";

// =======================
// CONFIG
// =======================
const PATH = "content/hoatdong";

let currentId = null;
let coverBase64 = "";

// =======================
// RENDER
// =======================
export function renderhoatdong() {
  currentId = null;
  coverBase64 = "";

  const main = document.getElementById("main");

  main.innerHTML = `
    <h2>Hoạt động cộng đồng</h2>

    <label>Ngày</label><br>
    <input type="date" id="ngay"><br><br>

    <label>Tiêu đề</label><br>
    <input id="tieude" style="width:100%;padding:6px"><br><br>

    <label>Link bài viết (nếu có)</label><br>
    <input id="link" style="width:100%;padding:6px"><br><br>

    <label>Ảnh đại diện</label><br>
    <input type="file" id="coverInput" accept="image/*"><br>
    <img id="coverPreview" style="width:200px;margin-top:5px"><br><br>

    <label>Nội dung (HTML)</label>
    <div style="margin:5px 0">
      <button id="btnYoutube">Chèn YouTube</button>
      <button id="btnMp4">Chèn MP4 Google Drive</button>
      <button id="btnPreview">Preview</button>
    </div>

    <textarea id="noidung"
      style="width:100%;height:250px;font-family:monospace"></textarea>

    <div style="margin-top:10px">
      <button id="btnAdd">Thêm</button>
      <button id="btnSave">Lưu</button>
      <button id="btnDelete">Xóa</button>
    </div>

    <h3 style="margin-top:20px">Danh sách</h3>
    <table border="1" width="100%">
      <thead>
        <tr>
          <th>STT</th>
          <th>Ngày</th>
          <th>Tiêu đề</th>
        </tr>
      </thead>
      <tbody id="list"></tbody>
    </table>
  `;

  // EVENT
  coverInput.onchange = handleImage;
  btnAdd.onclick = addNew;
  btnSave.onclick = saveItem;
  btnDelete.onclick = deleteItemUI;
  btnYoutube.onclick = insertYoutube;
  btnMp4.onclick = insertMp4;
  btnPreview.onclick = previewContent;

  loadList();
}

// =======================
// IMAGE
// =======================
function handleImage(e) {
  const file = e.target.files[0];
  if (!file) return;

  const r = new FileReader();
  r.onload = () => {
    coverBase64 = r.result;
    coverPreview.src = coverBase64;
  };
  r.readAsDataURL(file);
}

// =======================
// INSERT
// =======================
function insertYoutube() {
  const url = prompt("Dán link YouTube");
  if (!url) return;

  const id = url.split("v=")[1]?.split("&")[0];
  if (!id) return alert("Link không hợp lệ");

  noidung.value += `
<iframe width="560" height="315"
src="https://www.youtube.com/embed/${id}"
frameborder="0" allowfullscreen></iframe>\n`;
}

function insertMp4() {
  const url = prompt("Dán link MP4 Google Drive");
  if (!url) return;

  noidung.value += `
<video controls width="100%">
  <source src="${url}">
</video>\n`;
}

// =======================
// PREVIEW
// =======================
function previewContent() {
  localStorage.setItem("preview_html", noidung.value);
window.open("/preview.html", "_blank");

}

// =======================
// CRUD
// =======================
function addNew() {
  if (!tieude.value) {
    alert("Chưa nhập tiêu đề");
    return;
  }

  const id = "item_" + Date.now();
  setItem(PATH, id, getFormData());
  resetForm();
}

function saveItem() {
  if (!currentId) {
    alert("Chưa chọn tin để lưu");
    return;
  }

  setItem(PATH, currentId, getFormData());
  resetForm();
}

function deleteItemUI() {
  if (!currentId) return;
  if (confirm("Xóa tin này?")) {
    deleteItem(PATH, currentId);
    resetForm();
  }
}

// =======================
// LIST
// =======================
function loadList() {
  listenData(PATH, data => {
    list.innerHTML = "";
    let i = 1;

    for (const id in data) {
      const it = data[id];
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${i++}</td>
        <td>${it.ngay || ""}</td>
        <td>${it.tieude || ""}</td>
      `;

      tr.onclick = () => {
        currentId = id;
        ngay.value = it.ngay || "";
        tieude.value = it.tieude || "";
        link.value = it.link || "";
        noidung.value = it.noidung || "";
        coverBase64 = it.cover || "";
        coverPreview.src = coverBase64;
      };

      list.appendChild(tr);
    }
  });
}

// =======================
// HELPER
// =======================
function getFormData() {
  return {
    ngay: ngay.value,
    tieude: tieude.value,
    link: link.value,
    noidung: noidung.value,
    cover: coverBase64
  };
}

function resetForm() {
  currentId = null;
  coverBase64 = "";
  ngay.value = "";
  tieude.value = "";
  link.value = "";
  noidung.value = "";
  coverPreview.src = "";
}
