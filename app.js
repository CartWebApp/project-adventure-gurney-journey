
//Buttons
const retryButton = document.getElementById("retry");
const mainMenuButton = document.getElementById("mainmenu");
const extraLifeYes = document.getElementById("extra-life-yes-button");
const extraLifeNo = document.getElementById("extra-life-no-button");
const VolumeIcon = document.querySelector('.Volume');
const SettingIcon = document.querySelector('.Settings');
const friendYes = document.getElementById("Friend-Y-button");
const friendNo = document.getElementById("Friend-N-button");

let player = {
    health: 100,
    hasFriend: false,
    extraLife: false
};



/*
document.getElementById("Friend-Y-button").onclick = () => {
    player.hasFriend = true;
};
*/


// Just the base for the audio, I will add a sound later
let song = new Audio("sounds/heresound");

// To play/pause the music
song.play();
song.pause();

// Here is where we are gonna connect pages
mainMenuButton.addEventListener("click", function() {
    window.location.href = "index.html";
});

retryButton.addEventListener("click", function() {
    window.location.href = "Second-main.html";
});

extraLifeNo.addEventListener("click", function() {
    window.location.href = "index.html";
});

extraLifeYes.addEventListener("click", function() {
    window.location.href = "(--Here is the page that they are in--).html";
});

function gameRender() {
    if (extralife == true)


    if (player[health] <= 0) {
        window.location.href = "Game-over.html";
    }
}