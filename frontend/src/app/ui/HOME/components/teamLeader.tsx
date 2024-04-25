import React from 'react';
import Image from 'next/image';
import exp from 'constants';

export const SvgComponent = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={340}
    height={164}
    fill="none"
  >
    <path
      fill="url(#a)"
      d="M39.888 59.715 0 41.148V259h340V6.523l-4.749-1.505-25.642 30.61-10.447-3.01-32.29 28.602-3.799 2.51-32.766-33.622-9.972 5.52-18.044-30.61h-3.325l-20.893 25.09h-2.375l-14.245 19.069-16.621 22.581-4.273 3.011-9.498-11.542-19.944-59.213L106.369 0l-7.598 4.014L85 36.632l-5.224 4.516-10.446-7.025-9.498 2.509-19.944 23.083Z"
    />
    <defs>
      <linearGradient
        id="a"
        x1={170}
        x2={170}
        y1={0}
        y2={148}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.055} stopColor="#FD4106" stopOpacity={0.28} />
        <stop offset={1} stopColor="#FD4106" stopOpacity={0} />
      </linearGradient>
    </defs>
  </svg>
)

export const RankIcon = (props) => (
	<svg
	  xmlns="http://www.w3.org/2000/svg"
	  width={24}
	  height={24}
	  fill="none"
	  {...props}
	>
	  <path
		stroke="#fff"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		d="M16.7 18.98H7.3c-.42 0-.89-.33-1.03-.73L2.13 6.67c-.59-1.66.1-2.17 1.52-1.15l3.9 2.79c.65.45 1.39.22 1.67-.51l1.76-4.69c.56-1.5 1.49-1.5 2.05 0l1.76 4.69c.28.73 1.02.96 1.66.51l3.66-2.61c1.56-1.12 2.31-.55 1.67 1.26l-4.04 11.31c-.15.38-.62.71-1.04.71ZM6.5 22h11M9.5 14h5"
	  />
	</svg>
);

export function LeaderIcon({ name, Icon }: {
    name: string;
    Icon: any;
}) {
    const handleClick = () => {
        window.location.href = "/play";
    };

    return (
        <button className=" mt-3 profile-button flex items-center justify-between rounded-lg overflow-hidden bg-[#A1A1A1] p-2 w-30 h-6 mb-4" onClick={handleClick} aria-label="Navigate to game">
            <div className="flex items-center">
                <div><Icon /></div>
                <div className="flex items-center justify-between flex-1 ml-2">
                    <div className="text-white">{name}</div>
                </div>
            </div>
            <div className="flex items-center justify-end ml-10">
                <div className="bg-[#434343] rounded-me  text-gray-800 dark:text-white">
                    2109
                </div>
            </div>
        </button>
    );
};



function TeamLeader() {
	return (
		<div className='m-6' >
			<div className="flex items-center m-3'">
				<div className="rounded-full overflow-hidden bg-white w-9 h-9 mr-2">
					<Image src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg" alt="Profile Image" width={62} height={62} />
				</div>
				<div className="flex flex-col">
					<div className="font-medium text-white text-sm mb-1">khadija Mahdi</div>
					<div className="font-light text-[#A1A1A1] text-xs">Team Leader </div>
				</div>
			</div >
			<div className=' mt-3 text-white font-light text-sx flex justify-between">'>
				<div>My Level</div>
				<div className="ml-auto">7.9000/9000</div>
			</div>
			<div className='bg-white mt-3'>
				<SvgComponent/>
			</div >
				<LeaderIcon name={"Rank"} Icon={RankIcon}/>
			<div>

			</div>
		</div>
	);
}

export default TeamLeader;
