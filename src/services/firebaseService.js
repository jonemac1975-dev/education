// src/services/firebaseService.js
import { firebaseConfig } from "../config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  remove,
  onValue,
  update as fbUpdate
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// ================= INIT =================
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =================================================
// 1️⃣ API KIỂU CŨ – GIỮ TÊN, SỬA RUỘT (CHO GIÁO ÁN)
// =================================================

// ➜ DÙNG ID DO APP SINH (KHÔNG push)
export function addItem(path, data) {
  const id = "item_" + Date.now();
  const cleanData = JSON.parse(JSON.stringify(data));
  return set(ref(db, `${path}/${id}`), cleanData);
}


// ❗ GHI ĐÈ HÀM NÀY
// ✅ FIX CHO ADMIN CŨ
export function updateItem(path, id, data) {
  return fbUpdate(ref(db, `${path}/${id}`), data);
}




export function setItem(path, id, data) {
  const cleanData = JSON.parse(JSON.stringify(data));
  return set(ref(db, `${path}/${id}`), cleanData);
}



export function deleteItem(path, id) {
  return remove(ref(db, `${path}/${id}`));
}

// listen realtime (chỉ dùng cho category / teacher name)
export function listenData(path, callback) {
  return onValue(ref(db, path), snap => {
    callback(snap.exists() ? snap.val() : null);
  });
}

// lấy 1 lần (dùng cho list, preview)
export async function getOnceData(path) {
  const snap = await get(ref(db, path));
  return snap.exists() ? snap.val() : null;
}

// =================================================
// 2️⃣ API CHUẨN MỚI – KHÔNG ĐỤNG, CÁC TRANG KHÁC DÙNG
// =================================================
export const FirebaseService = {
  async get(path) {
    const snap = await get(ref(db, path));
    return snap.exists() ? snap.val() : null;
  },

  set(path, data) {
    return set(ref(db, path), data);
  },

  update(path, data) {
    return fbUpdate(ref(db, path), data);
  },

  remove(path) {
    return remove(ref(db, path));
  },

  listen(path, callback) {
    return onValue(ref(db, path), snap => {
      callback(snap.exists() ? snap.val() : null);
    });
  }
};
