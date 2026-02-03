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

  const oldEl = document.getElementById("old");
  const newEl = document.getElementById("new");
  const cfEl  = document.getElementById("confirm");
  const msg   = document.getElementById("msg");

  const oldP = oldEl.value;
  const newP = newEl.value;
  const cf   = cfEl.value;

  // 1. Validate
  if (!oldP || !newP || newP !== cf) {
    msg.textContent = "Dữ liệu không hợp lệ";
    return;
  }

  // 2. Lấy admin theo chuẩn của anh: system/admin
  const admin = await ContentService.getAdmin();

  const oldHash = await sha256(oldP);

  if (!admin || admin.pass !== oldHash) {
    msg.textContent = "Sai mật khẩu cũ";
    return;
  }

  // 3. Lưu mật khẩu mới
  await ContentService.saveAdmin({
    pass: await sha256(newP)
  });

  msg.textContent = "Đổi mật khẩu thành công!";
};
