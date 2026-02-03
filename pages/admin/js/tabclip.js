import {
  updateItem,
  setItem,
  deleteItem,
  listenData
} from "../../../src/services/firebaseService.js";

// =======================
// CONFIG
// =======================
const PATH = "content/clip";

let currentId = null;
let coverBase64 = "";

// =======================
// RENDER
// =======================
export function renderclip() {
  currentId = null;
  coverBase64 = "";

  const main = document.getElementById("main");

  main.innerHTML = `
    <h2>Clip – Youtube</h2>

    <label>Ngày</label><br>
    <input type="date" id="ngay"><br><br>

    <label>Tiêu đề</label><br>
    <input id="tieude" style="width:100%;padding:6px"><br><br>

    <label>Link Clip (GG) - Youtube(nếu có)</label><br>
    <input id="link" style="width:100%;padding:6px"><br><br>

    <label>Ảnh đại diện</label><br>
    <input type="file" id="coverInput" accept="image/*"><br>
    <img id="coverPreview" style="width:200px;margin-top:5px"><br><br>

    <label>Nội dung HTML</label><br>
    <textarea id="noidung" style="width:100%;height:150px;padding:6px"></textarea><br><br>

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

  // =======================
  // ELEMENTS
  // =======================
  const ngay = document.getElementById("ngay");
  const tieude = document.getElementById("tieude");
  const link = document.getElementById("link");
  const coverInput = document.getElementById("coverInput");
  const coverPreview = document.getElementById("coverPreview");
  const noidung = document.getElementById("noidung");
  const btnAdd = document.getElementById("btnAdd");
  const btnSave = document.getElementById("btnSave");
  const btnDelete = document.getElementById("btnDelete");
  const list = document.getElementById("list");

  // =======================
  // EVENTS
  // =======================
  coverInput.onchange = handleImage;
  btnAdd.onclick = addNew;
  btnSave.onclick = saveItem;
  btnDelete.onclick = deleteItemUI;

  // =======================
  // IMAGE
  // =======================
  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      coverBase64 = reader.result;
      coverPreview.src = coverBase64;
    };
    reader.readAsDataURL(file);
  }

  // =======================
  // CRUD
  // =======================
  function addNew() {
    if (!tieude.value.trim()) {
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

  // =======================
  // LIST
  // =======================
  function loadList() {
    listenData(PATH, data => {
      list.innerHTML = "";
      if (!data) return;

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

  // Load list khi render xong
  loadList();
}
