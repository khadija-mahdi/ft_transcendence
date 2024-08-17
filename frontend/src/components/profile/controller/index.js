import { achievementItem } from "../view/achievment-item.js";
import { tournamentItem } from "../view/tournament-item.js";
import { matchItem } from "../view/match-item.js";

const url = new URL(window.location.href);
const username = url.searchParams.get("username");
console.log(username);

/**
 * This is the controller for the profile page
 *
 * It will handle all the logic for the profile page
 *
 * It will also handle the communication between the model and the view
 */
export default function Controller() {
  if (username === null) {
    window.location.href = "/profile?username=me";
  }
  setProfile(username);
  PopulateTournamentMatches(username);
  PopulateTopAchievements(username);
  PopulateMatches(username);
}

function setProfile(username) {}

function PopulateTournamentMatches(username) {
  const tournamentMatches = [
    {
      name: "Tournament 1",
      description: "This is the first tournament",
      max_players: 10,
    },
    {
      name: "Tournament 2",
      description: "This is the second tournament",
      max_players: 20,
    },
    {
      name: "Tournament 3",
      description: "This is the third tournament",
      max_players: 30,
    },
  ];
  const tournamentHistory = document.getElementById("tournament-history");
  tournamentMatches.forEach((tournament) => {
    tournamentHistory.innerHTML += tournamentItem(tournament);
  });
}

function PopulateTopAchievements(username) {
  const achievements = [
    {
      name: "Achievement 1",
      description: "This is the first achievement",
    },
    {
      name: "Achievement 2",
      description: "This is the second achievement",
    },
    {
      name: "Achievement 3",
      description: "This is the third achievement",
    },
  ];
  const lastAchievements = document.getElementById("last-achievements");
  achievements.forEach((achievement) => {
    lastAchievements.innerHTML += achievementItem(achievement);
  });
}

function PopulateMatches(username) {
  const matches = [
    {
      first_player: {
        image:
          "https://images.unsplash.com/photo-1667053508464-eb11b394df83?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Player 1",
        level: 1,
      },
      second_player: {
        image:
          "https://images.unsplash.com/photo-1667053508464-eb11b394df83?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Player 2",
        level: 2,
      },
    },
    {
      first_player: {
        image:
          "https://images.unsplash.com/photo-1667053508464-eb11b394df83?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Player 3",
        level: 3,
      },
      second_player: {
        image:
          "https://images.unsplash.com/photo-1667053508464-eb11b394df83?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Player 4",
        level: 4,
      },
    },
    {
      first_player: {
        image:
          "https://images.unsplash.com/photo-1667053508464-eb11b394df83?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Player 5",
        level: 5,
      },
      second_player: {
        image:
          "https://images.unsplash.com/photo-1667053508464-eb11b394df83?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Player 6",
        level: 6,
      },
    },
  ];
  const matchHistory = document.getElementById("match-history");
  matches.forEach((match) => {
    matchHistory.innerHTML += matchItem(match);
  });
}
