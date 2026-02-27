const urlInput = document.getElementById("urlInput");
const textInput = document.getElementById("textInput");
const realQrContainer = document.getElementById("real-qrcode");
const shapeWrapper = document.getElementById("shapeWrapper");
const exportContainer = document.getElementById("export-container");
const shieldToggle = document.getElementById("shieldToggle");
const rootStyles = document.documentElement.style;

let currentColor = "#ff4d6d";

const qrCode = new QRCodeStyling({
  width: 140,
  height: 140,
  type: "canvas",
  data: urlInput.value || " ",
  margin: 0,
  qrOptions: { errorCorrectionLevel: "M" },
  dotsOptions: { color: currentColor, type: "rounded" },
  cornersSquareOptions: { color: currentColor, type: "extra-rounded" },
  cornersDotOptions: { color: currentColor },
  backgroundOptions: { color: "transparent" },
});
qrCode.append(realQrContainer);

const templates = {
  valentine: {
    bg: "https://images.unsplash.com/photo-1611080556916-2c5ebfc79ecb?w=600&q=80",
    color: "#ff4d6d",
  },
  gift: {
    bg: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80",
    color: "#f97316",
  },
  noel: {
    bg: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80",
    color: "#ef4444",
  },
  aesthetic: {
    bg: "https://images.unsplash.com/photo-1507504031003-b417247aa00e?w=600&q=80",
    color: "#ffffff",
  },
};

urlInput.addEventListener("input", () =>
  qrCode.update({ data: urlInput.value || " " }),
);

textInput.addEventListener(
  "input",
  () => (document.getElementById("text-display").innerText = textInput.value),
);

function changeShape(shapeName, btn) {
  document
    .querySelectorAll(".shape-options .btn-option")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  if (shapeName === "default") {
    shapeWrapper.classList.add("is-default-shape");
    shapeWrapper.style.width = "220px";
    shapeWrapper.style.height = "220px";
    rootStyles.setProperty("--qr-offset-y", "0px");

    qrCode.update({ width: 200, height: 200 });
    realQrContainer.style.width = "200px";
    realQrContainer.style.height = "200px";
  } else {
    shapeWrapper.classList.remove("is-default-shape");
    shapeWrapper.style.width = "260px";
    shapeWrapper.style.height = "260px";
    rootStyles.setProperty("--current-mask", `var(--mask-${shapeName})`);

    let qrSize = 140;
    if (shapeName === "heart") {
      rootStyles.setProperty("--qr-offset-y", "-15px");
      qrSize = 140;
    } else if (shapeName === "star") {
      rootStyles.setProperty("--qr-offset-y", "12px");
      qrSize = 110;
    } else if (shapeName === "square") {
      rootStyles.setProperty("--qr-offset-y", "0px");
      qrSize = 160;
    }

    qrCode.update({ width: qrSize, height: qrSize });
    realQrContainer.style.width = `${qrSize}px`;
    realQrContainer.style.height = `${qrSize}px`;
  }
}

shieldToggle.addEventListener("change", (e) => {
  e.target.checked
    ? shapeWrapper.classList.remove("hidden")
    : shapeWrapper.classList.add("hidden");
});

document.querySelectorAll(".template-options .btn-option").forEach((btn) => {
  btn.addEventListener("click", function () {
    document
      .querySelectorAll(".template-options .btn-option")
      .forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    const config = templates[this.getAttribute("data-theme")];
    exportContainer.style.backgroundImage = `url('${config.bg}')`;

    const colorBtn = Array.from(
      document.querySelectorAll(".color-swatch"),
    ).find(
      (b) =>
        b.style.backgroundColor === config.color ||
        b.style.backgroundColor === "rgb(255, 77, 109)",
    );
    if (colorBtn) changeColor(config.color, colorBtn);
  });
});

function changeColor(colorValue, btnElement) {
  document
    .querySelectorAll(".color-swatch")
    .forEach((b) => b.classList.remove("active"));
  if (btnElement) btnElement.classList.add("active");

  if (colorValue === "rainbow") {
    qrCode.update({
      dotsOptions: {
        type: "rounded",
        gradient: {
          type: "linear",
          colorStops: [
            { offset: 0, color: "#ff0000" },
            { offset: 0.2, color: "#ff8500" },
            { offset: 0.4, color: "#ffd500" },
            { offset: 0.6, color: "#00c853" },
            { offset: 0.8, color: "#2962ff" },
            { offset: 1, color: "#aa00ff" },
          ],
        },
      },
      cornersSquareOptions: { color: "#000000" },
      cornersDotOptions: { color: "#000000" },
    });
    shapeWrapper.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
  } else {
    qrCode.update({
      dotsOptions: { color: colorValue, gradient: null },
      cornersSquareOptions: { color: colorValue },
      cornersDotOptions: { color: colorValue },
    });

    if (colorValue.toLowerCase() === "#ffffff") {
      shapeWrapper.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
    } else {
      shapeWrapper.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
    }
  }
}

document.getElementById("fileInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      exportContainer.style.backgroundImage = `url('${event.target.result}')`;
      document
        .querySelectorAll(".template-options .btn-option")
        .forEach((b) => b.classList.remove("active"));
      shieldToggle.checked = true;
      shapeWrapper.classList.remove("hidden");
      changeColor(
        "#ffffff",
        document.querySelector('.color-swatch[style*="ffffff"]'),
      );
    };
    reader.readAsDataURL(file);
  }
});

function downloadQR() {
  const btn = document.querySelector(".btn-download");
  const oldText = btn.innerHTML;
  btn.innerHTML = "Đang xử lý...";

  htmlToImage
    .toPng(exportContainer, {
      pixelRatio: 3,
      cacheBust: true,
      style: {
        backdropFilter: "none",
        "-webkit-backdrop-filter": "none",
      },
    })
    .then(function (dataUrl) {
      const link = document.createElement("a");
      link.download = "Thiep-QR-Tien-Thuong.png";
      link.href = dataUrl;
      link.click();
      btn.innerHTML = oldText;
    })
    .catch(function (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi tạo ảnh! Hãy thử lại.");
      btn.innerHTML = oldText;
    });
}

exportContainer.style.backgroundImage = `url('${templates.valentine.bg}')`;
