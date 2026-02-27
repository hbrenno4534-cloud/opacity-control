const starsBackground = document.querySelector(".background_star");
const STAR_COUNT = 50;

if (starsBackground) {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < STAR_COUNT; i += 1) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = `${Math.random() * 100}%`;
        star.style.bottom = `${Math.random() * -100}px`;
        star.style.animationDuration = `${5 + Math.random() * 10}s`;
        star.style.width = `${1 + Math.random() * 2}px`;
        star.style.height = star.style.width;
        fragment.appendChild(star);
    }

    starsBackground.appendChild(fragment);
}
