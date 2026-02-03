import { ContentService } from "../src/services/contentService.js";
import { Utils } from "../src/utils.js";
import { saveSession } from "./session.js";

async function hash(text) {
  const msg = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", msg);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export function initAuth() {

  // REGISTER
  const btnReg = document.getElementById("doRegister");
  if (btnReg) {
    btnReg.onclick = async () => {
      const id = regID.value.trim();
      const p1 = regPass.value;
      const p2 = regPass2.value;

      if (!id || !p1 || !p2) return alert("Chưa nhập đủ");
      if (p1 !== p2) return alert("Mật khẩu không trùng");

      const gv = await ContentService.getTeacher(id);
      if (!gv) return alert("ID giáo viên chưa tồn tại");

      gv.auth = { pass: await hash(p1), updatedAt: Utils.now() };
      await ContentService.saveTeacher(id, gv);

      alert("Đăng ký thành công");
    };
  }

  // LOGIN
  const btnLogin = document.getElementById("doLogin");
  if (btnLogin) {
    btnLogin.onclick = async () => {
      const id = logID.value.trim();
      const p  = logPass.value;

      if (!id || !p) return alert("Chưa nhập đủ");

      const gv = await ContentService.getTeacher(id);
      if (!gv || !gv.auth) return alert("Chưa đăng ký");

      if (await hash(p) !== gv.auth.pass)
        return alert("Sai mật khẩu");

      saveSession(id);
      location = "pages/giaovien/giaovien.html";
    };
  }
}
