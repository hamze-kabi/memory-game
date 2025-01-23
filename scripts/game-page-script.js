"use strict"

let selectedCells = []  // cells that get selected by mouse click
let selectedCellsContents = []  // content of cells that get selected by mouse click
let seconds = 0 // to be converted to 00:00:00 and displayed
let tempCurrentPlayer = 0 // one player before current player(to be used in increaseScore())
let currentPlayer = null  // current player to calculate its stats
let timers = {} // an object containing timer of each gamer
let gameStarted = false // as soon as the first player clicks, it converts to true and timer starts working
let intervalId;
let playersRanked = []
let queryString;

// addresses of icons
const icons = [
  "assets/icons/bagpipes_wind_instrument_musical_music_cultures_bagpipe_icon_262832.png",
  "assets/icons/beat_tempo_music_rhythm_metronome_icon_262835.png",
  "assets/icons/chimes_music_percussion_instrument_musical_orchestra_icon_262854.png",
  "assets/icons/folk_musical_instrument_wind_harmonica_music_icon_262877.png",
  "assets/icons/headphones_music_audio_electronics_icon_262861.png",
  "assets/icons/instrument_orchestra_music_percussion_musical_conga_icon_262856.png",
  "assets/icons/instrument_string_bass_guitar_electric_rock_music_icon_262845.png",
  "assets/icons/keyboard_musical_instrument_music_organ_piano_icon_262839.png",
  "assets/icons/maracas_latin_music_pair_musical_instrument_icon_262852.png",
  "assets/icons/marimba_orchestra_instrument_idiophone_music_icon_262844.png",
  "assets/icons/mesoamerican_instrument_musical_music_cultures_ocarina_icon_262863.png",
  "assets/icons/music_folk_orchestra_cultures_instrument_musical_accordion_icon_262853.png",
  "assets/icons/music_instrument_percussion_drum_snare_icon_262876.png",
  "assets/icons/music_lyre_musical_instrument_string_orchestra_icon_262834.png",
  "assets/icons/music_microphone_sing_stand_mic_electronics_icon_262873.png",
  "assets/icons/music_note_musical_book_stand_icon_262868.png",
  "assets/icons/music_string_chinese_instrument_musical_guzheng_icon_262836.png",
  "assets/icons/musical_djembe_cultures_music_percussion_instrument_drum_icon_262862.png",
];

// gets settings parameters sent by index.html
function getQueryParam() {
  console.log("getQueryParam() called, getting params")
  const params = {}
  const queryString = window.location.search.slice(1)
  const pairs = queryString.split("&")
  pairs.forEach(pair => {
    let [key, value] = pair.split("=")
    params[encodeURIComponent(key)] = encodeURIComponent(value || "")
  })
  return params
};

// creates cells elements based on gridSize
function createCell() {
  console.log("createCell() called, creating cells")
  let multiplier;
  let gridSize;
  if (params.gridSize == "4x4") {
    gridSize = 4
    multiplier = 2
  } else if (params.gridSize == "6x6") {
    gridSize = 6
    multiplier = 3
  }
  const cells = document.getElementById("cells")

  if (gridSize == 4) {
    cells.style.gridTemplateAreas = 
    `
      "cell0 cell1 cell2 cell3"
      "cell4 cell5 cell6 cell7"
      "cell8 cell9 cell10 cell11"
      "cell12 cell13 cell14 cell15"
    `

  } else if (gridSize == 6) {
    cells.style.gridTemplateAreas = 
    `
      "cell0 cell1 cell2 cell3 cell4 cell5"
      "cell6 cell7 cell8 cell9 cell10 cell11"
      "cell12 cell13 cell14 cell15 cell16 cell17"
      "cell18 cell19 cell20 cell21 cell22 cell23"
      "cell24 cell25 cell26 cell27 cell28 cell29"
      "cell30 cell31 cell32 cell33 cell34 cell35"
    `
  }

  let cellId = -1
  for (let n = 1; n<=gridSize * multiplier; n++) {  // gridSize * multiplier equals number of cells to be created
    for (let m = 0; m <= 1; m++) {
      // creating cells
      cellId += 1
      let cell = document.createElement("div")
      cell.classList.add("cell")
      cell.id = `cell${cellId}`
      cell.style.gridArea = `cell${cellId}`
      cells.appendChild(cell)
    }
  }
}

