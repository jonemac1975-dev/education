// src/utils.js
export const Utils = {
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  },

  now() {
    return new Date().toISOString();
  },

  clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
};
