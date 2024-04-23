
import { BellIcon, MailIcon } from '@heroicons/react/outline';
import * as React from "react"
import NavBtn from '@/app/HomePage/components/NavBtn'
import { usePathname } from 'next/navigation'

export const HomeIcon = ({ color, ...props }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={21.25}
		height={25}
		fill={color}
		{...props}
	>
		<path
			fill={color || "#A2A2A2"}
			d="M13 25v-7.5h5V25h6.25V15H28L15.5 3.75 3 15h3.75v10H13Z"
		/>
	</svg>
);

export const TournamentsIcon = ({ color, ...props }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={21.25}
		height={25}
		fill={color}
		{...props}
	>
		<path
			fill={color || "#A2A2A2"}
			d="M5 4.202h20a1.25 1.25 0 0 1 1.25 1.25v8.75H3.75v-8.75A1.25 1.25 0 0 1 5 4.202Zm-1.25 12.5h22.5v8.75a1.25 1.25 0 0 1-1.25 1.25H5a1.25 1.25 0 0 1-1.25-1.25v-8.75Zm5 3.75v2.5h3.75v-2.5H8.75Zm0-12.5v2.5h3.75v-2.5H8.75Z"
		/>
	</svg>
)
const Links = [
	{
		name: 'Home',
		href: '/',
		Icon: HomeIcon
	},
	{
		name: 'Tournaments',
		href: '/tr',
		Icon: TournamentsIcon
	},
	{
		name: 'Ranking',
		href: '/rn',
		Icon: TournamentsIcon
	},
	{
		name: 'home',
		href: '/home',
		Icon: HomeIcon
	}
]


const NavBar = () => {
	const path = usePathname();
	return (
		<nav className="bg-gray-800 p-4">
			<div className="container mx-auto flex justify-between items-center">
				<div className="text-white font-semibold flex items-center space-x-4">

					{Links.map((item, index) => (
						<NavBtn 
						key={index} 
						href={item.href} 
						name={item.name} 
						Icon={item.Icon}
						color={item.href === path ? "#FF3D00" : "#A2A2A2"}
						/>
					))}
				</div>
				<div className="flex items-center space-x-4">
					<button className="text-white">
						<MailIcon className="h-6 w-6" />
					</button>
					<button className="text-white">
						<BellIcon className="h-6 w-6" />
					</button>
				</div>
			</div>
		</nav>
	);
};

export default NavBar;

