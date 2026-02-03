import { FirebaseService } from "../../../src/services/firebaseService.js";

/* =======================
   AUTH
======================= */
const GV_ID = localStorage.getItem("GV_ID") || localStorage.getItem("TEACHER_ID");
if (!GV_ID) {
  alert("Chưa đăng nhập giáo viên");
  location.href = "../../index.html";
}

const PATH = `teacher/${GV_ID}/test`;
let currentId = null;

/* =======================
   RENDER FORM
======================= */
export function renderTestEnglish() {
  const main = document.getElementById("main");

  main.innerHTML = `
    <h2>RA ĐỀ TEST ENGLISH</h2>

    <label>Mã đề (01–50)</label>
    <input id="made" placeholder="01" style="width:120px;padding:6px">

    <label style="margin-top:10px">Nhập đề vào đây</label>
    <div id="noidung" contenteditable="true"
      style="border:1px solid #ccc;min-height:300px;
             padding:12px;overflow-y:auto"></div>

    <div style="margin-top:10px">
      <button onclick="addTest()">Thêm</button>
      <button onclick="saveTest()">Lưu</button>
    </div>

    <h3 style="margin-top:20px">Danh sách đề</h3>
    <table border="1" width="100%">
      <thead>
        <tr><th>Số đề</th><th>Hành động</th></tr>
      </thead>
      <tbody id="list"></tbody>
    </table>
  `;

  loadList();
}

/* =======================
   PARSE TRẮC NGHIỆM
======================= */
function parseQuestionsFromText(rawText) {
  const lines = rawText
    .split(/\n+/)
    .map(l => l.trim())
    .filter(Boolean);

  const questions = [];
  let q = null;

  lines.forEach(line => {
    if (/^Câu\s*\d+/i.test(line)) {
      if (q) questions.push(q);
      q = {
        q: line.replace(/^Câu\s*\d+[:.]?/i, "").trim(),
        options: [],
        answer: -1
      };
    }
    else if (/^[A-D]\./.test(line) && q) {
      const isCorrect = line.includes("*");
      const text = line
        .replace(/^[A-D]\./, "")
        .replace("*", "")
        .trim();

      if (isCorrect) q.answer = q.options.length;
      q.options.push(text);
    }
  });

  if (q) questions.push(q);
  return questions;
}

/* =======================
   DATA
======================= */
function getData() {
  const rawHTML = document.getElementById("noidung").innerHTML;
  const rawText = document.getElementById("noidung").innerText;

  return {
    id: currentId,
    raw: rawHTML,
    questions: parseQuestionsFromText(rawText),
    updatedAt: new Date().toISOString()
  };
}

/* =======================
   CRUD
======================= */
window.addTest = async () => {
  const id = document.getElementById("made").value.trim();
  if (!id) return alert("Chưa nhập mã đề");

  currentId = id;
  const data = getData();
  data.createdAt = new Date().toISOString();

  await FirebaseService.set(`${PATH}/${id}`, data);
  resetForm();
  alert("✅ Đã thêm đề");
};

window.saveTest = async () => {
  if (!currentId) return alert("⚠️ Chưa chọn đề để lưu");

  await FirebaseService.set(`${PATH}/${currentId}`, getData());
  resetForm();
  alert("💾 Đã lưu đề");
};

window.deleteTest = async id => {
  if (!confirm("Xóa đề " + id + " ?")) return;
  await FirebaseService.remove(`${PATH}/${id}`);
  loadList();
};

window.viewTest = async id => {
  const it = await FirebaseService.get(`${PATH}/${id}`);
  if (!it) return;

  currentId = id;
  document.getElementById("made").value = id;
  document.getElementById("noidung").innerHTML = it.raw || "";
};

/* =======================
   LIST
======================= */
async function loadList() {
  const data = await FirebaseService.get(PATH);
  const tbody = document.getElementById("list");
  tbody.innerHTML = "";
  if (!data) return;

  Object.keys(data)
    .sort()
    .forEach(id => {
      tbody.innerHTML += `
        <tr>
          <td>${id}</td>
          <td>
            <button onclick="viewTest('${id}')">Xem</button>
            <button onclick="deleteTest('${id}')">Xóa</button>
          </td>
        </tr>
      `;
    });
}

/* =======================
   RESET
======================= */
function resetForm() {
  currentId = null;
  document.getElementById("made").value = "";
  document.getElementById("noidung").innerHTML = "";
  loadList();
}
