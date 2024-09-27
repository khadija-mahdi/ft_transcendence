const html = String.raw;

export function PlayerBoard(firstPlayer = true) {
  return html`<div class="player-board" data-reversed="${!firstPlayer}">
    <div class="player-info" data-reversed="${!firstPlayer}">
      <img
        id="player-image-${firstPlayer ? 1 : 2}"
        alt=""
        onerror="this.src='/public/assets/images/defaultImageProfile.jpeg';"
        />
      <p id="player-name-${firstPlayer ? 1 : 2}"></p>
    </div>
    <div id="player-score-${firstPlayer ? 1 : 2}" class="score">06</div>
  </div> `;
}

export default () => {
  return html`
    <div id="loading-screen">
      <div id="progress-bar-container">
        <div id="progress-bar"></div>
      </div>
    </div>
    <div class="score-count-container" style="visibility: hidden">
      ${PlayerBoard()}
      <div class="vs-container">
        <p>VS</p>
      </div>
      ${PlayerBoard(false)}
    </div>

    <div class="popup-container" style="visibility: hidden"></div>
  `;
};

export function ShowModal({
  view,
  onConfirm = () => { },
  onCancel = () => { },
  hasPriority = false,
}) {
  const modalContainer = document.querySelector(".popup-container");

  const modalPriority = modalContainer.dataset.hasPriority;
  if (modalPriority === "true" && !hasPriority) return;
  modalContainer.style.visibility = "visible";
  modalContainer.innerHTML = "";
  modalContainer.dataset.hasPriority = hasPriority;

  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = view;

  const confirmButton = modal.querySelector(".confirm");
  const cancelButton = modal.querySelector(".cancel");

  function remove() {
    modalContainer.style.visibility = "hidden";
    modal.remove();
  }
  confirmButton?.addEventListener("click", () => {
    onConfirm();
    remove();
  });

  cancelButton?.addEventListener("click", () => {
    onCancel();
    remove();
  });

  modalContainer.appendChild(modal);
  return remove
}

export function WinModal() {
  return html`
    <div class="win-modal-container">
      <div class="icon-container">
        <img
          src="/src/components/game/in_game/assets/prize-icon.png"
          alt="Prize Icon"
          srcset=""
        />
      </div>
      <div class="win-modal-info">
        <h1>CONGRATULATIONS!</h1>
        <p>you've won the game, you can see the game state in you profile</p>
      </div>
      <button class="confirm">CONTINUE</button>
    </div>
  `;
}

export function LoseModal() {
  return html`
    <div class="win-modal-container">
      <div class="icon-container">
        <img
          src="/src/components/game/in_game/assets/lost-icon.png"
          alt="Prize Icon"
          srcset=""
          style="width: 100px; height: 100px;"
        />
      </div>
      <div class="win-modal-info">
        <h1>SORRY !</h1>
        <p>you've Lost the game, don't worry with every win comes a loss</p>
      </div>
      <button class="confirm">CONTINUE</button>
    </div>
  `;
}

export function ErrorModal() {
  return html`
    <div class="win-modal-container">
      <div class="icon-container">
        <img
          src="/src/components/game/in_game/assets/lost-icon.png"
          alt="Prize Icon"
          srcset=""
          style="width: 100px; height: 100px;"
        />
      </div>
      <div class="win-modal-info">
        <h1>ERROR !</h1>
        <p>
          We seem to have a hard time connecting you to this game. please make
          sure you have a stable internet connection and try again
        </p>
      </div>
      <button class="confirm">Try Again</button>
    </div>
  `;
}

export function CountDownModal(startNumber, text = null) {
  let currentNumber = startNumber;
  const countDownInterval = setInterval(() => {
    const countDownPlaceholder = document.getElementById(
      "count-down-placeholder"
    );
    if (!countDownPlaceholder) return clearInterval(countDownInterval);
    if (currentNumber <= 0) {
      const modalContainer = document.querySelector(".popup-container");
      modalContainer.style.visibility = "hidden";

      return clearInterval(countDownInterval);
    }
    currentNumber -= 1;
    if (text !== null)
      countDownPlaceholder.innerText = currentNumber !== 0 ? text : "GO";
    else
      countDownPlaceholder.innerText = currentNumber !== 0 ? currentNumber : "GO";
    countDownPlaceholder.style.animation = "none";
    void countDownPlaceholder.offsetWidth; // by accessing offsetWidth forces the browser to perform a layout recalculation (reflow)
    countDownPlaceholder.style.animation = " pop-in 0.3s ease-out";
  }, 1000);

  return html`
    <div class="countdown-container">
      <p id="count-down-placeholder">${text ? text : startNumber}</p>
    </div>
  `;
}
