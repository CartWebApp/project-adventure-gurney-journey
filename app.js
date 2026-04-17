const retryButton = document.getElementById("retry")
const mainMenuButton = document.getElementById("mainmenu")





let player = {
    health: 100,
    hasFriend: false
};

document.getElementById("Friend-Y-button").onclick = () => {
    player.hasFriend = true;
};


// Just the base for the audio, I will add a sound later
let audio = new Audio("sounds/heresound");

// To play the music
song.play();

// To pause the music
song.pause();

// Here is where we are gonna connect pages
mainMenuButton.addEventListener("click", function() {
    window.location.href = "index.html";
})

