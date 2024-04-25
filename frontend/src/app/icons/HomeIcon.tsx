import * as React from "react";

export const HomeIcon = ({ color, ...props }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={30}
		height={30}
		fill={color}
		{...props}
	>
		<path
			fill={color || "#A2A2A2"}
			d="M13 25v-7.5h5V25h6.25V15H28L15.5 3.75 3 15h3.75v10H13Z"
		/>
	</svg>
);

export default HomeIcon;
