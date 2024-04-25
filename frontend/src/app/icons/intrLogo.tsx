import PropTypes from "prop-types";

interface IntraLogoProps {
  color: string;
}

const IntraLogo: React.FC<IntraLogoProps> = ({ color}) => (
	<svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill={color}
 	>
    <g fill={color || "#A2A2A2"}>
      <path d="M0 12.745h7.37v4.207h3.676V9.35H3.692L11.046.952H7.37L0 9.35v3.395ZM12.63 5.16 16.309.951h-3.677v4.207Z" />
      <path d="m16.308 5.16-3.677 4.19v4.19h3.677V9.35L20 5.16V.951h-3.692v4.207Z" />
      <path d="m20 9.35-3.692 4.19H20V9.35Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 .952h20v16H0z" />
      </clipPath>
    </defs>
  </svg>
)

IntraLogo.propTypes = {
	color: PropTypes.string.isRequired,
};

export default IntraLogo;
