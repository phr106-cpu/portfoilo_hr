(function () {
  "use strict";

  console.log("=== JS 파일 로드 ===", new Date().getTime());

  document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM 준비 완료");

    const intro_page = document.querySelector(".intro_page");
    const unboxing_page = document.querySelector(".unboxing_page");
    const album_contents = document.querySelector(".album_contents");
    const album_box = document.querySelector(".album_box");
    const hover_label = document.querySelector(".hover_label");

    let isScrolling = false;
    const labels = document.querySelectorAll(".item_hover_label");
    console.log("라벨 개수:", labels.length);

    // 마우스 움직임 - pageX/Y 사용
    document.addEventListener("mousemove", function (e) {
      const x = e.pageX || e.clientX; // pageX 우선, 없으면 clientX
      const y = e.pageY || e.clientY;

      if (hover_label) {
        hover_label.style.left = x + 10 + "px";
        hover_label.style.top = y + 10 + "px";
      }

      labels.forEach(function (label) {
        label.style.left = x + 10 + "px";
        label.style.top = y + 10 + "px";
      });
    });

    // 각 아이템 호버
    document.querySelectorAll(".content_item").forEach(function (item) {
      const label = item.querySelector(".item_hover_label");
      if (!label) return;

      item.addEventListener("mouseenter", function () {
        label.style.opacity = "1";
        console.log("호버 들어옴");
      });

      item.addEventListener("mouseleave", function () {
        label.style.opacity = "0";
      });
    });

    // 인트로 앨범
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

    // 스크롤
    if (unboxing_page) {
      unboxing_page.addEventListener("wheel", function (e) {
        if (!unboxing_page.classList.contains("active") || isScrolling) return;
        if (e.deltaY > 0) {
          isScrolling = true;
          unboxing_page.classList.add("scroll_down");
          album_contents.classList.add("scroll_up", "active");
          setTimeout(function () {
            unboxing_page.classList.remove("active", "scroll_down");
            album_contents.classList.remove("scroll_up");
            isScrolling = false;
          }, 600);
        }
      });
    }

    if (album_contents) {
      album_contents.addEventListener("wheel", function (e) {
        if (!album_contents.classList.contains("active") || isScrolling) return;
        if (e.deltaY < 0) {
          isScrolling = true;
          album_contents.classList.add("scroll_down_back");
          unboxing_page.classList.add("scroll_up_back", "active");
          setTimeout(function () {
            album_contents.classList.remove("active", "scroll_down_back");
            unboxing_page.classList.remove("scroll_up_back");
            isScrolling = false;
          }, 600);
        }
      });
    }

    console.log("=== 모든 이벤트 등록 완료 ===");
  });
})();
// CD 클릭 팝업
const cdTrigger = document.getElementById("cd_trigger");
const popupOverlay = document.getElementById("popup_overlay");

if (cdTrigger && popupOverlay) {
  cdTrigger.addEventListener("click", function (e) {
    // 호버 라벨 클릭이 아닌 경우에만
    if (!e.target.classList.contains("item_hover_label")) {
      popupOverlay.classList.add("active");
      console.log("팝업 열림");
    }
  });

  // 오버레이 클릭시 닫기
  popupOverlay.addEventListener("click", function (e) {
    if (e.target === popupOverlay) {
      popupOverlay.classList.remove("active");
    }
  });

  // YES/NO 버튼
  const yesBtn = document.querySelector(".popup_yes");
  const noBtn = document.querySelector(".popup_no");

  if (yesBtn) {
    yesBtn.addEventListener("click", function () {
      console.log("YES 클릭");
      popupOverlay.classList.remove("active");
      // 여기에 YES 동작 추가
    });
  }

  if (noBtn) {
    noBtn.addEventListener("click", function () {
      console.log("NO 클릭");
      popupOverlay.classList.remove("active");
      // 여기에 NO 동작 추가
    });
  }
}
