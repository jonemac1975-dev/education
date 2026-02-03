// =====================================================
// TEST ENGLISH – STUDENT AUTH (FIXED – LOGIN FIRST)
// File: /js/testEnglishStudent.js
// =====================================================

import { FirebaseService } from "../src/services/firebaseService.js";
import { initExam } from "./exam.js";

// ================= ENTRY =================
export function initTestEnglish() {
  renderLogin(); // ✅ luôn vào LOGIN trước
}

// ================= LOGIN =================
function renderLogin() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
  <div class="exam-overlay">
    <div class="exam-login-box">
      <h2>TEST ENGLISH</h2>

      <div class="form-row">
        <label>ID</label>
        <input id="sid" placeholder="Input ID">
      </div>

      <div class="form-row">
        <label>Password</label>
        <input id="spass" type="password" placeholder="Input pass word">
      </div>

      <div class="btn-row">
        <button class="btn secondary" id="btnRegister">Register</button>
        <button class="btn primary"   id="btnLogin">Login</button>
        <button class="btn secondary" id="btnChange">Change pass</button>

	<button id="btnCancel">Cancel</button>

      </div>
----------------------------------------------------------
         Please contact us if you forget or lose your ID/password.
Zalo: 0982.175.887
      <div id="msg"></div>
    </div>
  </div>
`;


  document.getElementById("btnLogin").onclick    = login;
  document.getElementById("btnRegister").onclick = renderRegister;
  document.getElementById("btnChange").onclick   = renderChangePass;
  document.getElementById("btnCancel").onclick   = exitTest;
}

function show(msg, color = "red") {
  const el = document.getElementById("msg");
  if (el) {
    el.style.color = color;
    el.innerText = msg;
  }
}

function exitTest() {
  document.body.classList.remove("exam-mode");
  document.getElementById("app").innerHTML = "";
}

// ================= LOGIN HANDLE =================
async function login() {
  const id   = document.getElementById("sid").value.trim();
  const pass = document.getElementById("spass").value.trim();

  if (!id || !pass) return show("Nhập đủ ID + password");

  const data = await FirebaseService.get(`student/${id}`);
  if (!data) return show("ID không tồn tại");
  if (data.pass !== pass) return show("Sai password");

  sessionStorage.setItem("studentId", id);

  show("Đăng nhập thành công", "green");

  // ✅ CHỈ BẬT EXAM MODE SAU KHI LOGIN OK
  document.body.classList.add("exam-mode");

  setTimeout(() => {
    initExam();
  }, 300);
}

// ================= REGISTER =================
function renderRegister() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="auth-box" style="margin:60px auto">
      <h3>REGISTER</h3>
<label>ID</label>
      <input id="rid" placeholder="Input ID">
<label>Password</label>
      <input id="rpass" type="password" placeholder="Input Password">
<label>Confirm</label>
      <input id="rpass2" type="password" placeholder="Confirm passwword">
      <button id="btnOk">OK</button>
      <button id="btnCancel">Cancel</button>
      <div id="msg"></div>
    </div>
  `;

  document.getElementById("btnOk").onclick = doRegister;
  document.getElementById("btnCancel").onclick = renderLogin;
}


async function doRegister() {
  const id = document.getElementById("rid").value.trim();
  const p1 = document.getElementById("rpass").value;
  const p2 = document.getElementById("rpass2").value;

  if (!id) return show("Input ID");
  if (p1 !== p2) return show("Password not same");

  if (await FirebaseService.get(`student/${id}`))
    return show("ID đã tồn tại");

  await FirebaseService.set(`student/${id}`, {
    pass: p1,
    createdAt: Date.now()
  });

  show("Register successful", "green");
  setTimeout(renderLogin, 800);
}

// ================= CHANGE PASS =================
function renderChangePass() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="auth-box" style="margin:60px auto">
      <h3>CHANGE PASSWORD</h3>
<label>ID</label>
      <input id="cid" placeholder="Input ID">
<label>Old password</label>
      <input id="cold" type="password" placeholder="Old password">
<label>New password</label>
      <input id="cnew" type="password" placeholder="New password">
      <button id="btnOk">OK</button>
      <button id="btnCancel">Cancel</button>
      <div id="msg"></div>
    </div>
  `;

  document.getElementById("btnOk").onclick = doChange;
  document.getElementById("btnCancel").onclick = renderLogin;
}


async function doChange() {
  const id   = document.getElementById("cid").value.trim();
  const oldp = document.getElementById("cold").value;
  const newp = document.getElementById("cnew").value;

  const data = await FirebaseService.get(`student/${id}`);
  if (!data || data.pass !== oldp)
    return show("Wrong");

  await FirebaseService.update(`student/${id}`, { pass: newp });

  show("Change passwword successful", "green");
  setTimeout(renderLogin, 800);
}
