import {
  addItem,
  updateItem,
  deleteItem,
  listenData
} from "../../../src/services/firebaseService.js";

const PATH = "content/hinh/hinhmain";

let currentId = null;
let imageBase64 = "";

export function renderhinhmain() {
  currentId = null;
  imageBase64 = "";

  const main = document.getElementById("main");

  main.innerHTML = `
    <h2>Hình nền Main</h2>

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
          <option value="main1.png">main1.png</option>
          <option value="main2.png">main2.png</option>
          <option value="main3.png">main3.png</option>
          <option value="main4.png">main4.png</option>
          <option value="main5.png">main5.png</option>
        </select>
      </div>
    </div>

    <div style="margin-top:10px">
      <button onclick="addNew()">Thêm</button>
      <button onclick="saveItem()">Lưu</button>
      <button onclick="deleteItemUI()">Xóa</button>
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

  document.getElementById("fileInput").onchange = handleImage;

  loadList();
}

// ===== giống y chang file trên =====
function handleImage(e) {
  const file = e.target.files[0];
  if (!file) return;

  const r = new FileReader();
  r.onload = () => {
    imageBase64 = r.result;
    preview.src = imageBase64;
  };
  r.readAsDataURL(file);
}

window.addNew = function () {
  if (!ten.value || !imageBase64) return alert("Thiếu dữ liệu");

  addItem(PATH, {
    ten: ten.value,
    image: imageBase64
  });

  resetForm();
};

window.saveItem = function () {
  if (!currentId) return alert("Chưa chọn dòng");

  updateItem(PATH, currentId, {
    ten: ten.value,
    image: imageBase64
  });

  resetForm();
};

window.deleteItemUI = function () {
  if (!currentId) return;
  if (confirm("Xóa hình?")) {
    deleteItem(PATH, currentId);
    resetForm();
  }
};

function resetForm() {
  currentId = null;
  imageBase64 = "";
  ten.value = "";
  preview.src = "";
}

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
