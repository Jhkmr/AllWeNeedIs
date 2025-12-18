// Countdown

const targetDate = new Date("2025-12-31T00:00:00");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        clearInterval(timer);
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    // Update only numbers
    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
}

const timer = setInterval(updateCountdown, 1000);
updateCountdown();





const layerDown = document.querySelector(".scroll-layer");
const layerUp   = document.querySelector(".scroll-layer-up");

const wrappersDown = [...document.querySelectorAll(".wrapper-subtitle, .wrapper-info")];
const wrappersUp   = [...document.querySelectorAll(".wrapper-date, .wrapper-img")];

const title    = document.querySelector(".title");
const subtitle = document.querySelector(".kunst");
const subjects = document.querySelectorAll(".subject");
const slanted = document.querySelector(".background-title");
const totalSubjects = subjects.length;


let stageDistanceDown = window.innerHeight * 0.56; // lower scroll height
let stageDistanceUp   = window.innerHeight * 0.44; // upper scroll height

const stageHeight = 150;
const totalStages = 1 + totalSubjects * 2 - 1; //  rotation
let currentStage = 0;
let isScrolling = false;


//Rotation

function updateAnimations(stage) {
    // Title/Subtitle
    if (stage >= 1) {
        title.classList.add("title-rotate");
        subtitle.classList.add("kunst-rotate");
        slanted.classList.add("background-title-rotate");

        setTimeout(() => subtitle.classList.add("kunst-hide"), 200);
    } else {
        title.classList.remove("title-rotate");
        subtitle.classList.remove("kunst-rotate","kunst-hide");
        slanted.classList.remove("background-title-rotate");
    }

    // Subjects
    subjects.forEach((subj, i) => {
        const stage1 = 1 + i; // rotate once stage
        const stage2 = 2 + i; // rotate twice stage

        if (i === subjects.length - 1) {
            // Last subject: rotate only once
            if (stage >= stage1) {
                subj.classList.add("subject-rotate-once");
            } else {
                subj.classList.remove("subject-rotate-once");
            }
            // Never add subject-rotate-twice
            subj.classList.remove("subject-rotate-twice", "subject-hide");
        } else {
            // Other subjects: normal rotate logic
            if (stage >= stage2) {
                subj.classList.remove("subject-rotate-once");
                subj.classList.add("subject-rotate-twice");
                setTimeout(() => subj.classList.add("subject-hide"), 200);
            } else if (stage >= stage1) {
                subj.classList.add("subject-rotate-once");
                subj.classList.remove("subject-rotate-twice","subject-hide");
            } else {
                subj.classList.remove("subject-rotate-once","subject-rotate-twice","subject-hide");
            }
        }
    });
}


//Diagonal Scroll

function applyDiagonal(stage) {
    const maxTranslateDown = -(wrappersDown.length - 1) * stageDistanceDown;
    const maxTranslateUp = -(wrappersUp.length - 1) * stageDistanceUp;

    let translateDown = -stage * stageDistanceDown;
    let translateUp = -stage * stageDistanceUp;

    // Clamp translations
    if (translateDown < maxTranslateDown) translateDown = maxTranslateDown;
    if (translateUp < maxTranslateUp) translateUp = maxTranslateUp;

    layerDown.style.transform = `translateY(${translateDown}px)`;
    layerUp.style.transform   = `translateY(${translateUp}px)`;
}

function updateWrapperVisibility(stage) {

    // Lower diagonal scroll wrappers
    wrappersDown.forEach((el, i) => {
        if (i === stage) el.classList.add("wrapper-active");
        else el.classList.remove("wrapper-active");
    });

    // Upper diagonal scroll wrappers
    wrappersUp.forEach((el, i) => {
        if (i === stage) el.classList.add("wrapper-active");
        else el.classList.remove("wrapper-active");
    });
}

//Sticky Scroll

function scrollToStage(stage) {
    isScrolling = true;

    const maxStage = Math.min(totalStages, wrappersDown.length - 1);
    currentStage = Math.max(0, Math.min(stage, maxStage));

    applyDiagonal(currentStage);
    updateAnimations(currentStage);
    updateWrapperVisibility(currentStage);

    setTimeout(() => { isScrolling = false; }, 350);
}




//Inputs

let wheelAccum = 0;
const wheelThreshold = 30;

window.addEventListener("wheel", e => {
    e.preventDefault();
    if (isScrolling) return;

    wheelAccum += e.deltaY;

    if (wheelAccum > wheelThreshold && currentStage < totalStages) {
        currentStage++;
        wheelAccum = 0;
        scrollToStage(currentStage);
    } else if (wheelAccum < -wheelThreshold && currentStage > 0) {
        currentStage--;
        wheelAccum = 0;
        scrollToStage(currentStage);
    }
}, { passive: false });

let touchStartY = 0;

window.addEventListener("touchstart", e => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener("touchmove", e => {
    if (isScrolling) return;

    const y = e.touches[0].clientY;
    const delta = touchStartY - y;

    if (Math.abs(delta) > 30) {
        if (delta > 0 && currentStage < totalStages) currentStage++;
        else if (delta < 0 && currentStage > 0) currentStage--;

        scrollToStage(currentStage);
        touchStartY = y;
    }
}, { passive: false });


window.addEventListener("load", () => {
    scrollToStage(0);
});

const voteButtons = document.querySelectorAll(".vote button");
const overlay = document.querySelector(".vote-overlay");
const submitText = overlay.querySelector(".email");
const inputField = overlay.querySelector("input");
const closeOverlay = overlay.querySelector(".close-overlay");

const buttonColors = {
    I: "rgb(38, 106, 53)",
    II: "rgb(178, 63, 18)",
    III: "rgb(208, 107, 0)",
    IV: "rgb(255, 255, 255)",
    V: "rgb(47, 81, 144)"
};

let previousColors = {
    subjects: [],
    title: ""
};

voteButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const btnClass = btn.className; // "I", "II", etc.
        const color = buttonColors[btnClass] || "black";

        previousColors = Array.from(subjects).map(subj => subj.style.color || "");
        previousColors.title = title.style.color || "";

        submitText.style.color = color;
        inputField.style.borderColor = color;
        subjects.forEach(subj => {
            subj.style.color = color;
        });
        title.style.color = color;

        closeOverlay.style.color = color;

        // Show overlay
        overlay.classList.remove("hidden");

        // Lock scrolling/interactions
        document.body.style.overflow = "hidden";
        isScrolling = true;
    });
});

closeOverlay.addEventListener("click", () => {
    overlay.classList.add("hidden");

    subjects.forEach((subj, i) => {
        subj.style.color = previousColors[i];
    });
    title.style.color = previousColors.title;

    // Re-enable scrolling and interactions
    document.body.style.overflow = "";
    isScrolling = false;
});



//Resize

window.addEventListener("resize", () => {
    stageDistanceDown = window.innerHeight * 0.56;
    stageDistanceUp   = window.innerHeight * 0.44;
    scrollToStage(currentStage);
});
