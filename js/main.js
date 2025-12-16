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
    const box_animation_page = document.querySelector(".box_animation_page");

    let isScrolling = false;
    const labels = document.querySelectorAll(".item_hover_label");
    console.log("라벨 개수:", labels.length);

    // 마우스 움직임
    document.addEventListener("mousemove", function (e) {
      const x = e.pageX || e.clientX;
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

    // unboxing 스크롤 (아래로만)
    if (unboxing_page) {
      unboxing_page.addEventListener("wheel", function (e) {
        if (!unboxing_page.classList.contains("active") || isScrolling) return;
        if (e.deltaY > 0) {
          e.preventDefault();
          isScrolling = true;

          unboxing_page.classList.add("scroll_down");
          album_contents.classList.add("scroll_up", "active");

          setTimeout(function () {
            unboxing_page.classList.remove("active");
          }, 300);

          setTimeout(function () {
            unboxing_page.classList.remove("scroll_down");
            album_contents.classList.remove("scroll_up");
            isScrolling = false;
          }, 600);
        }
      });
    }

    // album_contents 스크롤 (위/아래 둘 다)
    if (album_contents) {
      album_contents.addEventListener("wheel", function (e) {
        if (!album_contents.classList.contains("active") || isScrolling) return;

        // 위로 스크롤 (unboxing으로)
        if (e.deltaY < 0) {
          e.preventDefault();
          isScrolling = true;

          album_contents.classList.add("scroll_down_back");
          unboxing_page.classList.add("scroll_up_back", "active");
          setTimeout(function () {
            album_contents.classList.remove("active", "scroll_down_back");
            unboxing_page.classList.remove("scroll_up_back");
            isScrolling = false;
          }, 600);
        }

        // 아래로 스크롤 (박스 애니메이션으로)
        if (e.deltaY > 0) {
          e.preventDefault();
          isScrolling = true;

          album_contents.classList.add("scroll_down");
          box_animation_page.classList.add("scroll_up", "active");

          setTimeout(function () {
            album_contents.classList.remove("scroll_down");
            box_animation_page.classList.remove("scroll_up");
            isScrolling = false;
          }, 600);

          // GSAP 애니메이션 시작 (한 번만 실행)
          setTimeout(function () {
            if (typeof gsap !== "undefined" && !window.boxAnimationPlayed) {
              window.boxAnimationPlayed = true;
              gsap.timeline()
                .add(boxIn())
                .add(cardAnimation(), "-=0.5"); // 카드 애니메이션을 한 번만 실행
            }
          }, 400);
        }
      });
    }

    // 박스 애니메이션 페이지에서 위로 스크롤
    if (box_animation_page) {
      box_animation_page.addEventListener("wheel", function (e) {
        if (!box_animation_page.classList.contains("active") || isScrolling)
          return;
        if (e.deltaY < 0) {
          e.preventDefault();
          isScrolling = true;
          box_animation_page.classList.add("scroll_down_back");
          album_contents.classList.add("scroll_up_back", "active");
          setTimeout(function () {
            box_animation_page.classList.remove("active", "scroll_down_back");
            album_contents.classList.remove("scroll_up_back");
            isScrolling = false;
          }, 600);
        }
      });
    }

    // ===== ID 카드 팝업 =====
    const keyringItem = document.querySelector(".keyring_item");
    const idcardOverlay = document.getElementById("idcard_overlay");
    const backToAlbumIdcard = document.querySelector(".back_to_album_idcard");

    // 키링 클릭
    if (keyringItem && idcardOverlay) {
      keyringItem.addEventListener("click", function (e) {
        if (!e.target.classList.contains("item_hover_label")) {
          idcardOverlay.classList.add("active");
        }
      });
    }

    // 뒤로가기 버튼
    if (backToAlbumIdcard && idcardOverlay) {
      backToAlbumIdcard.addEventListener("click", function () {
        idcardOverlay.classList.remove("active");
      });
    }

    // 오버레이 클릭시 닫기
    if (idcardOverlay) {
      idcardOverlay.addEventListener("click", function (e) {
        if (e.target === idcardOverlay) {
          idcardOverlay.classList.remove("active");
        }
      });
    }

    console.log("=== 모든 이벤트 등록 완료 ===");

    // ===== 팝업 관련 =====
    const cdTrigger = document.getElementById("cd_trigger");
    const popupOverlay = document.getElementById("popup_overlay");
    const loadingOverlay = document.getElementById("loading_overlay");
    const completeOverlay = document.getElementById("complete_overlay");
    const progressBar = document.getElementById("progress_bar");
    const progressPercent = document.getElementById("progress_percent");
    const yesBtn = document.querySelector(".popup_yes");
    const noBtn = document.querySelector(".popup_no");
    const completeOk = document.querySelector(".complete_ok");
    const projectPage = document.querySelector(".project_page");
    const previewImage = document.getElementById("preview_image");

    // CD 클릭
    if (cdTrigger && popupOverlay) {
      cdTrigger.addEventListener("click", function (e) {
        if (!e.target.classList.contains("item_hover_label")) {
          popupOverlay.classList.add("active");
        }
      });

      // 오버레이 클릭시 닫기
      popupOverlay.addEventListener("click", function (e) {
        if (e.target === popupOverlay) {
          popupOverlay.classList.remove("active");
        }
      });
    }

    // YES 버튼
    if (yesBtn) {
      yesBtn.addEventListener("click", function () {
        popupOverlay.classList.remove("active");

        setTimeout(function () {
          loadingOverlay.classList.add("active");

          let progress = 0;
          const duration = 2000;
          const interval = 30;
          const step = 100 / (duration / interval);

          const progressInterval = setInterval(function () {
            progress += step;
            if (progress >= 100) {
              progress = 100;
              clearInterval(progressInterval);

              progressPercent.style.opacity = "0";

              setTimeout(function () {
                loadingOverlay.classList.remove("active");

                setTimeout(function () {
                  completeOverlay.classList.add("active");
                }, 300);

                progressBar.style.width = "0%";
                progressPercent.textContent = "0%";
                progressPercent.style.opacity = "1";
              }, 500);
            }

            progressBar.style.width = progress + "%";
            progressPercent.textContent = Math.floor(progress) + "%";
          }, interval);
        }, 300);
      });
    }

    // NO 버튼
    if (noBtn) {
      noBtn.addEventListener("click", function () {
        popupOverlay.classList.remove("active");
      });
    }

    // OK 버튼
    if (completeOk) {
      completeOk.addEventListener("click", function () {
        completeOverlay.classList.remove("active");
        album_contents.classList.remove("active");
        setTimeout(function () {
          projectPage.classList.add("active");
          // 프로젝트 페이지가 활성화되면 첫 번째 트랙 선택
          setTimeout(function () {
            selectTrack(0);
          }, 100);
        }, 300);
      });
    }

    // ===== 트랙 네비게이션 기능 =====
    const trackItems = document.querySelectorAll(".track_item");
    let currentTrackIndex = 0;

    // 트랙 선택 함수
    function selectTrack(index) {
      console.log("트랙 선택:", index);

      // 모든 트랙에서 active 클래스 제거
      trackItems.forEach(function (item) {
        item.classList.remove("active");
      });

      // 현재 트랙에 active 클래스 추가
      if (trackItems[index]) {
        trackItems[index].classList.add("active");

        // 이미지 변경
        const imageUrl = trackItems[index].getAttribute("data-image");
        console.log("이미지 URL:", imageUrl);
        if (imageUrl && previewImage) {
          previewImage.src = imageUrl;
        }

        currentTrackIndex = index;
      }
    }

    // 트랙 아이템 클릭
    trackItems.forEach(function (item, index) {
      item.addEventListener("click", function () {
        console.log("트랙 클릭:", index);
        selectTrack(index);
      });
    });

    // 트랙 호버 (기존 기능 유지)
    trackItems.forEach(function (item) {
      item.addEventListener("mouseenter", function () {
        const imageUrl = item.getAttribute("data-image");
        if (imageUrl && previewImage) {
          previewImage.src = imageUrl;
        }
      });

      item.addEventListener("mouseleave", function () {
        // 호버가 끝나면 현재 선택된 트랙의 이미지로 복원
        const currentImageUrl =
          trackItems[currentTrackIndex].getAttribute("data-image");
        if (currentImageUrl && previewImage) {
          previewImage.src = currentImageUrl;
        }
      });
    });

    // 뒤로가기 버튼
    const backToAlbum = document.querySelector(".back_to_album");
    if (backToAlbum) {
      backToAlbum.addEventListener("click", function () {
        projectPage.classList.remove("active");
        setTimeout(function () {
          album_contents.classList.add("active");
        }, 300);
      });
    }
  });
})();

