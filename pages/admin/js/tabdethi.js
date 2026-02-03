import {
  listenData,
  updateItem
} from "../../../src/services/firebaseService.js";

/*
  FIREBASE
  giaovien/{gvId}/dethi/{id}
*/

const ROOT = "giaovien";

// =======================
// RENDER
// =======================
export function rendertabdethi() {
  const main = document.getElementById("main");

  main.innerHTML = `
    <h2>DANH SÁCH ĐỀ THI</h2>

    <p style="font-style:italic;color:#555">
      (Chỉ đọc – tick chọn đề để công bố cho học sinh)
    </p>

    <table border="1" width="100%">
      <thead>
        <tr>
          <th>STT</th>
          <th>Giáo viên ra đề</th>
          <th>Mã đề</th>
          <th>Bắt đầu</th>
          <th>Kết thúc</th>
          <th>Nội dung</th>
          <th>Chọn</th>
        </tr>
      </thead>
      <tbody id="list"></tbody>
    </table>
  `;

  loadList();
}

// =======================
// LOAD LIST – KHÔNG FILTER
// =======================
function loadList() {
  const tb = document.getElementById("list");
  tb.innerHTML = "";

  let stt = 1;

  listenData(ROOT, data => {
    tb.innerHTML = "";
    stt = 1;
    if (!data) return;

    for (const gvId in data) {
      const gv = data[gvId];
      const tengv = gv.hoten || "(Chưa có tên)";

      if (!gv.dethi) continue;

      for (const id in gv.dethi) {
        const it = gv.dethi[id];

        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${stt++}</td>
          <td>${tengv}</td>
          <td>${it.made || ""}</td>
	  <td>${it.batdau || ""}</td>
	  <td>${it.ketthuc || ""}</td>

          <td>
            <button onclick="previewdethi('${gvId}','${id}')">xem</button>
          </td>
          <td style="text-align:center">
            <input type="checkbox"
  ${it.chon ? "checked" : ""}
  onclick="chonDe('${id}', this.checked)">

          </td>
        `;

        // ===== tick chọn đề =====
        const cb = tr.querySelector("input[type=checkbox]");
        cb.onchange = () => {
          updateItem(
            `${ROOT}/${gvId}/dethi`,
            id,
            { chon: cb.checked }
          );
        };

        tb.appendChild(tr);
      }
    }
  });
}

// =======================
// PREVIEW
// =======================
window.previewdethi = function (gvId, id) {
  localStorage.setItem(
    "preview_dethi",
    JSON.stringify({ gvId, id })
  );
  window.open("/preview.html", "_blank");
};

window.chonDe = function (id, value) {
  updateItem(`dethi/${id}`, "chon", value);
};
