import { Empty } from "../../../../lib/Empty.js";
import { fetchWithAuth } from "../../../../lib/apiMock.js";

async function fetchLogData() {
	const apiUrl = "/api/v1/users/rank-logs/";
	try {
		const response = await fetchWithAuth(apiUrl, {
			method: "GET",
		});
		return response;
	} catch (error) {
		return [];
	}
}

async function fetchMyData() {
	const apiUrl = "/api/v1/users/me/";

	try {
		const data = await fetchWithAuth(apiUrl, {
			method: "GET",
		});
		return data;
	} catch (error) {
		return {};
	}
}

function PrepareUserChart(inputData) {
	const chart = document.getElementById("user-chart");
	const ctx = chart.getContext("2d");

	var gradient = ctx?.createLinearGradient(0, 0, 0, 400);
	gradient?.addColorStop(0, "rgba(253, 65, 6, 0.28)");
	gradient?.addColorStop(1, "rgba(253, 65, 6, 0)");

	const generateLabels = () => {
		return inputData.map((entry) =>
			new Date(entry.achieved_at).toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			})
		);
	};
	const generateData = () => {
		return inputData.map((entry) => entry.point);
	};

	const data = {
		labels: generateLabels(),
		datasets: [
			{
				data: generateData(),
				borderColor: "#FF3D00",
				fill: "start",
				backgroundColor: gradient,
			},
		],
	};

	new Chart(ctx, {
		type: "line",
		data: data,
		options: {
			scales: {
				y: {
					suggestedMin: 0,
					suggestedMax: 100,
					display: false,
				},
				x: {
					display: false,
				},
			},
			plugins: {
				filler: {
					propagate: false,
				},
				title: {
					display: false,
				},
				legend: {
					display: false,
				},
			},
			interaction: {
				intersect: true,
			},
			elements: {
				line: {
					tension: 0.4,
				},
				point: {
					radius: 0,
				},
			},
			layout: {
				padding: {
					top: 0,
				},
			},
		},
	});
}

export default async function () {
	const user = await fetchMyData();

	document.getElementById("user-image").src =
		user.image_url || "/public/assets/images/defaultImageProfile.jpg";
	document.getElementById("fullname").innerText = user.fullname
		? user?.fullname
		: "";
	document.getElementById("rank-name").innerText = user.rank?.name || "";
	document.getElementById("current-xp").innerText =
		user.rank && `${user?.current_xp}/${user?.rank.xp_required}`;
	document.getElementById("rank-order").innerText =
		user.rank && user.rank.hierarchy_order;
	document.getElementById("coins").innerText = user.coins;
	document.getElementById("messages-count").innerText = -1;

	const inputData = await fetchLogData();
	const chart = document.getElementById("chart-container");
	if (inputData.length === 0 && chart) {
		chart.innerHTML = "";
		const emptyComponent = Empty("You don't have progress data yet");
		const emptyContainer = document.createElement("div");
		emptyContainer.className = "emptyContainer";
		emptyContainer.appendChild(emptyComponent);
		chart.appendChild(emptyContainer);
	} else {
		PrepareUserChart(inputData);
	}
}