function boxIn() {
  let tl = gsap.timeline()
    .fromTo(".box",
      { rotationY: -540, y: "100vh" },
      { duration: 2, rotationY: 0, y: "10vh", ease: "power2" }
    )
    .to(".box__lid", {
      rotateX: -225,
      duration: 0.5,
      ease: "sine.inOut",
      y: 2 // 👈 이 부분 추가 (뚜껑을 아래로 3px)
    }, "-=1.4")
    .to(".box__lid-flap", {
      rotateX: 60,
      duration: 0.5,
      ease: "sine.inOut"
    }, "-=1.2")
    .to(".box__flap--left", {
      rotateX: "-=135",
      duration: 0.5,
      ease: "sine.inOut",
      transformOrigin: "50% 100%"
    }, "-=1")
    .to(".box__flap--right", {
      rotateX: "-=135",
      duration: 0.5,
      ease: "sine.inOut",
      transformOrigin: "50% 100%"
    }, "-=1");
  return tl;
}

function cardAnimation() {
  let tl = gsap
    .timeline({
      repeat: 0,
      onComplete: function () {
        // 카드 애니메이션 끝나면 Thanks 페이지로 자동 이동
        setTimeout(function () {
          const box_animation_page = document.querySelector(".box_animation_page");
          const thanks_streaming_page = document.querySelector(".thanks_streaming_page");

          if (box_animation_page && thanks_streaming_page) {
            box_animation_page.classList.remove("active");
            thanks_streaming_page.classList.add("active");
          }
        }, 500);
      }
    })
    .to(".box", { rotateY: 180, ease: "power2.inOut", duration: 0.8 })
    // 카드 5개 펼치기
    .to(
      ".card--1",
      {
        keyframes: [
          {
            duration: 0.4,
            y: "-155%",
            transformOrigin: "center bottom",
            ease: "sine",
          },
          {
            duration: 0.6,
            rotation: 50,
            x: "40%",
            ease: "power2",
            delay: -0.25,
          },
        ],
      },
      0.2
    )
    .to(
      ".card--2",
      {
        keyframes: [
          {
            duration: 0.4,
            y: "-160%",
            transformOrigin: "center bottom",
            ease: "sine",
          },
          {
            duration: 0.6,
            rotation: 25,
            x: "20%",
            ease: "power2",
            delay: -0.25,
          },
        ],
      },
      0.2
    )
    .to(
      ".card--3",
      {
        keyframes: [
          {
            duration: 0.4,
            y: "-160%",
            transformOrigin: "center bottom",
            ease: "sine",
          },
          {
            duration: 0.6,
            rotation: 0,
            x: "0%",
            ease: "power2",
            delay: -0.25,
          },
        ],
      },
      0.2
    )
    .to(
      ".card--4",
      {
        keyframes: [
          {
            duration: 0.4,
            y: "-160%",
            transformOrigin: "center bottom",
            ease: "sine",
          },
          {
            duration: 0.6,
            rotation: -25,
            x: "-20%",
            ease: "power2",
            delay: -0.25,
          },
        ],
      },
      0.2
    )
    .to(
      ".card--5",
      {
        keyframes: [
          {
            duration: 0.4,
            y: "-155%",
            transformOrigin: "center bottom",
            ease: "sine",
          },
          {
            duration: 0.6,
            rotation: -50,
            x: "-40%",
            ease: "power2",
            delay: -0.25,
          },
        ],
      },
      0.2
    )
    // 카드 5개 다시 넣기
    .to(
      ".card--1",
      {
        keyframes: [
          { duration: 0.6, rotation: 0, x: "0%", ease: "power2.in" },
          {
            duration: 0.4,
            y: "0%",
            transformOrigin: "center bottom",
            ease: "sine.in",
            delay: -0.25,
          },
        ],
      },
      1.4
    )
    .to(
      ".card--2",
      {
        keyframes: [
          { duration: 0.6, rotation: 0, x: "0%", ease: "power2.in" },
          {
            duration: 0.4,
            y: "0%",
            transformOrigin: "center bottom",
            ease: "sine.in",
            delay: -0.25,
          },
        ],
      },
      1.4
    )
    .to(
      ".card--3",
      {
        keyframes: [
          { duration: 0.6, rotation: 0, x: "0%", ease: "power2.in" },
          {
            duration: 0.4,
            y: "0%",
            transformOrigin: "center bottom",
            ease: "sine.in",
            delay: -0.25,
          },
        ],
      },
      1.4
    )
    .to(
      ".card--4",
      {
        keyframes: [
          { duration: 0.6, rotation: 0, x: "0%", ease: "power2.in" },
          {
            duration: 0.4,
            y: "0%",
            transformOrigin: "center bottom",
            ease: "sine.in",
            delay: -0.25,
          },
        ],
      },
      1.4
    )
    .to(
      ".card--5",
      {
        keyframes: [
          { duration: 0.6, rotation: 0, x: "0%", ease: "power2.in" },
          {
            duration: 0.4,
            y: "0%",
            transformOrigin: "center bottom",
            ease: "sine.in",
            delay: -0.25,
          },
        ],
      },
      1.4
    )
    .to(".box", { rotateY: 360, ease: "power2.inOut", duration: 0.8 }, 1.6);

  return tl;
}

