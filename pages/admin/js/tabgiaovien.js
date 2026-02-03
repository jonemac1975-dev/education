import {
  addItem,
  updateItem,
setItem,
  deleteItem,
  listenData
} from "../../../src/services/firebaseService.js";

const PATH = "teacher";
let currentId = null;
let avatarBase64 = "";

/* ============================
   TIỆN ÍCH ID
============================ */
function toSlug(str) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function makeGVId(hoten, ngaysinh) {
  const base =
    toSlug(hoten) +
    "_" +
    ngaysinh.replaceAll("-", "");
  return base;
}

function randomSuffix() {
  return "_" + Math.floor(10 + Math.random() * 90);
}

/* ============================
   RENDER
============================ */
export function rendergiaovien() {
  const main = document.getElementById("main");

  main.innerHTML = `
    <h2>Hồ sơ giáo viên</h2>

    <div style="display:flex;gap:20px;flex-wrap:wrap">

      <!-- AVATAR -->
      <div style="width:180px">
        <img id="avatarPreview"
             style="width:150px;height:150px;border:1px solid #ccc;object-fit:cover">
        <div id="gvIdBox" style="margin-top:6px;font-weight:bold;color:#006"></div>
        <br>
        <input type="file" id="avatarInput" accept="image/*">
        <br>
        <button onclick="clearAvatar()">Xóa ảnh</button>
      </div>

      <!-- FORM -->
      <div style="flex:1;min-width:300px">
        ${input("Họ và tên","hoten")}
        ${select("Giới tính","gioitinh")}
        ${input("Ngày sinh","ngaysinh","date")}
        ${input("Điện thoại","dienthoai")}
        ${select("Học hàm","hocham")}
        ${select("Chuyên môn","chuyenmon")}
        ${select("Chức vụ","chucvu")}
        ${select("Phòng ban","phongban")}
        ${input("Gmail","gmail")}
        ${input("Facebook","facebook")}
        ${input("Zalo","zalo")}
      </div>
    </div>

    <div style="margin-top:10px">
      <button onclick="addGV()">Thêm</button>
      <button onclick="saveGV()">Lưu</button>
      <button onclick="deleteGV()">Xóa</button>
    </div>

    <h3 style="margin-top:20px">Danh sách giáo viên</h3>

    <div style="overflow-x:auto">
      <table border="1" cellpadding="6" style="min-width:1200px">
        <thead>
          <tr>
            <th>STT</th>
            <th>ID</th>
            <th>Họ tên</th>
            <th>GT</th>
            <th>Ngày sinh</th>
            <th>Điện thoại</th>
            <th>Học hàm</th>
            <th>Chuyên môn</th>
            <th>Chức vụ</th>
            <th>Phòng ban</th>
            <th>Gmail</th>
          </tr>
        </thead>
        <tbody id="gvList"></tbody>
      </table>
    </div>
  `;

  avatarInput.onchange = handleImage;

  gioitinh.innerHTML += `
    <option>Nam</option>
    <option>Nữ</option>
  `;

  loadDanhMuc("hocham","category/hocham");
loadDanhMuc("chuyenmon","category/chuyenmon");
loadDanhMuc("chucvu","category/chucvu");
loadDanhMuc("phongban","category/phongban");


  loadGV();
}

/* ============================
   FORM
============================ */
function getData(id){
  return {
    id,
    hoten: hoten.value,
    gioitinh: gioitinh.value,
    ngaysinh: ngaysinh.value,
    dienthoai: dienthoai.value,
    hocham: hocham.value,
    chuyenmon: chuyenmon.value,
    chucvu: chucvu.value,
    phongban: phongban.value,
    gmail: gmail.value,
    facebook: facebook.value,
    zalo: zalo.value,
    avatar: avatarBase64
  };
}

function resetForm(){
  currentId = null;
  avatarBase64 = "";
  gvIdBox.innerHTML = "";
  document.querySelectorAll("#main input,select").forEach(e=>e.value="");
  avatarPreview.src="";
}

/* ============================
   CRUD
============================ */
window.addGV = function () {
  if (!hoten.value || !ngaysinh.value) {
    return alert("Thiếu họ tên hoặc ngày sinh");
  }

  const id = "GV_" + Date.now(); // ✅ ID MÁY SINH – DUY NHẤT
  currentId = id;

  setItem(PATH, id, getData(id));

  gvIdBox.innerText = "ID đăng nhập: " + id;
  alert("Đã tạo giáo viên\nGửi ID này cho giáo viên đăng ký tài khoản");

  resetForm();
};


window.saveGV = function(){
  if(!currentId) return alert("Chưa chọn giáo viên");
  setItem(PATH, currentId, getData(currentId));
  alert("Đã lưu");
  resetForm();
};

window.deleteGV = function(){
  if(!currentId) return;
  if(confirm("Xóa giáo viên?")){
    deleteItem(PATH, currentId);
    resetForm();
  }
};

/* ============================
   LIST
============================ */
function loadGV(){
  listenData(PATH,data=>{
    gvList.innerHTML = "";

    // 1. Gom giáo viên theo phòng ban
    const groups = {};
    for (const id in data) {
      const gv = data[id];
      const pb = gv.phongban || "Chưa phân phòng";
      if (!groups[pb]) groups[pb] = [];
      groups[pb].push({ id, ...gv });
    }

    let stt = 1;

    // 2. Render từng phòng ban
    Object.keys(groups).sort().forEach(pb=>{
      // dòng tiêu đề phòng ban
      const trTitle = document.createElement("tr");
      trTitle.innerHTML = `
        <td colspan="11"
            style="background:#eee;font-weight:bold;color:#006">
          📌  ${pb}
        </td>`;
      gvList.appendChild(trTitle);

      // danh sách giáo viên trong phòng
      groups[pb].forEach(gv=>{
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${stt++}</td>
          <td>${gv.id}</td>
          <td>${gv.hoten}</td>
          <td>${gv.gioitinh}</td>
          <td>${gv.ngaysinh}</td>
          <td>${gv.dienthoai}</td>
          <td>${gv.hocham}</td>
          <td>${gv.chuyenmon}</td>
          <td>${gv.chucvu}</td>
          <td>${gv.phongban}</td>
          <td>${gv.gmail}</td>
        `;
        tr.onclick = () => {
          currentId = gv.id;
          for (const k in gv) {
            if (document.getElementById(k)) {
              document.getElementById(k).value = gv[k];
            }
          }
          avatarBase64 = gv.avatar || "";
          avatarPreview.src = avatarBase64;
          gvIdBox.innerText = "ID: " + gv.id;
        };
        gvList.appendChild(tr);
      });
    });
  });
}


/* ============================
   IMAGE
============================ */
function handleImage(e){
  const f=e.target.files[0];
  if(!f) return;
  const r=new FileReader();
  r.onload=()=>{
    avatarBase64=r.result;
    avatarPreview.src=avatarBase64;
  };
  r.readAsDataURL(f);
}

window.clearAvatar=()=>{avatarBase64="";avatarPreview.src="";};

/* ============================
   UI
============================ */
function input(l,id,t="text"){return `<div><label>${l}</label><br><input id="${id}" type="${t}" style="width:100%"></div>`;}
function select(l,id){return `<div><label>${l}</label><br><select id="${id}" style="width:100%"><option value=""></option></select></div>`;}
function loadDanhMuc(id,path){
  listenData(path,d=>{
    const s=document.getElementById(id); if(!s) return;
    s.innerHTML="<option></option>";
    for(const k in d){
      const o=document.createElement("option");
      o.textContent=d[k].name;
      s.appendChild(o);
    }
  });
}
