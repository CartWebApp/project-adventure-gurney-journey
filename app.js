
//Buttons
const retryButton = document.getElementById("retry");
const mainMenuButton = document.getElementById("mainmenu");
const extraLifeYes = document.getElementById("extra-life-yes-button");
const extraLifeNo = document.getElementById("extra-life-no-button");
const VolumeIcon = document.querySelector('.Volume');
const SettingIcon = document.querySelector('.Settings');
const friendYes = document.getElementById("Friend-Y-button");
const friendNo = document.getElementById("Friend-N-button");

const yesNo = document.getElementById("yesNo")

let player = {
    
    health: 100,
    hasFriend: false,
    hasExtraLife: false
    
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
    window.location.href = "/index.html";
});

retryButton.addEventListener("click", function() {
    window.location.href = "Second-main.html";
});

extraLifeNo.addEventListener("click", function() {
    window.location.href = "/index.html";
});

extraLifeYes.addEventListener("click", function() {
    window.location.href = "(--Here is the page that they are in--).html";
});

if (player[hasExtraLife] = false) {
    yesNo.style.display = "none";
    console.log("no life")
}


function gameRender() {

}

gameRender()

