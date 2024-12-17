"use strict"

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
  "E:\coding\ht\memory-game\assets\icons\musical_music_orchestra_instrument_flute_icon_262878.png",
  "E:\coding\ht\memory-game\assets\icons\orchestra_musical_instrument_wind_music_saxophone_icon_262833.png",
  "E:\coding\ht\memory-game\assets\icons\orchestra_musical_instrument_wind_music_trumpet_icon_262837.png",
  "E:\coding\ht\memory-game\assets\icons\organs_piano_music_keyboard_icon_262860.png",
  "E:\coding\ht\memory-game\assets\icons\percussion_orchestra_triangle_music_instrument_icon_262872.png",
  "E:\coding\ht\memory-game\assets\icons\song_disc_compact_music_note_musical_cd_icon_262858.png",
  "E:\coding\ht\memory-game\assets\icons\woofer_speaker_audio_system_music_sound_subwoofer_icon_262859.png"
]

function getQueryParam() {
  const params = {}
  const queryString = window.location.search.slice(1)
  const pairs = queryString.split("&")
  pairs.forEach(pair => {
    let [key, value] = pair.split("=")
    params[encodeURIComponent(key)] = encodeURIComponent(value || "")
  })
  return params
}

const params = getQueryParam()
