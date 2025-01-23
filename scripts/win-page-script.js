"use strict";
let playersRanked = []
let playersStats = {}

function getPlayersStats() {
  console.log("getPlayersStats() called")
  const stats = {}
  const queryString = window.location.search.slice(1)
  const playersStatsStr = queryString.split("|")
  playersStatsStr.forEach(stats => {
    let statsList = stats.split("&")
    statsList.forEach(stat => {
      let temp = stat.split("=")
      if (temp[0] == "player") {
        playersRanked.push(+temp[1])
      } else if (temp[0] == "timer"){
        let timer = +temp[1]
        let formattedTimer = formatTimer(timer)
        playersStats[`${temp[0]}-number-${playersRanked[playersRanked.length - 1]}`] = formattedTimer
      } else {
        playersStats[`${temp[0]}-number-${playersRanked[playersRanked.length - 1]}`] = +temp[1]
      }
    })
  })
}

function formatTimer(toBeFarmatted) {
  let hrs = Math.floor(toBeFarmatted / 3600)
  let mins = Math.floor((toBeFarmatted % 3600) / 60)
  let secsRemaining = Math.floor(toBeFarmatted % 60)
  const formatted = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secsRemaining.toString().padStart(2, '0')}`;
  return formatted
}
////////////////////////// fix here
function displayRankings() {
  let playersStatsSection = document.getElementById("players-stats")
  playersRanked.forEach(player => {
    playersStatsSection.innerHTML += 
    `<div class="player-stat-row" id="player-${player}-row">
      <p class="player-p" id="player-${player}-p">Player ${player}</p>
      <div class="player-stat player-stat-moves" id="moves-${player}">Moves:<pre> </pre><span class="moves-number" id="moves-number-${player}">${playersStats[`moves-number-${player}`]}</span></div>
      <div class="player-stat player-stat-timer" id="timer-${player}">Timer:<pre> </pre><span class="timer-number" id="timer-number-${player}">${playersStats[`timer-number-${player}`]}</span></div>
      <div class="player-stat player-stat-score" id="score-${player}">Score:<pre> </pre><span class="score-number" id="score-number-${player}">${playersStats[`score-number-${player}`]}</span></div>
    </div>`
  })
}

getPlayersStats()
// console.log(playersRanked)
// console.log(playersStats)
displayRankings()