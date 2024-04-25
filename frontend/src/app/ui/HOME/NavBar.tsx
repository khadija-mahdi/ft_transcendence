import * as React from "react";
import NavBtn from "@/components/NavBtn";
import NavBtnR from "@/components/NavBtnRight";
import { usePathname } from "next/navigation";
import ProfileIcon from "@/app/icons/ProfileIcon"

import Links from "@/app/icons/Links";
import RLinks from "@/app/icons/RLinks";

const PlayNowIcon = () => {
	const handleClick = () => {
		// Handle button click event to navigate to the game
		window.location.href = "/play";
	};

	return (
		<button className="play-now-button h-6 w-30" onClick={handleClick}> Play Now </button>
	);
};


const NavBar = () => {
	const path = usePathname();

	return (
		<nav className="bg-black ml-[45px] mt-[40px] mb-[40px] flex flex-row justify-between items-center">
			<div className="container  flex flex-row justify-between items-center">
				<div className="text-white font-semibold flex space-x-9">
					<PlayNowIcon/>
					{Links.map((item, index) => (
						<NavBtn
						key={index}
						href={item.href}
						name={item.name}
						Icon={item.Icon}
						/>
					))}
				</div>
				<div className=" space-x-2 flex flex-row items-center justify-center ">
					{RLinks.map((item, index) => (
						<div key={index} className="rounded-full overflow-hidden bg-[#303030] p-2 w-5 h-5">
							<NavBtnR
								href={item.href}
								Icon={item.Icon}
							/>
						</div>
					))}
					<ProfileIcon/>
				</div>
			</div>
		</nav>
	);
};




export default NavBar;

