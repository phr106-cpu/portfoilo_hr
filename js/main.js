const intro_page = document.querySelector('.intro_page');
const unboxing_page = document.querySelector('.unboxing_page');
const album_box = document.querySelector('.album_box');
const hover_label = document.querySelector('.hover_label');

let is_hovering = false;

// 앨범에 마우스 올렸을 때
album_box.addEventListener('mouseenter', () => {
    is_hovering = true;
});

// 앨범에서 마우스 벗어났을 때
album_box.addEventListener('mouseleave', () => {
    is_hovering = false;
});

// 마우스 움직임 추적
document.addEventListener('mousemove', (e) => {
    if (is_hovering) {
        hover_label.style.left = e.clientX + 20 + 'px';
        hover_label.style.top = e.clientY + 20 + 'px';
    }
});

// 앨범 클릭 시 다음 페이지로 전환
album_box.addEventListener('click', () => {
    intro_page.classList.remove('active');
    unboxing_page.classList.add('active');
});

// 별 클릭 효과
const stars = document.querySelectorAll('.star');
stars.forEach(star => {
    star.addEventListener('click', () => {
        star.style.animation = 'none';
        setTimeout(() => {
            star.style.animation = '';
        }, 10);
    });
});