const starsBackground = document.querySelector(".background_star");
const STAR_COUNT = 50;

if (starsBackground) {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < STAR_COUNT; i += 1) {
        const star = document.createElement("img");
        star.className = "star";
        star.src = "images/dollar.png";
        star.alt = "";
        star.style.left = `${Math.random() * 100}%`;
        star.style.bottom = `${Math.random() * -100}px`;
        star.style.animationDuration = `${5 + Math.random() * 10}s`;
        const size = 20 + Math.random() * 25;
        star.style.width = `${size}px`;
        star.style.height = `auto`;
        fragment.appendChild(star);
    }

    starsBackground.appendChild(fragment);
}
