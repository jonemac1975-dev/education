export const monHocMap = {};

import { listenData } from "../../../src/services/firebaseService.js";

listenData("category/monhoc", data => {
  if (!data) return;

  for (const k in data) {
    const o = data[k];
    if (o.id && o.name) {
      monHocMap[o.id] = o.name;
    }
  }
});
