"use strict"

let selectedCells = []  // cells that get selected by mouse click
let selectedCellsContents = []  // content of cells that get selected by mouse click
let seconds = 0 // to be converted to 00:00:00 and displayed
let currentPlayer = null  // current player to calculate its stats

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
  const params = {}
  const queryString = window.location.search.slice(1)
  const pairs = queryString.split("&")
  pairs.forEach(pair => {
    let [key, value] = pair.split("=")
    params[encodeURIComponent(key)] = encodeURIComponent(value || "")
  })
  return params
};

// creates cells elements based on params.gridSize
function createCell() {
  let gridSize;
  let multiplier;
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
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

function themeCells() {
  let numberOfCells = null
  const theme = params.theme
  let cellsArr = document.querySelectorAll(".cell")
  let shuffledCells = shuffleArray(Array.from(cellsArr))  // randomized cell elements

  if (params.gridSize == "4x4") {
    numberOfCells = 16
  } else if (params.gridSize == "6x6") {
    numberOfCells = 36
  }

  let cellValueArr = []
  if (theme == "numbers") {
    for (let i = 1; i <= (numberOfCells/2); i++) {
      cellValueArr.push(i)
    }
  } else if (theme == "icons") {
    for (let i = 0; i <= (numberOfCells/2) - 1; i++) {
      cellValueArr.push(icons[i])
    }
  }
  cellValueArr = cellValueArr.concat(cellValueArr)  // double length of cellValueArr to match length of cells

  // setting value for cells in randomly
  for (let i = 0; i <= numberOfCells - 1; i++) {
    if (theme == "numbers") {
      shuffledCells[i].innerHTML = cellValueArr[i]
    } else if (theme == "icons") {
      shuffledCells[i].innerHTML = `<img class="cell-icon" src="${cellValueArr[i]}" alt="${cellValueArr[i]}">`
    }
  }
}
// <img src="" alt="">
// creating overlay on every cell
function createCellOverlay () {
  document.querySelectorAll(".cell").forEach(el => {
    let cellOverlay = document.createElement("div")
    cellOverlay.classList.add("cell-overlay")
    cellOverlay.id = `cell-overlay${el.id.slice(4)}` //  extracting cellId
    el.appendChild(cellOverlay)  
  })
}

// self explainatory
function selectCurrentPlayer() {
  if (!currentPlayer || currentPlayer == 4) {
    currentPlayer = 0
  }
  currentPlayer += 1
}

// changes color of related .player-p to indicate the current player
function highlightCurrentPlayer() {
  for (let i = 1; i <= numberOfPlayers; i++) {
    if (i == currentPlayer) {
      document.getElementById(`player-${i}-p`).style.color = rgb(62, 123, 39)
    } else {
      document.getElementById(`player-${i}-p`).style.color = black      
    }
  }
}

// removes overlay of cell when clicked
function hideOverlay() {
  document.querySelectorAll(".cell-overlay").forEach(cellOverlay => {
    cellOverlay.addEventListener("click", function() {
      cellOverlay.classList.add("cell-overlay-remove")
    })
  })
}

// extracting the two selected cells. their contents will be extracted and compared in next functions
function extractPairSelectedCells() {
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
        document.dispatchEvent(new Event("call-extractCellsContents()"))
        selectedCells = []
        selectedCellsContents = []
      }
    })
  })
}

// extracting contents of selctedCells
function extractCellsContents() {
  for (let cell of selectedCells) {
    if (params.theme == "numbers") {
      selectedCellsContents.push(cell.textContent)
    } else if (params.theme == "icons") {
      selectedCellsContents.push(cell.getElementsByTagName("img")[0].src)
    }
  }
  // this dispatchevent causes checkSimilarity() to get called without directly getting called from inside of current function
  // helps modularity
  document.dispatchEvent(new Event("call-checkSimilarity()"))
}

// compairing the two selected cells for their similarity
function checkSimilarity() {
  document.dispatchEvent(new Event("call-selectCurrentPlayer()"))
  document.dispatchEvent(new Event("call-highlightCurrentPlayer()"))
  document.dispatchEvent(new Event("call-countMoves()"))
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
    checkWin()
  }
}

// player stats (moves and timer) are display: none by default, their display change to flex based on the number of players selected on index.html
function displayPlayersStats() {
  for (let i = 1; i <= params.numberOfPlayers; i++) {
    document.getElementById(`player-${i}-row`).style.display = "flex"
  }
}

// count number of moves player has played
function countMoves() {
  document.getElementById(`moves-number-${currentPlayer}`).innerHTML =
    +document.getElementById(`moves-number-${currentPlayer}`).innerHTML + 1
}

function timer() {
  setInterval(() => {
    seconds++
    let formattedTime = formatTimer()
    displayTimer(formattedTime)
  }, 1000)
}

function formatTimer() {
  let hrs = Math.floor(seconds / 3600)
  let mins = Math.floor((seconds % 3600) / 60)
  let secsRemaining = Math.floor(seconds % 60)
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secsRemaining.toString().padStart(2, '0')}`;
}

function displayTimer(formattedTime) {
  document.getElementById("timer-number").innerHTML = formattedTime
}

function checkWin() {
  let numberOfAllCells = document.querySelectorAll(".cell-overlay").length
  let numberOfrevealedCells = document.querySelectorAll(".cell-overlay-remove").length
  console.log(numberOfAllCells)
  console.log(numberOfrevealedCells)
  if (numberOfAllCells == numberOfrevealedCells) {
    alert("you won")
  }
}

// Call functions section
// saves the received parameter in params constant
const params = getQueryParam();
createCell()
themeCells()
createCellOverlay()
hideOverlay()
document.addEventListener("call-extractCellsContents()", extractCellsContents)  // related to dispatchEvent inside extractPairSelectedCells()
document.addEventListener("call-checkSimilarity()", checkSimilarity)  // related to dispatchEvent inside extractCellsContents()
displayPlayersStats()
document.addEventListener("call-selectCurrentPlayer()", selectCurrentPlayer)  // related to dispatchEvent inside checkSimilarity()
document.addEventListener("call-highlightCurrentPlayer()", highlightCurrentPlayer)  // related to dispatchEvent inside checkSimilarity()
document.addEventListener("call-countMoves()", countMoves)  // related to dispatchEvent inside checkSimilarity()
extractPairSelectedCells()
timer()
document.addEventListener("call-checkWin()", checkWin)  // related to dispatchEvent inside checkSimilarity()
