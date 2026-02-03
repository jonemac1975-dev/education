import { ContentService } from "../../../src/services/contentService.js";

const TYPE = "monhoc";        // loại danh mục
let currentId = null;

export function rendermonhoc() {

  const main = document.getElementById("main");

  main.innerHTML = `
    <h2>Môn Học</h2>

    <input id="txtName" placeholder="Tên Môn Học" style="padding:6px;width:300px">

    <div style="margin-top:10px">
      <button id="btnAdd">Thêm</button>
      <button id="btnSave">Lưu</button>
      <button id="btnDelete">Xóa</button>
    </div>

    <table border="1" width="100%" style="margin-top:15px">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên Môn Học</th>
        </tr>
      </thead>
      <tbody id="list"></tbody>
    </table>
  `;

  document.getElementById("btnAdd").onclick = add;
  document.getElementById("btnSave").onclick = save;
  document.getElementById("btnDelete").onclick = del;

  load();
}

// =========================
// THÊM
// =========================
async function add() {

  const name = txtName.value.trim();
  if (!name) return alert("Nhập tên");

  const id = "hm_" + Date.now();

  await ContentService.saveCategory(TYPE, id, {
    id,
    name
  });

  txtName.value = "";
load();  
}

// =========================
// LƯU
// =========================
async function save() {

  if (!currentId) return alert("Chọn dòng để lưu");

  await ContentService.saveCategory(TYPE, currentId, {
    id: currentId,
    name: txtName.value
  });
load();  
}

// =========================
// XÓA
// =========================
async function del() {

  if (!currentId) return alert("Chọn dòng để xóa");

  if (!confirm("Xóa?")) return;

  await ContentService.saveCategory(TYPE, currentId, null);

  currentId = null;
  txtName.value = "";
load();  
}

// =========================
// LOAD
// =========================
async function load() {

  const data = await ContentService.listCategory(TYPE) || {};

  const tbody = document.getElementById("list");
  tbody.innerHTML = "";

  let i = 1;

  for (let id in data) {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${i++}</td>
      <td>${data[id].name}</td>
    `;

    tr.onclick = () => {
      currentId = id;
      txtName.value = data[id].name;
    };

    tbody.appendChild(tr);
  }
}
