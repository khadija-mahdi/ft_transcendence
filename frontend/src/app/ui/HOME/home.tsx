'use client'

import React, { useState } from 'react';
import NavBar from "./NavBar"
import './home.css'
import TeamLeader from './components/teamLeader';
import MyTeam from './components/myTeam';
import TopPlayers from './components/topPlayers';
import Tournaments from './components/Tournaments';
import TeamRanking from './components/teamRanking';
import NewTournaments from './components/newTournament';

function HomeComponent() {
    return (
        <div  className="max-w-[1728px] max-h-[1117px]">
            <NavBar />
            <div className="flex-1 flex flex-col gap-4 max-w-[1637px] max-h-[886px]">
				<div className="flex flex1 flex-row h-[400px] gap-4">
					<div className="w-[361px] h-[400px] bg-[#323434] rounded-md ml-[45px]"><TeamLeader/></div>
					<div className="flex-1 h-[400px] bg-[#323434] rounded-md"><NewTournaments /></div>
					<div className="w-[361px] h-[400px] bg-[#323434] rounded-md mr-[45px]"><TopPlayers /></div>
				</div>
				<div className="flex flex1 flex-row h-[400px] gap-4">
				<div className="w-[361px] h-[400px] bg-[#323434] rounded-md ml-[45px]"><MyTeam /></div>
					<div className="flex-1 h-[400px] bg-[#323434] rounded-md"><Tournaments /><TeamRanking/></div>
					<div className="w-[361px] h-[400px] bg-[#323434] rounded-md mr-[45px]"></div>
				</div>
             
            </div>
        </div>
    );
}


export default HomeComponent;