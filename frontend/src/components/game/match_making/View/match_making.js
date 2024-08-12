export default () => {
	     return /*html*/`
	 		<link rel="stylesheet" href="/components/game/match_making/assets/match_making.css">
	 		<div class= "auth">
	 			<div class="bg-image">
	 				<div className="absolute  h-full w-full overflow-hidden bg-fixed p-16">
	 					<Image
	 						src="components/game/match_making/assets/images/matching-bg.jpg"
	 						layout="fill"
	 						alt=''
	 						objectFit="cover"
	 						quality={100}
	 					/>
	 				</div> 
	 			</div>
	    		</div>
	     `;
	 };
	 
	 ///components/game/in_game/assets/models/scene_bg.glb
	 
	 /*
	 
	 		<div className=''>
	 			<div className="bg-image">
	 				<Image
	 					src="/assets/images/matching-bg.jpg"
	 					layout="fill"
	 					alt=''
	 					objectFit="cover"
	 					quality={100}
	 				/>
	 				<div
	 					className="absolute  h-full w-full overflow-hidden bg-fixed p-16">
	 					<button className={`${styles.play_now_button} w-[140px] h-[44px] font-semibold text-[14px]`} onClick={() => {
	 						socket.current.close();
	 						router.replace('/game')
	 					}}>
	 						<span className='ml-1 lowercase flex flex-row items-start justify-start'>
	 							<div className=' justify-start items-start'
	 							>
	 								<LeftArrow />
	 							</div>
	 							<div className='px-1'>
	 								{minutes}m:{seconds}s
	 							</div>
	 						</span>
	 					</button>
	 					<div className="flex h-full items-center justify-center">
	 						<div className="text-white p-32">
	 							<PlayerCard href={myInfo?.image_url || "/assets/images/Unknown.jpg"} name={myInfo?.username || '----'} lvl={String(myInfo?.level)} icon={myInfo?.rank?.icon || "/assets/icons/Gold_3_Rank.png"} />
	 						</div>
	 						<div className=' font-black text-[60px] text-[#A2A2A2] '>VS</div>
	 						{playerInfo?.username == null ?
	 							<div className="scroll-parent p-32 max-h-[600px]">
	 								<div className="scroll-element primary my-4">
	 									<div className="text-white my-4">
	 										<PlayerCard href='/assets/images/Unknown.jpg' name='Unknown' lvl={'---'} icon='/assets/icons/Gold_3_Rank.png' />
	 									</div>
	 									<div className="text-white my-4">
	 										<PlayerCard href='/assets/images/Unknown.jpg' name='Unknown' lvl={'---'} icon='/assets/icons/Gold_3_Rank.png' />
	 									</div>
	 								</div>
	 								<div className="scroll-element secondary my-4">
	 									<div className="text-white my-4">
	 										<PlayerCard href='/assets/images/Unknown.jpg' name='Unknown' lvl={'---'} icon='/assets/icons/Gold_3_Rank.png' />
	 									</div>
	 									<div className="text-white my-4">
	 										<PlayerCard href='/assets/images/Unknown.jpg' name='Unknown' lvl={'---'} icon='/assets/icons/Gold_3_Rank.png' />
	 									</div>
	 								</div>
	 							</div> :
	 							<div className="my-4 p-32">
	 								<div role="status" className="  flex items-center justify-center  bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
	 									<PlayerCard href={playerInfo.image_url} name={playerInfo.username} lvl={String(playerInfo.level)} icon={playerInfo?.rank?.icon} />
	 								</div>
	 
	 							</div>
	 						}
	 					</div>
	 				</div>
	 			</div>
	 		</div>
	 */
