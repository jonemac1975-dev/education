import { setItem, listenData } from "../../../src/services/firebaseService.js";

const PATH = "student";

/* =========================
   RENDER
========================= */
export function rendersinhvien() {
  const main = document.getElementById("main");

  main.innerHTML = `
    <h2>📋 Sinh viên đăng ký thi</h2>

    <input id="kw"
      placeholder="Tìm ID (tên đăng nhập)..."
      style="width:260px;margin:10px 0;padding:6px">

    <table border="1" cellpadding="6" style="width:100%;max-width:700px">
      <thead>
        <tr style="background:#eee">
          <th>STT</th>
          <th>ID đăng nhập</th>
          <th>Pass</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody id="svList"></tbody>
    </table>
  `;

  kw.oninput = () => loadSV(kw.value);
  loadSV();
}

/* =========================
   LOAD LIST
========================= */
function loadSV(keyword = "") {
  listenData(PATH, data => {
    svList.innerHTML = "";
    let stt = 1;

    for (const id in data) {
      if (keyword && !id.toLowerCase().includes(keyword.toLowerCase())) continue;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${stt++}</td>
        <td><b>${id}</b></td>
        <td>******</td>
        <td>
          <button onclick="viewPass('${id}')">👁 Xem</button>
          <button onclick="resetPass('${id}')">🔁 Reset</button>
        </td>
      `;
      svList.appendChild(tr);
    }
  });
}

/* =========================
   PASS
========================= */
window.viewPass = function (id) {
  listenData(PATH + "/" + id, sv => {
    if (!sv?.pass) return alert("Chưa có pass");
    alert(`PASS của ${id}: ${sv.pass}`);
  });
};

window.resetPass = function (id) {
  const newPass = Math.random().toString(36).slice(-6);

  if (!confirm(`Reset pass cho ${id}?`)) return;

  setItem(PATH, id + "/pass", newPass);
  alert(`Pass mới của ${id}: ${newPass}`);
};
