import Image from 'next/image';
import * as React from "react";

export const ProfileIcon = () => {
    const handleClick = () => {
        // Handle button click event to navigate to the game
        window.location.href = "/play";
    };

    return (
        <button className="profile-button flex  flex-row items-center justify-between rounded-md overflow-hidden bg-[#303030] p-2 w-40 h-7 " onClick={handleClick} aria-label="Navigate to game">
            <div className="flex items-center">
                <div className="rounded-full overflow-hidden bg-white w-9 h-9 mr-2">
                    <Image src="/profile/aaitouna.png" alt="Profile Image" width={40} height={38.9} />
                </div>
                <div className="flex flex-col">
                    <div className="font-medium text-white  ">Aaitouna</div>
                    <div className="font-[200] text-white text-xs">Level 55</div>
                </div>
            </div>
            <div className="ml-2 bg-black rounded-full overflow-hidden w-7 h-7 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"/>
                </svg>
            </div>
        </button>
    );
};

export default ProfileIcon;
