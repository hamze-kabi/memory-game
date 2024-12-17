"use strict"

// addresses of icons
const icons = [
  "E:\coding\ht\memory-game\assets\icons\bagpipes_wind_instrument_musical_music_cultures_bagpipe_icon_262832.png",
  "E:\coding\ht\memory-game\assets\icons\beat_tempo_music_rhythm_metronome_icon_262835.png",
  "E:\coding\ht\memory-game\assets\icons\chimes_music_percussion_instrument_musical_orchestra_icon_262854.png",
  "E:\coding\ht\memory-game\assets\icons\folk_musical_instrument_wind_harmonica_music_icon_262877.png",
  "E:\coding\ht\memory-game\assets\icons\headphones_music_audio_electronics_icon_262861.png",
  "E:\coding\ht\memory-game\assets\icons\instrument_orchestra_music_percussion_musical_conga_icon_262856.png",
  "E:\coding\ht\memory-game\assets\icons\instrument_string_bass_guitar_electric_rock_music_icon_262845.png",
  "E:\coding\ht\memory-game\assets\icons\keyboard_musical_instrument_music_organ_piano_icon_262839.png",
  "E:\coding\ht\memory-game\assets\icons\maracas_latin_music_pair_musical_instrument_icon_262852.png",
  "E:\coding\ht\memory-game\assets\icons\marimba_orchestra_instrument_idiophone_music_icon_262844.png",
  "E:\coding\ht\memory-game\assets\icons\mesoamerican_instrument_musical_music_cultures_ocarina_icon_262863.png",
  "E:\coding\ht\memory-game\assets\icons\music_folk_orchestra_cultures_instrument_musical_accordion_icon_262853.png",
  "E:\coding\ht\memory-game\assets\icons\music_instrument_percussion_drum_snare_icon_262876.png",
  "E:\coding\ht\memory-game\assets\icons\music_lyre_musical_instrument_string_orchestra_icon_262834.png",
  "E:\coding\ht\memory-game\assets\icons\music_microphone_sing_stand_mic_electronics_icon_262873.png",
  "E:\coding\ht\memory-game\assets\icons\music_note_musical_book_stand_icon_262868.png",
  "E:\coding\ht\memory-game\assets\icons\music_string_chinese_instrument_musical_guzheng_icon_262836.png",
  "E:\coding\ht\memory-game\assets\icons\musical_djembe_cultures_music_percussion_instrument_drum_icon_262862.png",
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

// saves the received parameter in params constant
const params = getQueryParam();

// creates cells based on params.theme and params.gridSize
function createCell() {
  const theme = params.theme

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
  console.log(window.getComputedStyle(cells).getPropertyValue('grid-template-areas'));

  let cellId = -1
  for (let n = 1; n<=gridSize * multiplier; n++) {  // gridSize * multiplier equals number of cells to be created
    for (let m = 0; m <= 1; m++) {
      // creating cells
      cellId += 1
      let cell = document.createElement("div")
      cell.classList.add("cell")
      cell.id = `${cellId}`
      cell.style.gridArea = `cell${cellId}`
      cells.appendChild(cell)
    }
  }
}

createCell()