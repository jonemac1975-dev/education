import { ContentService } from "../src/services/contentService.js";

async function hash(text) {
  const msg = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", msg);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export function initAdmin() {
  const lock = document.getElementById("adminLock");
  if (!lock) return;

  lock.onclick = async () => {
    const p = prompt("Nhập mật khẩu Admin");
    if (!p) return;

    const adm = await ContentService.getAdmin();
    if (await hash(p) === adm.pass)
      location = "pages/admin/admin.html";
    else
      alert("Sai mật khẩu admin");
  };
}
