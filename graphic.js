
// 預載圖片並解碼，避免點擊時卡頓
function preloadImage(src) {
    const img = new Image();
    img.src = src;
    img.decoding = 'async';
}

function rafThrottle(fn) {
    let ticking = false;
    return function (...args) {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                fn.apply(this, args);
                ticking = false;
            });
        }
    };
}

/* =======================
   Visual Communication Design
   Carousel + Modal
   ======================= */
document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.carousel-item');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const closeBtn = document.querySelector('.close-modal');
    const nextBtn = document.querySelector('.control-btn.next');
    const prevBtn = document.querySelector('.control-btn.prev');
    const visualSection = document.querySelector('.visual-comm');

    let activeIndex = 3;


    const layout = rafThrottle(() => {
        items.forEach((item, index) => {
            const diff = index - activeIndex;
            const translateX = diff * 180;
            const scale = 1 - Math.abs(diff) * 0.15;
            const opacity = Math.max(1 - Math.abs(diff) * 0.3, 0);

            item.style.transform = `translateX(${translateX}px) scale(${scale})`;
            item.style.zIndex = 100 - Math.abs(diff);
            item.style.opacity = opacity;
            item.style.filter = diff === 0 ? 'brightness(1)' : 'brightness(0.6)';
            item.style.cursor = 'pointer';
        });
    });


    items.forEach((item, index) => {
        const imgSrc = item.querySelector('img').src;
        preloadImage(imgSrc);

        item.addEventListener('click', () => {
            const diff = index - activeIndex;

            if (diff === 0) {
                modalImg.src = imgSrc;
                modalCaption.textContent = item.dataset.description || '';
                modal.classList.add('active');
            } else {
                activeIndex = index;
                layout();
            }
        });
    });

    
    nextBtn.addEventListener('click', () => {
        activeIndex = (activeIndex + 1) % items.length;
        layout();
    });

    prevBtn.addEventListener('click', () => {
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        layout();
    });

    
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.classList.remove('active');
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') modal.classList.remove('active');
    });

    
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            layout();
            observer.disconnect();
        }
    }, { threshold: 0.2 });

    observer.observe(visualSection);
});

/* =======================
   Branding Design
   Thumbnail Interaction
   ======================= */

const thumbItems = document.querySelectorAll('.thumb-item');
const mainImg = document.getElementById('branding-main-img');
const mainTitle = document.getElementById('branding-title');
const mainDesc = document.getElementById('branding-desc');


thumbItems.forEach(thumb => {
    preloadImage(thumb.dataset.full);
});

thumbItems.forEach(thumb => {
    thumb.addEventListener('click', function () {

        thumbItems.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const newSrc = this.dataset.full;
        const newTitle = this.dataset.title;
        const newDesc = this.dataset.desc;


        mainImg.style.opacity = '0';
        mainTitle.style.opacity = '0';
        mainDesc.style.opacity = '0';

  
        setTimeout(() => {
            mainImg.src = newSrc;
            mainTitle.textContent = newTitle;
            mainDesc.textContent = newDesc;

     
            mainImg.style.opacity = '1';
            mainTitle.style.opacity = '1';
            mainDesc.style.opacity = '1';
        }, 250);
    });
});
