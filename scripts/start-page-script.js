"use strict"

// getting the entered parameters
document.getElementById("setting-form").addEventListener("submit", function(event) {
  console.log("setting-form submitted")
  event.preventDefault()

  const formData = new FormData(this)

  const theme = formData.get("theme")
  const numberOfPlayers = formData.get("number-of-players")
  const gridSize = formData.get("grid-size")
  let errorMessage = ""

  if (!theme) {
    errorMessage += "Theme is not selected\n"
  }
  if (!numberOfPlayers) {
    errorMessage += "Number of players is not selected\n"
  }
  if (!gridSize) {
    errorMessage += "Grid size is not selected"
  }
  if (errorMessage) {
    alert(errorMessage)
  } else {
    const queryString = `?theme=${encodeURIComponent(theme)}&numberOfPlayers=${encodeURIComponent(numberOfPlayers)}&gridSize=${encodeURIComponent(gridSize)}`
    window.location.href = "gamepage.html" + queryString  //  parameters get passed with url to the next page
  }
})
