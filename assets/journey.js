// Certificate popup: click a certificate to see it full size, click anywhere (or press Esc) to close.
// A button with data-pages shows every page of the document, stacked like a PDF viewer.
const box = document.getElementById("lightbox");
const fig = box.querySelector("figure");
const cap = box.querySelector("figcaption");
let lastFocus = null;

// caption: title · issuer · date, then the certificate's own verify link
function setCaption(btn, extra) {
  cap.textContent = btn.dataset.caption + extra;
  if (btn.dataset.verify) {
    const a = document.createElement("a");
    a.href = btn.dataset.verify;
    a.target = "_blank";
    a.rel = "noopener";
    a.className = "verify";
    a.textContent = (btn.dataset.verifyLabel || "Verify") + " ↗";
    a.addEventListener("click", e => e.stopPropagation());
    cap.appendChild(a);
  }
}

function openCert(btn) {
  lastFocus = btn;
  const pages = (btn.dataset.pages || btn.dataset.full).split("|");
  const alt = btn.querySelector("img").alt;
  fig.querySelectorAll("img, .pages").forEach(el => el.remove());
  fig.classList.toggle("doc", pages.length > 1);
  if (pages.length > 1) {
    const wrap = document.createElement("div");
    wrap.className = "pages";
    pages.forEach((src, i) => {
      const im = document.createElement("img");
      im.src = src;
      im.alt = `${alt}, page ${i + 1} of ${pages.length}`;
      wrap.appendChild(im);
    });
    fig.insertBefore(wrap, cap);
    setCaption(btn, ` · ${pages.length} pages, scroll to see all`);
  } else {
    const im = document.createElement("img");
    im.src = pages[0];
    im.alt = alt;
    fig.insertBefore(im, cap);
    setCaption(btn, "");
  }
  box.hidden = false;
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => box.classList.add("open"));
  box.focus({ preventScroll: true });
}

function closeCert() {
  box.classList.remove("open");
  document.body.style.overflow = "";
  setTimeout(() => { box.hidden = true; fig.querySelectorAll("img, .pages").forEach(el => el.remove()); }, 250);
  if (lastFocus) lastFocus.focus({ preventScroll: true });
}

document.querySelectorAll("button.cert").forEach(btn => btn.addEventListener("click", () => openCert(btn)));
box.tabIndex = -1;
box.addEventListener("click", closeCert);
document.addEventListener("keydown", e => { if (e.key === "Escape" && !box.hidden) closeCert(); });
