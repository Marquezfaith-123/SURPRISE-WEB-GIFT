
document.addEventListener("DOMContentLoaded", () => {
    const photoPaths = Array.from(
        { length: 11 },
        (_, i) => `assets/memo${i + 1}.jpg`
    );

    let photoIndex = 0;
    let lastTime = 0;
    const delay = 180;

     // Music controls
    const song = document.getElementById("ourSong");
    const musicButton = document.getElementById("musicToggle");

    if (song && musicButton) {
        musicButton.addEventListener("click", async () => {
            if (song.paused) {
                try {
                    await song.play();
                    musicButton.textContent = "❚❚ Pause music";
                    musicButton.setAttribute("aria-pressed", "true");
                } catch (error) {
                    console.error("Could not play music:", error);
                    musicButton.textContent = "▶ Try again";
                }
            } else {
                song.pause();
                musicButton.textContent = "▶ Play music";
                musicButton.setAttribute("aria-pressed", "false");
            }
        });
    }
});
    document.addEventListener("pointermove", (event) => {
        // Ignore touch movement; use a mouse or trackpad.
        if (event.pointerType === "touch") return;

        const now = Date.now();
        if (now - lastTime < delay) return;
        lastTime = now;

        const photo = new Image();
        photo.src = photoPaths[photoIndex];
        photo.alt = "";
        photo.className = "cursor-memory";
        photo.setAttribute("aria-hidden", "true");
        photo.draggable = false;

        photoIndex = (photoIndex + 1) % photoPaths.length;

        // Wait until the image is ready before displaying it.
        photo.onload = () => {
            photo.style.left = `${event.clientX}px`;
            photo.style.top = `${event.clientY}px`;
            document.body.appendChild(photo);

            photo.addEventListener("animationend", () => {
                photo.remove();
            }, { once: true });

            // Backup cleanup
            setTimeout(() => photo.remove(), 2500);
        };

        photo.onerror = () => {
            console.error("Could not load cursor photo:", photo.src);
        };
    });