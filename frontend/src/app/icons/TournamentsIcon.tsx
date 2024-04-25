import * as React from "react";

export const TournamentsIcon = ({ color, ...props }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={30}
		height={31}
		fill={color}
		{...props}
	>
		<path
			fill={color || "#A2A2A2"}
			d="M5 4.202h20a1.25 1.25 0 0 1 1.25 1.25v8.75H3.75v-8.75A1.25 1.25 0 0 1 5 4.202Zm-1.25 12.5h22.5v8.75a1.25 1.25 0 0 1-1.25 1.25H5a1.25 1.25 0 0 1-1.25-1.25v-8.75Zm5 3.75v2.5h3.75v-2.5H8.75Zm0-12.5v2.5h3.75v-2.5H8.75Z"
		/>
	</svg>
)

export default TournamentsIcon;