function shuffleArray(array) {
  console.log("shuffleArray(array) called, shuffling array")
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

function themeCells() {
  let numberOfCells = null
  let cellsArr = document.querySelectorAll(".cell")
  let shuffledCells = shuffleArray(Array.from(cellsArr))  // randomized cell elements
  console.log("shuffleArray() finished running, cellsArr(cell elements) shuffled")

  if (params.gridSize == "4x4") {
    numberOfCells = 16
  } else if (params.gridSize == "6x6") {
    numberOfCells = 36
  }

  let cellValueArr = []
  if (params.theme == "numbers") {
    for (let i = 1; i <= (numberOfCells/2); i++) {
      cellValueArr.push(i)
    }
  } else if (params.theme == "icons") {
    for (let i = 0; i <= (numberOfCells/2) - 1; i++) {
      cellValueArr.push(icons[i])
    }
  }
  cellValueArr = cellValueArr.concat(cellValueArr)  // double length of cellValueArr to match length of cells

  // setting value for cells
  for (let i = 0; i <= numberOfCells - 1; i++) {
    if (params.theme == "numbers") {
      shuffledCells[i].innerHTML = cellValueArr[i]
    } else if (params.theme == "icons") {
      shuffledCells[i].innerHTML = `<img class="cell-icon" src="${cellValueArr[i]}" alt="${cellValueArr[i]}">`
    }
  }
  console.log("finished themecells()")
}

// creating overlay on every cell
function createCellOverlay() {
  console.log("createCellOverlay() called")
  document.querySelectorAll(".cell").forEach(el => {
    let cellOverlay = document.createElement("div")
    cellOverlay.classList.add("cell-overlay")
    cellOverlay.id = `cell-overlay${el.id.slice(4)}` //  extracting cellId
    el.appendChild(cellOverlay)  
  })
}

// self explainatory
function selectCurrentPlayer() {
  console.log("selectCurrentPlayer() called")
  if (!currentPlayer || currentPlayer == params.numberOfPlayers) {
    currentPlayer = 0
  }
  currentPlayer += 1
}

// changes color of related .player-p to indicate the current player
function highlightCurrentPlayer() {
  console.log("highlightCurrentPlayer() called")
  for (let i = 1; i <= params.numberOfPlayers; i++) {
    if (i == currentPlayer) {
      document.getElementById(`player-${i}-p`).style.color = "green"
    } else {
      document.getElementById(`player-${i}-p`).style.color = "black"
    }
  }
}

// removes overlay of cell when clicked
function hideOverlay() {
  console.log("hideOverlay() called")
  document.querySelectorAll(".cell-overlay").forEach(cellOverlay => {
    cellOverlay.addEventListener("click", function() {
      cellOverlay.classList.add("cell-overlay-remove")
      console.log("about to call call-startTimer() using dispatchEvent")
      startTimer()
      // document.dispatchEvent(new Event("call-startTimer()"))  // self explainetory
    })
  })
}

// extracting the two selected cells. their contents will be extracted and compared in next functions
function extractPairSelectedCells() {
  console.log("extractPairSelectedCells() called")
  document.querySelectorAll(".cell-overlay").forEach(cellOverlay => {
    cellOverlay.addEventListener("click", function() {
      // extracting selected cell
      let selectedCell = cellOverlay.parentElement; 

      // if no cell is clicked, newly clicked cell gets pushed to selectedCells
      // if a cell is already clicked => checking the second one for similarity
      if (selectedCells.length == 0) {
        selectedCells.push(selectedCell)
      } else if (selectedCells.length == 1) {
        selectedCells.push(selectedCell)
        console.log("about to call extractCellsContents() using dispatchEvent")
        extractCellsContents()
        // document.dispatchEvent(new Event("call-extractCellsContents()"))
        selectedCells = []
        selectedCellsContents = []
      }
    })
  })
}

// extracting contents of selctedCells
function extractCellsContents() {
  console.log("extractCellsContents() called")
  for (let cell of selectedCells) {
    if (params.theme == "numbers") {
      selectedCellsContents.push(cell.textContent)
    } else if (params.theme == "icons") {
      selectedCellsContents.push(cell.getElementsByTagName("img")[0].src)
    }
  }
  // this dispatchevent causes checkSimilarity() to get called without directly getting called from inside of current function
  // helps modularity
  console.log("about to call checkSimilarity() using dispatchEvent")
  checkSimilarity()
  // document.dispatchEvent(new Event("call-checkSimilarity()"))
}

// compairing the two selected cells for their similarity
function checkSimilarity() {
  console.log("checkSimilarity() called")
  console.log("about to call countMoves() using dispatchEvent")
  countMoves()
  // document.dispatchEvent(new Event("call-countMoves()"))
  tempCurrentPlayer = currentPlayer
  console.log("about to call selectCurrentPlayer() using dispatchEvent")
  selectCurrentPlayer()
  // document.dispatchEvent(new Event("call-selectCurrentPlayer()"))
  console.log("about to call highlightCurrentPlayer() using dispatchEvent")
  highlightCurrentPlayer()
  // document.dispatchEvent(new Event("call-highlightCurrentPlayer()"))
  if (selectedCellsContents[0] != selectedCellsContents[1]) {
    for (let cell of selectedCells) {
      setTimeout(() => {
        let cellOverlay;
        if (params.theme == "numbers") {
          cellOverlay = cell.children[0]
        } else if (params.theme == "icons") {
          cellOverlay = cell.children[1]
        }
        cellOverlay.classList.remove("cell-overlay-remove")
      }, 500)
    }
  } else {
    increaseScore()
    checkWin()
    // document.dispatchEvent(new Event("call-checkWin()", checkWin))
  }
}

// player stats (moves and timer) are display: none by default, their display change to flex based on the number of players selected on index.html
function displayPlayersStats() {
  console.log("displayPlayersStats() called")
  for (let i = 1; i <= params.numberOfPlayers; i++) {
    document.getElementById(`player-${i}-row`).style.display = "flex"
  }
}

// count number of moves player has played
function countMoves() {
  console.log("countMoves() called")
  document.getElementById(`moves-number-${currentPlayer}`).innerHTML =
    +document.getElementById(`moves-number-${currentPlayer}`).innerHTML + 1
}

function increaseScore() {
  document.getElementById(`score-number-${tempCurrentPlayer}`).innerHTML =
    +document.getElementById(`score-number-${tempCurrentPlayer}`).innerHTML + 1
}

// creates timers for each player
function createTimer() {
  console.log("createTimer() called")
  for (let i = 1; i <= params.numberOfPlayers; i++) {
    timers[i] = 0
  }
}

// converts gameStarted to true and calls timer()
function startTimer() {
  console.log("startTimer() called")
  if (!gameStarted) {
    gameStarted = true
    console.log("about to call timer() using dispatchEvent")
    timer()
    // document.dispatchEvent(new Event("call-timer()"))  
  }
}


function timer() {
  console.log("timer() called")
  intervalId = setInterval(() => {
    timers[currentPlayer]++
    console.log("about to call formatTimer() using dispatchEvent")
    formatTimer()
    // document.dispatchEvent(new Event("call-formatTimer()"))
  }, 1000)
}

// changes format of time to 00:00:00
function formatTimer() {
  const toBeFarmatted = timers[currentPlayer]
  let hrs = Math.floor(toBeFarmatted / 3600)
  let mins = Math.floor((toBeFarmatted % 3600) / 60)
  let secsRemaining = Math.floor(toBeFarmatted % 60)
  const formatted = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secsRemaining.toString().padStart(2, '0')}`;
  document.getElementById(`timer-number-${currentPlayer}`).innerHTML = formatted
}

// function stopTimer() {
//     clearInterval(intervalId); // Clear the interval using the interval ID
//     console.log("timer stopped");
// }

// when reset button is clicked
function reset() {
  console.log("reset() called")
  document.getElementById("reset-btn").addEventListener("click", () => {
    const queryString = `?theme=${encodeURIComponent(params.theme)}&numberOfPlayers=${encodeURIComponent(params.numberOfPlayers)}&gridSize=${encodeURIComponent(params.gridSize)}`
    window.location.href = "gamepage.html" + queryString
  })
}

function newGame() {
  document.getElementById("new-game-btn").addEventListener("click", () => {
    window.location.href = "index.html"
  })
}

// // reset timers and move counters to 0, when reset button is clicked
// function resetStats() {
//   document.querySelectorAll(".moves-number").forEach(el => el.innerHTML = 0)
//   document.querySelectorAll(".timer-number").forEach(el => el.innerHTML = "00:00:00")
// }

// document.getElementById("score-number-2").innerHTML = 3
// document.getElementById("score-number-4").innerHTML = 4
// document.getElementById("score-number-1").innerHTML = 30
// document.getElementById("score-number-3").innerHTML = 40
// document.getElementById("moves-number-2").innerHTML = 2
// document.getElementById("moves-number-4").innerHTML = 3
// document.getElementById("timer-number-2").innerHTML = "00:00:09"
// document.getElementById("timer-number-4").innerHTML = "00:00:07"

// ranks players based on the following(priority high to low): score(more better), moves(less better), timer(less better)
function rankPlayers() {
  console.log("rankPlayers() called")
  for (let i = 1; i <= params.numberOfPlayers; i++) {
    let score = +document.getElementById(`score-number-${i}`).innerHTML
    let moves = +document.getElementById(`moves-number-${i}`).innerHTML
    let timer = document.getElementById(`timer-number-${i}`).innerHTML
    timer = convertToSeconds(timer)
    playersRanked.push([i, score, moves, timer])
  }
  if (playersRanked.length > 1) {
    for (let i = playersRanked.length - 1; i > 0 ; i--) {
      playersRanked.sort((a, b) => {
        if (i == 1) {
          return b[i] - a[i]
        } else {
          return a[i] - b[i]
        }
      })
    }
  }
}

function convertToSeconds(str) {
console.log("convertToSeconds(str) called")
  const [hours, minutes, seconds] = str.split(":").map(Number)
  return (hours * 3600) + (minutes * 60) + (seconds)
}

// // if the are winners with similar scores, this function picks the one with less time
// function checkSimilarScores() {
//   let similarScores = []
//   similarScores.push(playersRanked[0])
//   for (let i = 1; i < params.numberOfPlayers; i++)
//     if (playersRanked[i][1] == playersRanked[0][1]) {
//       similarScores.push(playersRanked[i])
//     }
//   if (similarScores.length > 1) {
//     for (let similarScore of similarScores) {
//       let toBeConvertedToSeconds = document.getElementById(`timer-number-${similarScore[0][similarScore[0].length-1]}`).innerHTML
//       // console.log(document.getElementById(`timer-number-${similarScore[0][similarScore[0].length-1]}`).innerHTML)
//       // console.log(similarScore[0][similarScore[0].length-1])      
//       let convertedToSeconds = convertToSeconds(toBeConvertedToSeconds)
//       console.log(convertedToSeconds)
//     }
//     console.log(similarScores)
//   }  
// }
// playersRanked.push([i, score, moves, timer])
function constructQueryString() {
  console.log("constructQueryString() called")
  queryString = `?`
  for (let i = 0; i < params.numberOfPlayers; i++) {
    // const queryString = `?theme=${encodeURIComponent(theme)}&numberOfPlayers=${encodeURIComponent(numberOfPlayers)}&gridSize=${encodeURIComponent(gridSize)}`    
    queryString += `player=${playersRanked[i][0]}&score=${playersRanked[i][1]}&moves=${playersRanked[i][2]}&timer=${playersRanked[i][3]}`
    if (i != params.numberOfPlayers - 1) {
      queryString += "|"
    }
  }
}

function checkWin() {
  console.log("checkWin() called")
  let numberOfAllCells = document.querySelectorAll(".cell-overlay").length
  let numberOfrevealedCells = document.querySelectorAll(".cell-overlay-remove").length
  if (numberOfAllCells == numberOfrevealedCells) {
    rankPlayers()
    constructQueryString()
    // waiting 0.5s (for no reason), and then getting redirected to winpage.html
    sleep(500, () => {
      window.location.href = "winpage.html" + queryString
    });
  }
}

// to sleep a certain period of time
function sleep(ms, callback) {
  setTimeout(callback, ms);
}

// Call functions section
// saves the received parameter in params constant
const params = getQueryParam();
createCell()
themeCells()
createCellOverlay()
selectCurrentPlayer()
highlightCurrentPlayer()
hideOverlay()
// document.addEventListener("call-extractCellsContents()", extractCellsContents)  // related to dispatchEvent inside extractPairSelectedCells()
// document.addEventListener("call-checkSimilarity()", checkSimilarity)  // related to dispatchEvent inside extractCellsContents()
displayPlayersStats()
createTimer()
// document.addEventListener("call-countMoves()", countMoves)  // related to dispatchEvent inside checkSimilarity()
// document.addEventListener("call-startTimer()", startTimer)  // related to dispatchEvent inside hideOverlay()
document.addEventListener("call-timer()", startTimer)  // related to dispatchEvent inside startTimer()
extractPairSelectedCells()
// document.addEventListener("call-checkWin()", checkWin)  // related to dispatchEvent inside checkSimilarity()
// document.addEventListener("call-selectCurrentPlayer()", selectCurrentPlayer)  // related to dispatchEvent inside checkSimilarity()
// document.addEventListener("call-highlightCurrentPlayer()", highlightCurrentPlayer)  // related to dispatchEvent inside checkSimilarity()
// document.addEventListener("call-timer()", timer)  // related to dispatchEvent inside checkSimilarity()
// document.addEventListener("call-formatTimer()", formatTimer)  // related to dispatchEvent inside timer()
reset()
newGame()
// document.addEventListener("call-startGame()", startGame)  // related to dispatchEvent inside hideOverlay()

// checkSimilarScores()

/*
document.dispatchEvent(new Event("call-timer()"))
// document.dispatchEvent(new Event("call-startGame()"))

// // converts gameStarted to true as soon as the first cell is clicked
// function startGame() {
//   gameStarted = true
//   document.dispatchEvent(new Event("call-timer()"))
//   console.log(gameStarted)
// }

// counts the time for each player
function timer() {
  previousPlayerTime = check
  setInterval(() => {
    seconds++
    console.log(timers)
  }, 1000)
  timers[currentPlayer] += seconds
}

createTimer()
document.addEventListener("call-timer()", timer)

*/
//////////////////////////////////////////////////////////////////////
// timer()
// function timer() {
//   setInterval(() => {
//     seconds++
//     extractPlayerTime()
//     // let formattedTime = formatTimer()
//     // displayTimer(formattedTime)
//   }, 1000)
// }

// function extractPlayerTime() {
//   let playerTime = document.getElementById(`timer-number-${currentPlayer}`).innerHTML
  // console.log(playerTime)
// }
// function formatTimer() {
//   let hrs = Math.floor(seconds / 3600)
//   let mins = Math.floor((seconds % 3600) / 60)
//   let secsRemaining = Math.floor(seconds % 60)
//   return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secsRemaining.toString().padStart(2, '0')}`;
// }

// function displayTimer(formattedTime) {
//   document.getElementById(`timer-number-${currentPlayer}`).innerHTML = formattedTime
// }