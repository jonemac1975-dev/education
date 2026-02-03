import { ContentService } from "../src/services/contentService.js";

/**
 * Load Thư viện, Hoạt động, Bài viết, Thời sự
 * Thư viện theo thể loại: Sách / Tài liệu → Thể loại → cover + tên (link)
 */
export async function loadInfo() {
  try {
    const createCoverLink = (item) => {
      const a = document.createElement("a");
      a.href = item.link || "#";
      a.target = "_blank";
      a.style.display = "flex";
      a.style.alignItems = "center";
      a.style.marginBottom = "4px";
      a.style.padding = "2px 4px";
      a.style.borderRadius = "4px";
      a.style.transition = "all 0.2s ease";
      a.style.textDecoration = "none";
      a.style.color = "#222";

      a.onmouseenter = () => {
        a.style.background = "rgba(21,101,192,0.1)";
        a.style.transform = "translateY(-2px)";
      };
      a.onmouseleave = () => {
        a.style.background = "transparent";
        a.style.transform = "translateY(0)";
      };

      const img = document.createElement("img");
      img.src = item.cover || "img/default_cover.png";
      img.alt = item.ten || "";
      img.style.width = "1cm";
      img.style.height = "1cm";
      img.style.objectFit = "cover";
      img.style.marginRight = "6px";
      img.style.borderRadius = "2px";
      img.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";

      const span = document.createElement("span");
      span.textContent = item.ten || "";

      a.append(img, span);
      return a;
    };

    const renderByTypeAndTheLoai = async (typeName, zoneId) => {
      const data = await ContentService.listContent(typeName);
      const zone = document.getElementById(zoneId);
      if (!zone || !data) return;
      zone.innerHTML = "";

      // Nhóm theo thể loại
      const grouped = {};
      Object.values(data).forEach(item => {
        const tl = item.theloai || "Không xác định";
        if (!grouped[tl]) grouped[tl] = [];
        grouped[tl].push(item);
      });

      Object.entries(grouped).forEach(([tl, items]) => {
        const h4 = document.createElement("h4");
        h4.textContent = tl;
        h4.style.margin = "6px 0 2px 0";
        h4.style.fontWeight = "600";
        zone.appendChild(h4);

        items.forEach(it => {
          zone.appendChild(createCoverLink(it));
        });
      });
    };

    // ==== Sách theo thể loại ====
    await renderByTypeAndTheLoai("sach", "sachZone");

    // ==== Tài liệu theo thể loại ====
    await renderByTypeAndTheLoai("tailieu", "tailieuZone");

    // ==== Hoạt động ====
    const hoatdongData = await ContentService.listContent("hoatdong");
    const hoatdongZone = document.getElementById("hoatdongZone");
    if (hoatdongZone && hoatdongData) {
      hoatdongZone.innerHTML = "";
      Object.values(hoatdongData).forEach(item => {
        const a = document.createElement("a");
        a.href = item.link || "#";
        a.target = "_blank";
        a.textContent = `${item.tieude || ""} - ${item.ngay || ""}`;
        a.style.display = "block";
        a.style.color = "#1565c0";
        a.style.textDecoration = "underline";
        hoatdongZone.appendChild(a);
      });
    }

    // ==== Thời sự ====
    const thoisuData = await ContentService.listContent("thoisu");
    const thoisuZone = document.getElementById("thoisuZone");
    if (thoisuZone && thoisuData) {
      thoisuZone.innerHTML = "";
      Object.values(thoisuData).forEach(item => {
        const a = document.createElement("a");
        a.href = item.link || "#";
        a.target = "_blank";
        a.textContent = `${item.tieude || ""} - ${item.ngay || ""}`;
        a.style.display = "block";
        a.style.color = "#1565c0";
        a.style.textDecoration = "underline";
        thoisuZone.appendChild(a);
      });
    }

    // ==== Bài viết ====
    const baivietData = await ContentService.listContent("baiviet");
    const baivietZone = document.getElementById("baivietZone");
    if (baivietZone && baivietData) {
      baivietZone.innerHTML = "";
      Object.values(baivietData).forEach(item => {
        const a = document.createElement("a");
        a.href = item.link || "#";
        a.target = "_blank";
        a.textContent = `${item.tieude || ""} - ${item.ngay || ""}`;
        a.style.display = "block";
        a.style.color = "#1565c0";
        a.style.textDecoration = "underline";
        baivietZone.appendChild(a);
      });
    }

// ==== Clip / YouTube / MP3 Drive ====
const clipData = await ContentService.listContent("clip");
const clipZone = document.getElementById("clipZone");

if (clipZone && clipData) {
  clipZone.innerHTML = "";

  Object.values(clipData).forEach(item => {
    if (!item.link) return;

    const clipItem = document.createElement("div");
    clipItem.className = "clip-item";

    const videoBox = document.createElement("div");
    videoBox.className = "clip-video";

    /* ===== YouTube ===== */
    if (item.link.includes("youtube.com") || item.link.includes("youtu.be")) {
      let videoId = "";

      if (item.link.includes("youtu.be")) {
        videoId = item.link.split("/").pop();
      } else {
        const m = item.link.match(/v=([^&]+)/);
        if (m) videoId = m[1];
      }

      if (!videoId) return;

      videoBox.innerHTML = `
        <iframe 
          src="https://www.youtube.com/embed/${videoId}"
          allowfullscreen>
        </iframe>
      `;
    }

    /* ===== Google Drive (MP3 / PDF / Video) ===== */
    else if (item.link.includes("drive.google.com")) {
      const m = item.link.match(/\/d\/([^/]+)/);
      if (!m) return;

      const fileId = m[1];

      videoBox.innerHTML = `
        <iframe
          src="https://drive.google.com/file/d/${fileId}/preview"
          style="width:100%; height:30px; border:none"
          allow="autoplay">
        </iframe>
      `;
    }

    else {
      return;
    }

    const infoBox = document.createElement("div");
    infoBox.className = "clip-info";

    if (item.tieude) {
      const title = document.createElement("div");
      title.className = "clip-title";
      title.textContent = item.tieude;
      infoBox.appendChild(title);
    }

    clipItem.append(videoBox, infoBox);
    clipZone.appendChild(clipItem);
  });
}




  } catch (err) {
    console.error("Load info error:", err);
  }
}


    
  