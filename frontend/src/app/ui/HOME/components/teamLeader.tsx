import React from 'react';
import Image from 'next/image';
import exp from 'constants';

const SvgComponent = () => (
	<svg
    xmlns="http://www.w3.org/2000/svg"
	width={310}
	height={164}

    fill="none"
  >
    <path
      fill="url(#a)"
      d="M39.888 60.407 0 41.624V262h340V6.599l-4.749-1.523-25.642 30.965-10.447-3.046-32.29 28.934-3.799 2.538-32.766-34.01-9.972 5.584-18.044-30.965h-3.325l-20.893 25.381h-2.375l-14.245 19.29-16.621 22.842-4.273 3.046-9.498-11.675-19.944-59.9L106.369 0l-7.598 4.06L85 37.057l-5.224 4.569-10.446-7.107-9.498 2.538-19.944 23.35Z"
    />
    <defs>
      <linearGradient
        id="a"
        x1={170}
        x2={170}
        y1={0}
        y2={149.714}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.062} stopColor="#FD4106" stopOpacity={0.28} />
        <stop offset={1} stopColor="#FD4106" stopOpacity={0} />
      </linearGradient>
    </defs>
  </svg>
  )

export const RankIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		fill="none"
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

export function LeaderIcons({ name, Icon }: {
	name: string;
	Icon: any;
}) {
	const isMessage = name == "Messages";
	const handleClick = () => {
		window.location.href = "/play";
	};
	return (
		<button className=" profile-button flex items-center justify-between rounded-lg overflow-hidden bg-[#434343] p-2 w-30 h-6 mb-4" onClick={handleClick} aria-label="Navigate to game">
			<div className='flex items-center justify-between'> <Icon /> <div />
				<div className="flex items-center justify-between flex-1 ml-2">
					<div className="text-white">{name}</div>
				</div>
			</div>
			<div className={`flex items-center justify-end ${isMessage ? "ml-[146px]" : "ml-5"}`}>
				<div className="bg-[#555353] rounded-md dark:text-white ">
					<div className='ml-3 mr-3'>21</div>
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
					<Image src="/profile/aaitouna.png" alt="Profile Image" width={62} height={62} />
				</div>
				<div className="flex flex-col">
					<div className="font-medium text-white ">Ayoub Aitouna</div>
					<div className="font-light text-[#A1A1A1] text-xs">Team Leader </div>
				</div>
			</div >
			<div className=' mt-3 text-white font-light text-sx flex justify-between">'>
				<div className=' text-sx'>My Level</div>
				<div className="ml-auto">7.9000/9000</div>
			</div>
			<div  className='mt-3'>
				<SvgComponent />
			</div >
			<div className='mt-4'>
				<div className='container  flex flex-row justify-between items-center'>
					<LeaderIcons
						name={"Rank"}
						Icon={RankIcon}
					/>
					<LeaderIcons
						name={"Coins"}
						Icon={RankIcon}
					/>
				</div>
				<LeaderIcons
					name={"Messages"}
					Icon={RankIcon}
				/>
			</div>
			<div>

			</div>
		</div>
	);
}

export default TeamLeader;
