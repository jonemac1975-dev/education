import { disableMainBg } from "./bgMain.js";

/* ================= ENTRY ================= */
export function renderTree(containerId, data, mode) {
  const box = document.getElementById(containerId);
  if (!box) return;

  // reset menu tree
  box.innerHTML = "";
  buildLevel(box, data, mode, 1);
}

/* ================= RECURSIVE ================= */
function buildLevel(parent, obj, mode, level) {
  Object.entries(obj || {}).forEach(([key, value]) => {

    const label = getLabel(mode, level);
    const nodeEl = createNode(label + key);
    const childrenEl = createChildren();

    /* ===== LEAF LEVEL ===== */
    if (Array.isArray(value)) {
      value.forEach(item => {
        const leaf = document.createElement("div");
        leaf.className = "leaf";
        leaf.textContent = getLeafLabel(mode) + (item.title || "");

        leaf.onclick = (e) => {
          e.stopPropagation();

          disableMainBg();
	

   

localStorage.setItem("GV_ID", item.gvId || "");



          // ✅ THU TOÀN BỘ MENU TREE
          const menuTree = document.getElementById("menuTree");
          if (menuTree) menuTree.classList.add("hidden");

          const main = document.getElementById("mainContent");

          // ===== BÀI GIẢNG / BÀI TẬP =====
          if (item.type === "baigiang" || item.type === "baitap") {

            localStorage.setItem("lesson_preview", JSON.stringify({
              name: item.title || "",
              meta: item.meta || "",
              content: item.content || "",
              avatar: item.avatar || "img/default_teacher.png"
            }));

            // đổi avatar giáo viên
            const avatarEl = document.getElementById("teacherAvatar");
            if (avatarEl) {
              avatarEl.src = item.avatar || "img/default_teacher.png";
            }

            main.innerHTML = `
              <iframe 
                src="preview.html"
                style="width:100%; height:80vh; border:none;"
              ></iframe>
            `;
            return;
          }

          };

        childrenEl.appendChild(leaf);
      });
    }

    /* ===== OBJECT LEVEL ===== */
    else if (typeof value === "object") {
      buildLevel(childrenEl, value, mode, level + 1);
    }

    nodeEl.onclick = () => toggle(childrenEl);
    parent.append(nodeEl, childrenEl);
  });
}

/* ================= LABEL ================= */
function getLabel(mode, level) {
  if (mode === "baigiang") return ["", "Subject : ", "Teacher : "][level] || "";
  if (mode === "baitap")   return ["", "Subject : ", "Class : "][level] || "";
    return "";
}

function getLeafLabel(mode) {
  if (mode === "baigiang") return "Lesson : ";
  if (mode === "baitap")  return "Exercise : ";
  
  return "";
}

/* ================= UI HELPERS ================= */
function createNode(text) {
  const d = document.createElement("div");
  d.className = "node";
  d.textContent = "👉 " + text;
  return d;
}

function createChildren() {
  const d = document.createElement("div");
  d.className = "children hidden";
  return d;
}

function toggle(el) {
  el.classList.toggle("hidden");
}
