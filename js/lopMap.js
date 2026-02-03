export const lopMap = {};

import { listenData } from "../../../src/services/firebaseService.js";

listenData("category/lop", data => {
  if (!data) return;

  for (const k in data) {
    const o = data[k];
    if (o.id && o.name) {
      lopMap[o.id] = o.name;
    }
  }
});
