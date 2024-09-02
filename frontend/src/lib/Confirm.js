export function showPopup({
  title,
  subtitle,
  inputBody = null,
  onConfirm = () => {},
  onCancel = () => {},
}) {
  const popupContainer = document.getElementById("popup-container");
  const popupTitle = document.getElementById("popup-title");
  const popupSubtitle = document.getElementById("popup-subtitle");
  const popupCancel = document.getElementById("popup-cancel");
  const popupClose = document.getElementById("popup-close");
  const inputForm = document.getElementById("input-form");
  const inputFormBody = document.getElementById("input-form-body");

  if (inputBody) {
    inputFormBody.innerHTML = inputBody;
  }

  popupTitle.textContent = title;
  popupSubtitle.textContent = subtitle;


  popupCancel.onclick = () => {
    if (onCancel) onCancel();
    hidePopup();
  };

  popupClose.onclick = () => {
    if (onCancel) onCancel();
    hidePopup();
  };

  
  inputForm.addEventListener("submit", (event) => {
    event.preventDefault();
	const data = {};
	for (let element of event.target.elements) {
	  if (element.name) data[element.name] = element.value;
	}
    onConfirm(data);
    hidePopup();
  });

  popupContainer.classList.remove("hidden");
}

function hidePopup() {
  const popupContainer = document.getElementById("popup-container");
  popupContainer.classList.add("hidden");
}
