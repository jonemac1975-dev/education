import { FirebaseService } from "../src/services/firebaseService.js";
import { monHocMap } from "./monHocMap.js";
import { lopMap } from "./lopMap.js";

//const mon = monHocMap[dt.monhoc] || dt.monhoc || "Khác";
//const lop = lopMap[dt.lop] || dt.lop || "Khác";

/* ================= CORE ================= */
async function getTeachers() {
  return await FirebaseService.get("teacher");
}

/* ================= BÀI GIẢNG =================
   Môn học → Giáo viên → Bài giảng
*/
export async function getBaiGiang() {
  const teachers = await getTeachers();
  const tree = {};

  Object.values(teachers || {}).forEach(gv => {
    Object.values(gv.giaoan || {}).forEach(bg => {

      const mon = bg.monhoc || "Khác";
      const gvName = gv.hoten || "Khác";

      tree[mon] ??= {};
      tree[mon][gvName] ??= [];

      tree[mon][gvName].push({
        type: "baigiang",
        title: bg.tenbaigiang || bg.ten || "",
        meta: `${mon} – ${gvName}`,
        content: bg.noidung || "",                 // ✅ QUAN TRỌNG
        avatar: gv.avatar || "img/default_teacher.png"
      });

    });
  });

  return tree;
}

/* ================= BÀI TẬP =================
   Môn học → Lớp → Bài tập
*/
export async function getBaiTap() {
  const teachers = await getTeachers();
  const tree = {};

  Object.values(teachers || {}).forEach(gv => {
    Object.values(gv.baitap || {}).forEach(bt => {

      const mon = bt.monhoc || "Khác";
      const lop = bt.lop || "Khác";

      tree[mon] ??= {};
      tree[mon][lop] ??= [];

      tree[mon][lop].push({
        type: "baitap",
        title: bt.tieude || "",
        meta: `${mon} – ${lop}`,
        content: bt.noidung || ""                 // ✅ QUAN TRỌNG
      });

    });
  });

  return tree;
}

