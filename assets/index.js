import { freeViewingLink, listSlides } from "./config.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const handleNavbar = () => {
  const navElement = $$(".nav-link");

  for (let i = 0; i < navElement.length; i++) {
    if (
      window.location.pathname.split("/")[1] ===
      navElement[i].attributes.href.nodeValue.split("/")[1]
    ) {
      navElement[i].style.backgroundColor = "#7d7ddd";
    }
  }
};

const addSlideLink = () => {
  const freeViewingElm = $(".btn-free-viewing");
  const slideElement = $(".slide");
  const listLinkElm = $$(".slide-item");
  const listElm = listSlides.map((elm) => {
    return `<a target="_blank" href=${elm.link} class="slide-item">${elm.name}</a>`;
  });

  if (freeViewingElm) {
    freeViewingElm.onclick = () => {
      window.open(freeViewingLink, "_blank");
    };
  }

  if (slideElement) {
    slideElement.innerHTML = listElm.join("\n");

    for (let i = 0; i < slideElement.children.length; i++) {
      const linkSlide = slideElement.children[i].getAttribute("href");
      slideElement.children[i].onclick = () => {
        window.open(linkSlide, "_blank");
      };
    }
  }
};

function start() {
  addSlideLink();
  handleNavbar();
}

start();
