import PropTypes from "prop-types";

interface BrandsLogoProps {
	color: string;
}

const BrandsLogo: React.FC<BrandsLogoProps> = ({ color }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={20}
		height={20}
		fill={color}
	>
		<g clipPath="url(#a)">
			<path
				fill={color || "#A2A2A2"}
				d="M15.28 4.994h-1.509v4.285h1.51V4.994Zm-4.147-.019h-1.51v4.288h1.51V4.975ZM4.72.952.95 4.523v12.858h4.524v3.571l3.771-3.571h3.018l6.787-6.429v-10H4.72Zm12.822 9.287-3.017 2.856h-3.017l-2.64 2.5v-2.5H5.474V2.381h12.068v7.858Z"
			/>
		</g>
		<defs>
			<clipPath id="a">
				<path fill="#fff" d="M0 .952h20v20H0z" />
			</clipPath>
		</defs>
	</svg>
);

BrandsLogo.propTypes = {
	color: PropTypes.string.isRequired,
};

export default BrandsLogo;
