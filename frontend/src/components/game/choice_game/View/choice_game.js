			 export default () => {
				return /*html*/ `
<div class="main-container">
    <div class="navbar">
        <ul class="nav-links">
            <li><a href="#"><img class="mini-logo" src="/public/assets/images/aaitouna.jpg"></img> Home</a></li>
            <li><a href="#"><img class="mini-logo" src="/public/assets/images/aaitouna.jpg"></img> Tournaments</a></li>
            <li><a href="#"><img class="mini-logo" src="/public/assets/images/aaitouna.jpg"></img> Ranking</a></li>
        </ul>
        <div class="user-info">
            <img src="/public/assets/images/aaitouna.jpg" alt="User Avatar" class="user-avatar">
            <span class="user-name">Aaitouna</span>
        </div>
    </div>

    <div class="section-container">
        <div class="select-game-section">
            <img src="/public/assets/images/Rectangle.png" alt="Profile Image" class="select-game-image">
            <div class="game-overlay">
                <h1 class="game-title">READY, SET, PLAY!</h1>
                <p class="game-subtitle">Who Will You Face? Choose your opponent and dive into the action!</p>
                <div class="button-group">
                    <label class="radio-option">
                        <input type="radio" name="opponent" value="Machine">
                        <span>Machine</span>
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="opponent" value="Human" checked>
                        <span>Human</span>
                    </label>
                </div>
                <a href="#" class="play-now-button">Play Now</a>
            </div>
        </div>

        <div class="online-players">
            <h3>Online Players</h3>
            <button class="filter-btn">FILTER</button>

            <div class="player-list">
                <div class="player">
                    <img src="/public/assets/images/aaitouna.jpg" alt="Player Avatar">
                    <div class="player-info">
                        <p class="player-name">Eric</p>
                        <p class="player-level">Level 829</p>
                    </div>
                    <button class="invite-button">Invite</button>
                </div>

                <div class="player">
                    <img src="/public/assets/images/aaitouna.jpg" alt="Player Avatar">
                    <div class="player-info">
                        <p class="player-name">Mr-Winner</p>
                        <p class="player-level">Level 829</p>
                    </div>
                    <button class="invite-button">Invite</button>
                </div>
                <div class="player">
                    <img src="/public/assets/images/aaitouna.jpg" alt="Player Avatar">
                    <div class="player-info">
                        <p class="player-name">Mr-Winner</p>
                        <p class="player-level">Level 829</p>
                    </div>
                    <button class="invite-button">Invite</button>
                </div>

                <div class="player">
                    <img src="/public/assets/images/aaitouna.jpg" alt="Player Avatar">
                    <div class="player-info">
                        <p class="player-name">Mr-Winner</p>
                        <p class="player-level">Level 829</p>
                    </div>
                    <button class="invite-button">Invite</button>
                </div>
                <div class="player">
                    <img src="/public/assets/images/aaitouna.jpg" alt="Player Avatar">
                    <div class="player-info">
                        <p class="player-name">Mr-Winner</p>
                        <p class="player-level">Level 829</p>
                    </div>
                    <button class="invite-button">Invite</button>
                </div>
                <!-- Repeat for other players -->
            </div>
        </div>
    </div>
    <div class="live-tournaments">
        <div class="title">
            <h2>Live Tournaments</h2>
            <button class="create-tournament-btn">Create Tournament</button>
        </div>
        <ul class="hr-live-tournaments">
            <li>
                <div class="hr-tournament-info-1">
                    <img src="/public/assets/images/valorantlogo.png" alt="Valorant Logo">
                    <div class="text">
                        <h2>Valorant VCT Cup 2024</h2>
                        <p>Valorant</p>
                    </div>
                </div>
                <div class="hr-tournament-info-2">
                    <div class="text">
                        <h2>64.9k</h2>
                        <span>Online Players</span>
                    </div>
                    <img class="arrow" src="./arrow.svg">
                </div>
            </li>
            <li>
                <div class="hr-tournament-info-1">
                    <img src="/public/assets/images/valorantlogo.png" alt="Valorant Logo">
                    <div class="text">
                        <h2>Valorant VCT Cup 2024</h2>
                        <p>Valorant</p>
                    </div>
                </div>
                <div class="hr-tournament-info-2">
                    <div class="text">
                        <h2>64.9k</h2>
                        <span>Online Players</span>
                    </div>
                    <img class="arrow" src="./arrow.svg">
                </div>
            </li>
            <li>
                <div class="hr-tournament-info-1">
                    <img src="/public/assets/images/valorantlogo.png" alt="Valorant Logo">
                    <div class="text">
                        <h2>Valorant VCT Cup 2024</h2>
                        <p>Valorant</p>
                    </div>
                </div>
                <div class="hr-tournament-info-2">
                    <div class="text">
                        <h2>64.9k</h2>
                        <span>Online Players</span>
                    </div>
                    <img class="arrow" src="./arrow.svg">
                </div>
            </li>
        </ul>
    </div>


</div>

<link rel="stylesheet" href="index.css">
<script src="index.js"></script>
				`;
			};
			
