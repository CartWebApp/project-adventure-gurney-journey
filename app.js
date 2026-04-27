
//Buttons
const retryButton = document.getElementById("retry");
const mainMenuButton = document.getElementById("mainmenu");
const extraLifeYes = document.getElementById("extra-life-yes-button");
const extraLifeNo = document.getElementById("extra-life-no-button");
const VolumeIcon = document.querySelector('.Volume');
const SettingIcon = document.querySelector('.Settings');
const friendYes = document.getElementById("Friend-Y-button");
const friendNo = document.getElementById("Friend-N-button");
const indexContinue = document.getElementById("index-continue")
const clickContinue = document.getElementById("click-continue");

const yesNo = document.getElementById("yesNo")

//progress bars
const playerHealth = document.getElementById("health-progress");
const playerHunger = document.getElementById("hunger-progress");

const bigEyesHealth = document.getElementById("health-progress-bigEyes");

// this saves the game process so there is no glitches
function saveState() {
    localStorage.setItem("gameState", JSON.stringify(state));
}

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

    if (document.URL.includes("/index.html")) {
        indexContinue.onclick = () => {
            indexContinue.style.animation = "ScaleUpFull 3s linear 0s infinite";
            let count = 0;
            const timer = setInterval(() => {
                count++;

                if (count >= 5) {
                    clickContinue.style.color = "black";
                }

                if (count >= 6) {
                    window.location.href = "/OtherPages/Second-main.html";
                }
            }, 480);

            // for(let i = 0; i >= 3; i++) {

            //     if (i == 3) {
            //         indexContinue.remove
            //         window.location.href = "/OtherPages/Second-main.html";
            //     }

            // }
        }
    }


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

    playerHealth.value = player.health;
    playerHunger.value = player.hunger;
    bigEyesHealth.value = monsterBigEyes.health;

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


// -- DIALOG HERE -- // -- DIALOG HERE -- // -- DIALOG HERE -- // -- DIALOG HERE -- //

const friend = localStorage.getItem("friend");

if (friend === "anderdingus") {
    // Anderdingus path
    console.log("Anderdingus selected");
}

else if (friend === "justin") {
    // Justin path
    console.log("Justin selected");
}

else {
    // NO FRIEND path
    console.log("Solo path");
}

const story = {
    intro1: {
        type: "dialogue",
        speaker: "Teddy",
        image: "/Images/Teddy.png",
        text: "I'm so hungry. Maybe I should get some McDonalds.",
        next: "intro2"
    },

    intro2: {
        type: "dialogue",
        speaker: "Teddy",
        image: "/Images/Teddy.png",
        text: "Should I turn on the TV to check the news real quick?",
        next: "tvChoice"
    },

    tvChoice: {
        type: "choice",
        speaker: "The Narrator",
        image: null,
        text: "What do you do?",
        options: [
            { text: "Turn on TV", next: "tvNews" },
            { text: "Don't turn on TV", next: "no_tv" }
        ]
    },

    tv_news: {
        type: "dialogue",
        speaker: "TV",
        image: "/Images/tv.png",
        text: "35-year-old Josh Ayala reported missing near Athens Lunatic Asylum.",
        next: "tv_react"
    },

    tv_react: {
        type: "dialogue",
        speaker: "Teddy",
        image: "/Images/teddy.png",
        text: "Isn't that the abandoned insane asylum?",
        next: "after_news"
    },

    after_news: {
        type: "dialogue",
        speaker: "Teddy",
        image: "/Images/teddy.png",
        text: "Eh whatever… I'm still hungry.",
        next: "friend_choice"
    }
};