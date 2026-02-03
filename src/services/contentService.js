import { FirebaseService } from "./firebaseService.js";
import { Utils } from "../utils.js";

export const ContentService = {

  // ===== SYSTEM =====
  async getAdmin() {
    return FirebaseService.get("system/admin");
  },

  async saveAdmin(data) {
    data.updatedAt = Utils.now();
    return FirebaseService.set("system/admin", data);
  },

  // ===== TEACHER =====
  async getTeacher(id) {
    return FirebaseService.get(`teacher/${id}`);
  },

  async saveTeacher(id, data) {
    data.updatedAt = Utils.now();
    return FirebaseService.set(`teacher/${id}`, data);
  },

  async listTeacher() {
    return FirebaseService.get("teacher");
  },

// ===== BAITAP =====
async addBaiTap(gvId, id, data) {
  data.createdAt = Utils.now();
  return FirebaseService.set(`teacher/${gvId}/baitap/${id}`, data);
},

async updateBaiTap(gvId, id, data) {
  data.updatedAt = Utils.now();
  return FirebaseService.set(`teacher/${gvId}/baitap/${id}`, data);
},

async deleteBaiTap(gvId, id) {
  return FirebaseService.remove(`teacher/${gvId}/baitap/${id}`);
},

async listBaiTap(gvId) {
  return FirebaseService.get(`teacher/${gvId}/baitap`);
},


  // ===== CONTENT =====
  async listContent(type) {
    return FirebaseService.get(`content/${type}`);
  },

async getImages(type) {
  // type: "hinhhead" | "hinhmain"
  const data = await FirebaseService.get(`content/hinh/${type}`);
  if (!data) return [];
  return Object.values(data);
},

  async saveContent(type, id, data) {
    data.updatedAt = Utils.now();
    return FirebaseService.set(`content/${type}/${id}`, data);
  },

  // ===== CATEGORY =====
  async listCategory(type) {
    return FirebaseService.get(`category/${type}`);
  },

  async saveCategory(type, id, data) {
    return FirebaseService.set(`category/${type}/${id}`, data);
  }
};