// ===== POSTER 페이지로 이동 + 스크롤 reveal =====
document.addEventListener("DOMContentLoaded", function () {
  const posterItem = document.querySelector(".poster_item");
  const posterPage = document.querySelector(".poster_page");
  const posterScroll = document.getElementById("posterScroll");
  const posterReveals = document.querySelectorAll(".poster_reveal");
  const album_contents = document.querySelector(".album_contents");

  function updatePosterReveal() {
    const posterStage = document.getElementById("posterStage");
    if (!posterStage) return;

    const stageRect = posterStage.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // 스크롤 진행도 계산 (0 ~ 1)
    const scrollProgress = Math.max(
      0,
      Math.min(
        1,
        (viewportHeight - stageRect.top) /
        (viewportHeight * 3 + stageRect.height)
      )
    );

    // 현재 스텝 계산
    const maxStep = 19;
    const currentStep = Math.floor(scrollProgress * (maxStep + 1));

    posterReveals.forEach((el) => {
      const step = Number(el.dataset.step);
      if (step <= currentStep) {
        el.classList.add("show");
      } else {
        el.classList.remove("show");
      }
    });
  }

  // 윈도우 스크롤 이벤트
  window.addEventListener("scroll", function () {
    if (posterPage && posterPage.classList.contains("active")) {
      updatePosterReveal();
    }
  });

  if (posterItem && posterPage && album_contents) {
    posterItem.addEventListener("click", function () {
      console.log("포스터 아이템 클릭됨");
      album_contents.classList.remove("active");

      setTimeout(function () {
        posterPage.classList.add("active");
        document.body.style.overflow = "auto";
        window.scrollTo(0, 0);

        setTimeout(function () {
          updatePosterReveal();
        }, 50);
      }, 300);
    });
  }

  // 포스터 페이지 뒤로가기 버튼
  const backToAlbumPoster = document.querySelector(".back_to_album_poster");
  if (backToAlbumPoster && posterPage && album_contents) {
    backToAlbumPoster.addEventListener("click", function () {
      posterPage.classList.remove("active");
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);

      setTimeout(function () {
        album_contents.classList.add("active");
      }, 300);
    });
  }
});

// ===== THANKS STREAMING 페이지 자동 애니메이션 =====
document.addEventListener("DOMContentLoaded", function () {
  const thanksPage = document.querySelector(".thanks_streaming_page");
  const thanksTexts = document.querySelectorAll(".thanks_text");
  const thanksSignImg = document.querySelector(".thanks_sign_img");

  // Thanks 페이지가 활성화될 때 순차적으로 애니메이션
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (thanksPage.classList.contains("active")) {
        // 각 텍스트를 순차적으로 표시
        thanksTexts.forEach(function (text, index) {
          setTimeout(function () {
            text.classList.add("show");
          }, index * 300); // 300ms 간격으로 순차 표시
        });

        // 싸인은 마지막 텍스트 바로 다음에 표시
        setTimeout(function () {
          if (thanksSignImg) {
            thanksSignImg.classList.add("show");
          }
        }, thanksTexts.length * 300);

        // 한 번만 실행되도록 observer 해제
        observer.disconnect();
      }
    });
  });

  // thanksPage의 class 변경 감지
  observer.observe(thanksPage, {
    attributes: true,
    attributeFilter: ["class"]
  });
});