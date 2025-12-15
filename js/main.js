const intro_page = document.querySelector(".intro_page");
const unboxing_page = document.querySelector(".unboxing_page");
const album_contents = document.querySelector(".album_contents");
const album_box = document.querySelector(".album_box");
const hover_label = document.querySelector(".hover_label");

let isScrolling = false;

// 전체 화면에서 마우스 움직임 감지 - 인트로 라벨
window.addEventListener("mousemove", function (e) {
  if (hover_label) {
    hover_label.style.left = e.clientX + 15 + "px";
    hover_label.style.top = e.clientY + 15 + "px";
  }

  // 앨범 구성품 페이지 라벨들
  const item_hover_labels = document.querySelectorAll(".item_hover_label");
  item_hover_labels.forEach(function (label) {
    label.style.left = e.clientX + 15 + "px";
    label.style.top = e.clientY + 15 + "px";
  });
});

// 앨범에 올리면 보이기
if (album_box) {
  album_box.addEventListener("mouseenter", function () {
    hover_label.style.opacity = "1";
  });

  album_box.addEventListener("mouseleave", function () {
    hover_label.style.opacity = "0";
  });

  album_box.addEventListener("click", function () {
    intro_page.classList.remove("active");
    unboxing_page.classList.add("active");
  });
}

// 스크롤 기능
if (unboxing_page) {
  unboxing_page.addEventListener("wheel", function (e) {
    if (!unboxing_page.classList.contains("active")) return;
    if (isScrolling) return;

    if (e.deltaY > 0) {
      isScrolling = true;

      unboxing_page.classList.add("scroll_down");
      album_contents.classList.add("scroll_up");
      album_contents.classList.add("active");

      setTimeout(function () {
        unboxing_page.classList.remove("active");
        unboxing_page.classList.remove("scroll_down");
        album_contents.classList.remove("scroll_up");
        isScrolling = false;
      }, 600);
    }
  });
}

if (album_contents) {
  album_contents.addEventListener("wheel", function (e) {
    if (!album_contents.classList.contains("active")) return;
    if (isScrolling) return;

    if (e.deltaY < 0) {
      isScrolling = true;

      album_contents.classList.add("scroll_down_back");
      unboxing_page.classList.add("scroll_up_back");
      unboxing_page.classList.add("active");

      setTimeout(function () {
        album_contents.classList.remove("active");
        album_contents.classList.remove("scroll_down_back");
        unboxing_page.classList.remove("scroll_up_back");
        isScrolling = false;
      }, 600);
    }
  });
}

// 마우스 따라다니기
document.addEventListener("mousemove", function (e) {
  const labels = document.querySelectorAll(".item_hover_label");
  labels.forEach(function (label) {
    label.style.left = e.clientX + 10 + "px";
    label.style.top = e.clientY + 10 + "px";
  });
});
