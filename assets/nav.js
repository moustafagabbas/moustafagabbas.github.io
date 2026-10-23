// Side menu: highlight the section on screen, slide the glow to it, fill the progress bar.
document.documentElement.classList.add("js");

// Always open a page at its top section, unless the link points to a real section on it.
// Some hosts (and browser history) keep the previous scroll position, so repeat it a few times
// while the page loads. scrollIntoView also scrolls any outer frame the page sits in.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
function goTop() {
  const first = document.querySelector("header[id]");
  if (first) first.scrollIntoView({ block: "start" });
  window.scrollTo(0, 0);
}
if (!target) {
  goTop();
  window.addEventListener("DOMContentLoaded", goTop);
  window.addEventListener("load", () => { goTop(); setTimeout(goTop, 120); setTimeout(goTop, 400); });
  window.addEventListener("pageshow", e => { if (e.persisted) goTop(); });
}

const items = [...document.querySelectorAll(".rail a.item[href^='#']")];
const ind = document.querySelector(".rail .ind");
const bar = document.querySelector(".rail .progress div");
const sections = items.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);

function setActive(id) {
  items.forEach(a => {
    const on = a.getAttribute("href") === "#" + id;
    a.classList.toggle("active", on);
    if (on && ind) ind.style.transform = `translate(${a.parentElement.offsetLeft}px, ${a.parentElement.offsetTop}px)`;
  });
}

function onScroll() {
  // the active section is the last one whose top has passed 40% of the screen
  const line = window.innerHeight * 0.4;
  let current = sections[0];
  for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s;
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = sections[sections.length - 1];
  if (current) setActive(current.id);
  if (bar) {
    const max = document.body.scrollHeight - window.innerHeight;
    bar.style.height = (max > 0 ? window.scrollY / max * 100 : 0) + "%";
  }
}
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();

// fade sections in as they come on screen
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// arrow buttons for the projects track
document.querySelectorAll("[data-track]").forEach(btn => btn.addEventListener("click", () => {
  const track = document.querySelector(btn.dataset.track);
  track.scrollBy({ left: (btn.dataset.dir === "next" ? 1 : -1) * track.clientWidth * 0.8, behavior: "smooth" });
}));
