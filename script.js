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
    //Title/Subtitle
    if (stage >= 1) {
        title.classList.add("title-rotate");
        subtitle.classList.add("kunst-rotate");
        slanted.classList.add("background-title-rotate");
    } else {
        title.classList.remove("title-rotate");
        subtitle.classList.remove("kunst-rotate");
        slanted.classList.remove("background-title-rotate");
    }

      // Subjects
  subjects.forEach((subj, i) => {
    const stage1 = 1 + i; // first rotation
    const stage2 = 2 + i; // second rotation

    if (stage >= stage2) {
      // Second rotation
      subj.classList.remove("subject-rotate-once");
      subj.classList.add("subject-rotate-twice");
    } else if (stage >= stage1) {
      // First rotation
      subj.classList.add("subject-rotate-once");
      subj.classList.remove("subject-rotate-twice");
    } else {
      // Not yet rotated
      subj.classList.remove("subject-rotate-once");
      subj.classList.remove("subject-rotate-twice");
    }
  });

}

//Diagonal Scroll

function applyDiagonal(stage) {
    layerDown.style.transform = `translateY(${-stage * stageDistanceDown}px)`;
    layerUp.style.transform   = `translateY(${-stage * stageDistanceUp}px)`;
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

    currentStage = Math.max(0, Math.min(stage, Math.max(totalStages, wrappersDown.length - 1)));

    applyDiagonal(currentStage);
    updateAnimations(currentStage);

    // Fade wrappers
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

//Resize

window.addEventListener("resize", () => {
    stageDistanceDown = window.innerHeight * 0.56;
    stageDistanceUp   = window.innerHeight * 0.44;
    scrollToStage(currentStage);
});
