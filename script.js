const INTRO_FIRST =
  "Dear Chinmayee, I have a question to ask you. But before that, you must answer some questions yourself.";
const INTRO_SECOND = "Let's begin.";

const INITIAL_QUESTION = "what do u prefer between the two?";
const INITIAL_OPTIONS = ["tiramisu", "banoffee pie"];

const REPLACEMENT_OPTIONS = [
  "chilli oil dimsums",
  "kartography",
  "mom's rajma chawal",
  "bralette",
  "summer",
  "eclairs",
  "timothee",
  "warm blanket",
  "clear light of day",
  "in custody",
  "the namesake",
  "interpretor of maladies",
  "baskin robbins cotton candy",
];

document.addEventListener("DOMContentLoaded", () => {
  const introSection = document.getElementById("intro");
  const introTextEl = document.getElementById("intro-text");
  const questionSection = document.getElementById("question-section");
  const questionTextEl = document.getElementById("question-text");
  const optionLeftBtn = document.getElementById("option-left");
  const optionRightBtn = document.getElementById("option-right");
  const successSection = document.getElementById("success-section");
  const confettiContainer = document.getElementById("confetti-container");
  const muteToggleBtn = document.getElementById("mute-toggle");
  const bgMusic = document.getElementById("bg-music");

  if (
    !introSection ||
    !introTextEl ||
    !questionSection ||
    !questionTextEl ||
    !optionLeftBtn ||
    !optionRightBtn ||
    !successSection ||
    !confettiContainer ||
    !muteToggleBtn ||
    !bgMusic
  ) {
    return;
  }

  let favoriteChoice = null;
  let favoriteButton = null;
  let changingButton = null;
  let nextIndex = 0;
  let inFinalStep = false;
  let musicStarted = false;
  let awaitingGesture = false;

  runIntroSequence().then(startQuestions);

  function typeText(element, text, speed = 60) {
    return new Promise((resolve) => {
      element.textContent = "";
      element.classList.add("intro__text--visible");
      let i = 0;

      function nextChar() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i += 1;
          setTimeout(nextChar, speed);
        } else {
          resolve();
        }
      }

      nextChar();
    });
  }

  function fadeOutIntroText() {
    return new Promise((resolve) => {
      introTextEl.classList.remove("intro__text--visible");
      setTimeout(() => {
        introTextEl.textContent = "";
        resolve();
      }, 1000);
    });
  }

  async function runIntroSequence() {
    questionSection.classList.add("hidden");
    successSection.classList.add("hidden");
    introSection.classList.remove("hidden");
    introSection.classList.add("visible");

    await typeText(introTextEl, INTRO_FIRST);
    await fadeOutIntroText();

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await typeText(introTextEl, INTRO_SECOND);
    await fadeOutIntroText();

    // longer pause after "Let's begin." fades out
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  function startQuestions() {
    introSection.classList.add("hidden");
    introSection.classList.remove("visible");

    questionSection.classList.remove("hidden");
    questionSection.classList.add("visible");

    // trigger a slightly slower fade-in for the card after the intro
    requestAnimationFrame(() => {
      questionSection.classList.add("question--visible");
    });

    // start background music when the first question card appears
    playMusic();

    questionTextEl.textContent = INITIAL_QUESTION;
    optionLeftBtn.textContent = INITIAL_OPTIONS[0];
    optionRightBtn.textContent = INITIAL_OPTIONS[1];

    optionLeftBtn.addEventListener("click", () => {
      handleOptionClick(optionLeftBtn, optionRightBtn);
    });
    optionRightBtn.addEventListener("click", () => {
      handleOptionClick(optionRightBtn, optionLeftBtn);
    });
  }

  function handleOptionClick(clickedButton, otherButton) {
    if (inFinalStep) {
      // In final step, either choice leads to the animation
      handleYesClick();
      return;
    }

    favoriteChoice = clickedButton.textContent;
    favoriteButton = clickedButton;
    changingButton = otherButton;

    favoriteButton.textContent = favoriteChoice;

    if (nextIndex >= REPLACEMENT_OPTIONS.length) {
      enterFinalStep();
      return;
    }

    const nextLabel = REPLACEMENT_OPTIONS[nextIndex];
    changingButton.textContent = nextLabel;
    nextIndex += 1;
  }

  function enterFinalStep() {
    inFinalStep = true;
    // Keep the same question text, just change options
    questionTextEl.textContent = INITIAL_QUESTION;
    optionLeftBtn.textContent = "u being my girlfriend";
    optionRightBtn.textContent = "me being your boyfriend";
  }

  function handleYesClick() {
    questionSection.classList.add("hidden");
    questionSection.classList.remove("visible");

    successSection.classList.remove("hidden");
    successSection.classList.add("visible");

    startConfetti(confettiContainer);
  }

  function startConfetti(container) {
    const colors = ["#ff86b1", "#ffd1e0", "#c7a5ff", "#fff5a5", "#9de3ff"];
    const pieceCount = 80;

    for (let i = 0; i < pieceCount; i += 1) {
      const piece = document.createElement("div");
      piece.classList.add("confetti-piece");

      const color = colors[i % colors.length];
      piece.style.backgroundColor = color;
      piece.style.left = `${Math.random() * 100}%`;

      const duration = 4 + Math.random() * 3;
      const delay = Math.random() * 2;
      const rotate = Math.random() > 0.5 ? 180 : -180;

      piece.style.animationDuration = `${duration}s`;
      piece.style.animationDelay = `${delay}s`;
      piece.style.transform = `rotateZ(${rotate}deg)`;

      container.appendChild(piece);
    }
  }

  function playMusic() {
    if (!bgMusic || musicStarted) return;

    bgMusic.currentTime = 0;
    bgMusic
      .play()
      .then(() => {
        musicStarted = true;
        muteToggleBtn.classList.remove("hidden");
        muteToggleBtn.textContent = "🔊";
      })
      .catch(() => {
        // If autoplay is blocked, try again on the first user interaction
        if (awaitingGesture) return;
        awaitingGesture = true;

        ["click", "keydown", "touchstart"].forEach((evt) => {
          const handler = () => {
            document.removeEventListener(evt, handler);
            awaitingGesture = false;
            playMusic();
          };
          document.addEventListener(evt, handler);
        });
      });

    if (!muteToggleBtn.dataset.bound) {
      muteToggleBtn.dataset.bound = "true";
      muteToggleBtn.addEventListener("click", () => {
        if (bgMusic.muted) {
          bgMusic.muted = false;
          muteToggleBtn.textContent = "🔊";
        } else {
          bgMusic.muted = true;
          muteToggleBtn.textContent = "🔇";
        }
      });
    }
  }

});

