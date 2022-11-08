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

const handleSave = () => {
  const btnSave = $("#action-save");
  const outputElm = $("#aiimage");

  if (btnSave) {
    btnSave.onclick = () => {
      if (!outputElm.getAttribute("src"))
        return toastr["error"]("Something went wrong!");

      fetch("/save-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            toastr["success"]("Save successfully!");
          }
        })
        .catch((error) => {
          toastr["error"]("Something went wrong!");
          console.error("Error:", error);
        });
    };
  }
};

function start() {
  addSlideLink();
  handleNavbar();
  handleSave();
}

start();
