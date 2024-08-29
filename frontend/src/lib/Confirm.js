export function showPopup({ title, subtitle, onConfirm, onCancel }) {
	const popupContainer = document.getElementById('popup-container');
	const popupTitle = document.getElementById('popup-title');
	const popupSubtitle = document.getElementById('popup-subtitle');
	const popupConfirm = document.getElementById('popup-confirm');
	const popupCancel = document.getElementById('popup-cancel');
	const popupClose = document.getElementById('popup-close');
  
	popupTitle.textContent = title;
	popupSubtitle.textContent = subtitle;
  
	popupConfirm.onclick = () => {
	  if (onConfirm) onConfirm();
	  hidePopup();
	};
  
	popupCancel.onclick = () => {
	  if (onCancel) onCancel();
	  hidePopup();
	};
  
	popupClose.onclick = () => {
	  if (onCancel) onCancel();
	  hidePopup();
	};
  
	popupContainer.classList.remove('hidden');
  }
  
  function hidePopup() {
	const popupContainer = document.getElementById('popup-container');
	popupContainer.classList.add('hidden');
  }
  