import {
  addItem,
  updateItem,
  setItem,
  deleteItem,
  listenData
} from "../../../src/services/firebaseService.js";

const PATH = "content/hinh/hinhhead";


let currentId = null;
let imageBase64 = "";

// =======================
// RENDER
// =======================
export function renderhinhhead() {
  currentId = null;
  imageBase64 = "";

  const main = document.getElementById("main");

  main.innerHTML = `
    <h2>Hình nền Head</h2>

    <div style="display:flex;gap:20px">

      <div>
        <img id="preview"
             style="width:200px;height:120px;border:1px solid #ccc;object-fit:cover">
        <br><br>
        <input type="file" id="fileInput" accept="image/*">
      </div>

      <div>
        <label>Tên</label><br>
        <select id="ten" style="width:200px;padding:6px">
          <option value="">-- chọn --</option>
          <option value="head1.png">head1.png</option>
          <option value="head2.png">head2.png</option>
          <option value="head3.png">head3.png</option>
          <option value="head4.png">head4.png</option>
          <option value="head5.png">head5.png</option>
        </select>
      </div>
    </div>

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
          <th>Tên</th>
          <th>Ảnh</th>
        </tr>
      </thead>
      <tbody id="list"></tbody>
    </table>
  `;

  // ===== LẤY ELEMENT =====
  const fileInput = document.getElementById("fileInput");
  const ten = document.getElementById("ten");
  const preview = document.getElementById("preview");

  document.getElementById("btnAdd").onclick = addNew;
  document.getElementById("btnSave").onclick = saveItem;
  document.getElementById("btnDelete").onclick = deleteItemUI;

  fileInput.onchange = handleImage;
  loadList();

  // =======================
  // IMAGE
  // =======================
  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      imageBase64 = reader.result;
      preview.src = imageBase64;
    };
    reader.readAsDataURL(file);
  }

  // =======================
  // CRUD
  // =======================
  function addNew() {
    if (!ten.value) return alert("Chưa chọn tên");
    if (!imageBase64) return alert("Chưa chọn ảnh");

    addItem(PATH, {
      ten: ten.value,
      image: imageBase64
    });

    resetForm();
  }

  function saveItem() {
    if (!currentId) return alert("Chưa chọn dòng");

    setItem(PATH, currentId, {
      ten: ten.value,
      image: imageBase64
    });

    resetForm();
  }

  function deleteItemUI() {
    if (!currentId) return;
    if (confirm("Xóa hình?")) {
      deleteItem(PATH, currentId);
      resetForm();
    }
  }

  function resetForm() {
    currentId = null;
    imageBase64 = "";
    ten.value = "";
    preview.src = "";
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
          <td>${it.ten || ""}</td>
          <td><img src="${it.image || ""}" style="width:80px"></td>
        `;

        tr.onclick = () => {
          currentId = id;
          ten.value = it.ten || "";
          imageBase64 = it.image || "";
          preview.src = imageBase64;
        };

        tbody.appendChild(tr);
      }
    });
  }
}
