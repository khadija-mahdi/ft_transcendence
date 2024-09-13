export function showPopup({
	title,
	subtitle,
	inputBody = null,
	onConfirm = () => { },
	onCancel = () => { },
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



	const onSubmit = (event) => {
		event.preventDefault();
		const data = {};
		for (let element of event.target.elements) {
			if (element.name) data[element.name] = element.value;
		}
		onConfirm(data);
		hidePopup();
	}

	inputForm.addEventListener("submit", onSubmit);
	popupContainer.classList.remove("hidden");

	function hidePopup() {
		popupContainer.classList.add("hidden");
		inputForm.removeEventListener('submit', onSubmit)
	}
}



export function showMainPopup({
	title,
	subtitle,
	icon,
	inputBody = null,
	type,
	sender,
	onCancel = () => { },
	duration = 10000
}) {
	const popupContainer = document.getElementById("main-popup-container");
	const popupTitle = document.getElementById("main-popup-title");
	const popupSubtitle = document.getElementById("main-popup-subtitle");
	const popupClose = document.getElementById("main-popup-close");
	const popupIcon = document.getElementById("main-popup-icon");
	const progress = document.querySelector(".progress_popup");
	const link = document.getElementById("not-Type");
	if (type === "friend-request")
		link.href = `/profile?username=${sender.username}`;
	else if (type === "messenger")
		link.href = `/messenger?chatroom=${sender.id}`;
	else if (type === "invite")
		link.href = `/match-making?player=${sender.username}`;

	popupTitle.textContent = title;
	popupSubtitle.innerHTML = subtitle;
	popupIcon.src = icon || "/public/assets/images/PopUp.jpg";

	if (inputBody) {
		const inputFormBody = document.getElementById("input-form-body");
		if (inputFormBody) {
			inputFormBody.innerHTML = inputBody;
		}
	}

	popupClose.onclick = () => {
		onCancel();
		hideMainPopup();
	};

	progress.style.animation = `fill ${duration / 1000}s linear forwards`;

	popupContainer.classList.remove("hidden");

	setTimeout(() => {
		hideMainPopup();
	}, duration);
}

function hideMainPopup() {
	const popupContainer = document.getElementById("main-popup-container");
	popupContainer.classList.add("hidden");
}
