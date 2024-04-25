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
        <div  className="h-screen flex flex-col ">
            <NavBar />
            <div className="flex-1 flex flex-col h-full gap-8 mt-5">
				<div className="flex flex1 flex-row h-[456px] gap-4">
					<div className="w-[381px] h-full bg-gray-700 rounded-md ml-8"><TeamLeader/></div>
					<div className="flex-1 h-full bg-gray-700 rounded-md"><NewTournaments /></div>
					<div className="w-[381px] h-full bg-gray-700 rounded-md mr-8"><TopPlayers /></div>
				</div>
				<div className="flex flex1 flex-row h-[456px] gap-4">
				<div className="w-[381px] h-full bg-gray-700 rounded-md ml-8"><MyTeam /></div>
					<div className="flex-1 h-full bg-gray-700 rounded-md"><Tournaments /><TeamRanking/></div>
					<div className="w-[381px] h-full bg-gray-700 rounded-md mr-8"></div>
				</div>
             
            </div>
        </div>
    );
}


export default HomeComponent;