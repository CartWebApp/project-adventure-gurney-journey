
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

const player = {
    health: 100,
    hunger: 100,
    damage: 5,
    hasFriend: false,
    hasExtraLife: false,
};

const monsterBigEyes = {
    health: 15,
    damage: 2.5,
};


let inventory = [];


// Just the base for the audio, I will add a sound later
// let song = new Audio("sounds/heresound");

// To play/pause the music
// song.play();
// song.pause();


// Here is where we are gonna connect pages



function game() {


    if (document.URL.includes("OtherPages/Second-main.html")) {
        document.getElementById("play-button").onclick = () => {
            window.location.href = "Introduction-page.html";
        }
        document.getElementById("go-back-button").onclick = () => {
            window.location.href = "/index.html";
        }

    }

    if (document.URL.includes("OtherPages/Friend-yes-no.html")) {

        document.getElementById("Friend-Y-button").onclick = () => {
            player.hasFriend = true;
            window.location.href = "Select-friend.html";
            console.log("Has Friend:", player.hasFriend)
        };
        document.getElementById("Friend-N-button").onclick = () => {
            player.hasFriend = false;
            window.location.href = "";
            console.log("Has Friend:", player.hasFriend)
        };

    }

    if (document.URL.includes("OtherPages/Game-over.html")) {

        mainMenuButton.addEventListener("click", function () {
            window.location.href = "/index.html";
        });
        retryButton.addEventListener("click", function () {
            window.location.href = "Second-main.html";
        });
        extraLifeNo.addEventListener("click", function () {
            window.location.href = "/index.html";
        });
        extraLifeYes.addEventListener("click", function () {
            window.location.href = "(--Here is the page that they are in--).html";
        });

    }


    document.getElementById("health-progress").value = player.health;
    document.getElementById("hunger-progress").value = player.hunger;


}

function monsterAttack() {
    const damage = 0;
    player.health -= damage;
}


monsterAttack()
game()

console.log(player.health)
console.log(player.hasExtraLife)
console.log(monsterBigEyes.health)