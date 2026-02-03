import { ContentService } from "../../../src/services/contentService.js";

async function sha256(text) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

document.getElementById("ok").onclick = async () => {

  const passEl = document.getElementById("pass");
  const msgEl  = document.getElementById("msg");

  const pass = passEl.value;
  if (!pass) return;

  const hash = await sha256(pass);

  const admin = await ContentService.getAdmin();

  if (admin && admin.pass === hash) {
    sessionStorage.setItem("admin", "1");
    location.href = "admin.html";
    return;
  }

  msgEl.textContent = "Sai mật khẩu";
};

const cancelBtn = document.getElementById("cancel");

if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
    window.location.href = "/index.html";

  });
}
