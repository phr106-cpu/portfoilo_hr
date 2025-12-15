const intro_page = document.querySelector(".intro_page");
const unboxing_page = document.querySelector(".unboxing_page");
const album_box = document.querySelector(".album_box");
const hover_label = document.querySelector(".hover_label");

// 전체 화면에서 마우스 움직임 감지
window.addEventListener("mousemove", function (e) {
  hover_label.style.left = e.clientX + 15 + "px";
  hover_label.style.top = e.clientY + 15 + "px";
});

// 앨범에 올리면 보이기
album_box.addEventListener("mouseenter", function () {
  hover_label.style.opacity = "1";
});

// 앨범에서 나가면 숨기기
album_box.addEventListener("mouseleave", function () {
  hover_label.style.opacity = "0";
});

// 클릭
album_box.addEventListener("click", function () {
  intro_page.classList.remove("active");
  unboxing_page.classList.add("active");
});
