import { ContentService } from "../../../src/services/contentService.js";

const params = new URLSearchParams(location.search);
const TYPE = params.get("type"); 
// vd: monhoc, hocham, chuyenmon, chucvu, phongban, kythi, lop

document.getElementById("title").textContent =
  "Danh mục : " + TYPE;

let selectedId = null;

async function loadList() {
  const data = await ContentService.list(TYPE) || {};
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  let i = 1;
  for (const id in data) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i++}</td>
      <td>${data[id].name}</td>
    `;
    tr.onclick = () => {
      selectedId = id;
      name.value = data[id].name;
    };
    tbody.appendChild(tr);
  }
}

add.onclick = async () => {
  const val = name.value.trim();
  if (!val) return;

  await ContentService.create(TYPE, { name: val });
  name.value = "";
  loadList();
};

save.onclick = async () => {
  if (!selectedId) return;
  await ContentService.update(TYPE, selectedId, {
    name: name.value
  });
  loadList();
};

del.onclick = async () => {
  if (!selectedId) return;
  await ContentService.remove(TYPE, selectedId);
  selectedId = null;
  name.value = "";
  loadList();
};

loadList();
