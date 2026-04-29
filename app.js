// -- BUTTONS -- //
const retryButton = document.getElementById("retry");
const mainMenuButton = document.getElementById("mainmenu");
const extraLifeYes = document.getElementById("extra-life-yes-button");
const extraLifeNo = document.getElementById("extra-life-no-button");
const VolumeIcon = document.querySelector('.Volume');
const friendYes = document.getElementById("Friend-Y-button");
const friendNo = document.getElementById("Friend-N-button");
const indexContinue = document.getElementById("index-continue")
const clickContinue = document.getElementById("click-continue");
const yesNo = document.getElementById("yesNo")
const attackButton = document.getElementById("attack-button");
const defendButton = document.getElementById("defend-button");
const runButton = document.getElementById("run-button");
const playButton = document.getElementById("play-button");
const goBackButtonSecondPage = document.querySelector(".go-back-button");
const goBackBtn = document.querySelector(".go-back-button-text");
const continueBtn = document.querySelector(".continue-button-text");

// -- PAGES SCENES -- //
const sceneHome = document.getElementById("scene-home");
const sceneStory = document.getElementById("scene-story-mechanics");
const sceneFriend = document.getElementById("scene-friend");
const sceneMenu2 = document.getElementById("scene-menu2");
const sceneGameOver = document.getElementById("scene-gameover");
const sceneIntro = document.getElementById("scene-intro");
const sceneFriendYN = document.getElementById("scene-friend-yesno");
const sceneDecisionTwo = document.getElementById("scene-decision-two");
const sceneDecisionTwoIntro = document.getElementById("scene-decision-two-intro");
const sceneDecisionThree = document.getElementById("scene-decision-three");
const sceneCombat = document.getElementById("scene-combat");

// -- PROGRESS BAR -- //
const playerHealth = document.querySelectorAll(".health-progress");
const playerHunger = document.querySelectorAll(".hunger-progress");
const bigEyesHealth = document.querySelectorAll(".health-progress-bigEyes");

// -- BACKGROUND OVERLAYS -- //
const achievementsOverlayBackground = document.getElementById("achievements-overlay-background");
const creditsOverlayBackground = document.getElementById("credits-overlay-background");
const settingsOverlayBackground = document.getElementById("settings-overlay-background");

// -- OVERLAYS BUTTONS -- //
const settingsButton = document.querySelector('.Settings');
const achievementsButton = document.getElementById("achievements-button");
const creditsButton = document.getElementById("credits-button");

// -- OVERLAY -- //
const creditsOverlay = document.getElementById("credits-overlay-container");
const settingsOverlay = document.getElementById("settings-overlay-container");
const achievementsOverlay = document.getElementById("achievements-overlay-container");


// This is the switcher for each page active and hidden
function showScene(sceneToShow) {
    const allScenes = document.querySelectorAll(".scene");

    allScenes.forEach(scene => {
        scene.classList.remove("active");
        scene.classList.add("hidden");
    });

    sceneToShow.classList.remove("hidden");
    sceneToShow.classList.add("active");
}

function showOverlay(overlayToShow) {
    const allOverlays = document.querySelectorAll(".overlay");

    allOverlays.forEach(overlay => {
        overlay.classList.remove("active");
        overlay.classList.add("hidden");
    });

    overlayToShow.classList.remove("hidden");
    overlayToShow.classList.add("active");
}

function hideOverlay(overlayToHide) {
    overlayToHide.classList.remove("active");
    overlayToHide.classList.add("hidden");
}


// this saves the game process so there is no glitches
function saveState() {
    localStorage.setItem("gameState", JSON.stringify(state));
}

const items = [
    { name: "Bread", type: "food", hunger: 10, img: "/Images/bread.png" },
    { name: "Small Knife", type: "weapon", multi: 1.5, img: "/Images/knife.png" },
    { name: "Bandages", type: "heal", heal: 10, img: "/Images/knife.png" },
    { name: "Medkit", type: "heal", heal: 50, img: "/Images/knife.png" }
]

const player = {
    health: 100,
    hunger: 100,
    damage: 5,
    hasFriend: false,
    hasExtraLife: false,
    weapon: null
};

const monsterBigEyes = {
    health: 15,
    damage: 2.5,
};

function progressBars() {
    playerHealth.forEach(bar => {
        bar.value = player.health;
    });

    playerHunger.forEach(bar => {
        bar.value = player.hunger;
    });

    bigEyesHealth.forEach(bar => {
        bar.value = monsterBigEyes.health;
    });
}

let inventory = [];

function updateInventory() {
    //weapons
    if (player.weapon == "Rusty Knife") {
        player.damage *= 1.5;
        console.log(player.damage)
    }
}

function randomItem() {
    const index = Math.floor(Math.random() * items.length);
    return items[index];
}

function searchRoom() {
    const found = Math.random() < 0.7;

    if (!found) {
        console.log("You found nothing...");
        return;
    }

    addRandomItem();
}

function addRandomItem() {
    const item = randomItem();
    inventory.push(item);

    console.log("Found:", item.name);

    if (item.type === "weapon") {
        player.weapon = item;
    }
    updateInventory();
    renderInventory();
}

function renderInventory() {
    const slots = [
        document.getElementById("slot1"),
        document.getElementById("slot2"),
        document.getElementById("slot3"),
        document.getElementById("slot4"),
    ];

    slots.forEach(slot => slot.innerHTML = "");

    inventory.forEach((item, index) => {
        if (!slots[index]) return;

        slots[index].innerHTML = `
           <img src="${item.img}" alt="${item.name}" id="${item.name}">
       `;
    });
}

//random item test
if (document.getElementById("search")) {
    document.getElementById("search").onclick = () => {
        searchRoom()
    }
}

//combat
let playersTurn = true;
let fighting = true;
let playerDefending = false;

if (attackButton) {
    attackButton.onclick = () => {
        console.log("Attack clicked");

        if (!playersTurn || !fighting) return;
        monsterBigEyes.health -= player.damage;
        player.hunger -= 2.5;

        bigEyesHealth.forEach(bar => {
            bar.style.animation = "none";
            bar.offsetHeight;
            bar.style.animation = "shake 0.2s ease";
        });

        console.log("monster health", monsterBigEyes.health);

        progressBars();

        if (monsterBigEyes.health <= 0) {
            console.log("monster defeated");
            fighting = false;
            return;
        }
        endPlayerTurn();
    };
}

if (defendButton) {
    defendButton.onclick = () => {
        if (!playersTurn || !fighting) return;

        playerDefending = true;
        console.log("player defending");
        progressBars()
        endPlayerTurn();
    };
}

if (runButton) {
    runButton.onclick = () => {
        if (!playersTurn || !fighting) return;

        const escape = Math.random() < 0.5;

        if (escape) {
            fighting = false;
        }

        else {
            endPlayerTurn();
        }
    };
}

function endPlayerTurn() {
    playersTurn = false;

    setTimeout(() => {
        monsterTurn();
    }, 600);
}

function monsterTurn() {
    if (!fighting) return;

    let damage = monsterBigEyes.damage;

    if (playerDefending) {
        damage *= 0.5;
        playerDefending = false;
    }

    player.health -= damage;

    progressBars()

    playerHealth.forEach(bar => {
        bar.style.animation = "none";
        bar.offsetHeight;
        bar.style.animation = "shake 0.2s ease";
    });

    console.log("Player HP:", player.health);

    if (player.health <= 0) {
        console.log("Game Over");
        fighting = false;
    }
    playersTurn = true;
}

// Just the base for the audio, I will add a sound later
// let song = new Audio("sounds/heresound");

// To play/pause the music
// song.play();
// song.pause();

// Here is where we are gonna connect pages

function game() {

    // Settings Overlay
    if (settingsButton) {
        settingsButton.onclick = () => {
            showOverlay(settingsOverlay)
        }
    }

    if (settingsOverlay) {
        settingsOverlayBackground.onclick = () => {
            hideOverlay(settingsOverlay)
        }
    }

    if (indexContinue) {
        indexContinue.onclick = () => {
            indexContinue.style.animation = "ScaleUpFull 3s linear 0s infinite";
            let count = 0;
            const timer = setInterval(() => {
                count++;

                if (count >= 5) {
                    clickContinue.style.color = "black";
                }

                if (count >= 6) {
                    clearInterval(timer); // this fixed the loop between pages (stops timer)
                    indexContinue.style.animation = "none";
                    clickContinue.style.color = "#D9D9D9";
                    showScene(sceneMenu2);
                }
            }, 480);
        }
    }


    playButton.onclick = () => {
        showScene(sceneIntro);
        renderStep(currentStep);
    }

    if (goBackButtonSecondPage) {
        goBackButtonSecondPage.onclick = () => {
            showScene(sceneHome);
        }
    }

    // Overlay opening
    if (achievementsOverlay) {
        achievementsButton.onclick = () => {
            console.log("achivements")
            showOverlay(achievementsOverlay)
        }
    }

    if (creditsButton) {
        creditsButton.onclick = () => {
            showOverlay(creditsOverlay)
        }
    }

    // Overlay closing
    if (achievementsOverlay) {
        achievementsOverlayBackground.onclick = () => {
            hideOverlay(achievementsOverlay)
        }
    }
    if (creditsOverlay) {
        creditsOverlayBackground.onclick = () => {
            console.log("Hello world!")
            hideOverlay(creditsOverlay)
        }
    }

    if (friendYes) {
        friendYes.onclick = () => {
            player.hasFriend = true;
            showScene(sceneFriendYN);
        };
    }

    if (friendNo) {
        friendNo.onclick = () => {
            player.hasFriend = false;
            showScene(sceneStory);
        };
    }


    if (sceneGameOver.classList.contains("active")) {
        mainMenuButton.addEventListener("click", function () {
            showScene(sceneHome);
        });
        retryButton.addEventListener("click", function () {
            showScene(sceneMenu2);
        });
        extraLifeNo.addEventListener("click", function () {
            showScene(sceneHome);
        });
        extraLifeYes.addEventListener("click", function () {
            showScene("--Here is the page that they are in here");
        });
    }
    progressBars()
};


updateInventory()
game()

console.log(player.health)
console.log(player.hasExtraLife)
console.log(monsterBigEyes.health)

// -- DIALOG HERE -- // -- DIALOG HERE -- // -- DIALOG HERE -- // -- DIALOG HERE -- //

const pickAnderdingusBtn = document.getElementById("pick-anderdingus");
const pickJustinBtn = document.getElementById("pick-justin");

let currentStep = "intro0";

const story = {
    intro0: {
        type: "dialogue",
        speaker: "The Narrator",
        image: null,
        bgImage: "/Images/Introduction-image.png",
        text: "On a seemingly normal night, a 17 year old Teddy Barragan wakes up after a long nap.",
        options: [
            { text: "> Continue", next: "intro1" }
        ]
    },

    intro1: {
        type: "dialogue",
        speaker: "Teddy",
        image: "/Images/Teddy.png",
        bgImage: "/Images/Introduction-image.png",
        text: "I'm so hungry. Maybe I should get some McDonalds.",
        options: [
            { text: "Go Back >", next: "intro0" },
            { text: "> Continue", next: "intro2" }
        ]
    },

    intro2: {
        type: "dialogue",
        speaker: "Teddy",
        image: "/Images/Teddy.png",
        bgImage: "/Images/Introduction-image.png",
        text: "Should I turn on the TV to check the news real quick?",
        options: [
            { text: "Go Back >", next: "intro1" },
            { text: "> Continue", next: "tvDecision" }
        ]
    },

    tvDecision: {
        type: "choiceIntro",
        speaker: "The Narrator",
        image: null,
        bgImage: "/Images/Introduction-image.png",
        text: "What do you do?",
        options: [
            { text: "Turn on TV", next: "tvNews" },
            { text: "Don't turn on TV", next: "afterNews" }
        ]
    },

    tvNews: {
        type: "dialogue",
        speaker: "The Narrator",
        image: null,
        bgImage: "/Images/Introduction-image.png",
        text: "Tv opened in the background, “35 year old Josh Ayala reported missing after taking a casual walk near Athens Lunatic Asylum at night.”",
        options: [
            { text: "> Continue", next: "tvReact" }
        ]
    },

    tvReact: {
        type: "dialogue",
        speaker: "Teddy",
        image: "/Images/Teddy.png",
        bgImage: "/Images/Introduction-image.png",
        text: "Isn't that the abandoned insane asylum? But brushes it off.",
        options: [
            { text: "Go Back >", next: "tvNews" },
            { text: "> Continue", next: "afterNews" }
        ]
    },

    afterNews: {
        type: "dialogue",
        speaker: "Teddy",
        image: "/Images/Teddy.png",
        bgImage: "/Images/Introduction-image.png",
        text: "Eh whatever, I am pretty hungry I wonder if I should call my friend to get some food",
        options: [
            // THERE IS NO GO BACK OPTION HERE BECAUSE IT WOULD CAUSE A GLITCH BETWEEN THE INTRODUCTION AND THE TV DECISION
            { text: "> Continue", next: "decisionFriend" } // HERE IT HIDES INTRODUCTION AND OPENS IF HE WANTS TO CALL A FRIEND HTML
        ]
    },


};

// here is the brain of the whole dialog system
function renderStep(stepId) {
    //see the current step in the story
    const step = story[stepId];

    if (!step || !step.options) return;

    currentStep = stepId;

    if (step.type === "choiceIntro") {
        showScene(sceneDecisionTwoIntro);
    } else {
        showScene(sceneIntro);
    }

    const activeScene = document.querySelector(".scene.active");
    const activeSpeaker = activeScene.querySelector(".title-text");
    const activeDialogue = activeScene.querySelector(".description-text");
    const activeImage = activeScene.querySelector(".image-text");
    const activeDecision1 = activeScene.querySelector(".decision1");
    const activeDecision2 = activeScene.querySelector(".decision2");
    const activeDecision3 = activeScene.querySelector(".decision3");
    const linkText = activeScene.querySelector(".link-text");

    activeSpeaker.textContent = step.speaker + ":"; // changes text-story in box
    activeDialogue.textContent = step.text; // changes speaker in box
    // changes image in box
    if (step.image) {
        activeImage.style.display = "block";
        activeImage.src = step.image;
    } else {
        activeImage.style.display = "none";
    }

    if (step.bgImage) {
        activeScene.style.backgroundImage = `url('${step.bgImage}')`;
        activeScene.style.backgroundSize = "cover";
        activeScene.style.backgroundPosition = "center";
    } else {
        activeScene.style.backgroundImage = "none";
    }

    if (linkText) {
        if (step.options.length === 1) {
            linkText.style.justifyContent = "flex-end";
        } else {
            linkText.style.justifyContent = "";
        }
    }

    const buttons = [activeDecision1, activeDecision2, activeDecision3];

    // this is where the options for each step are created and if there is no option for that button it hides it
    buttons.forEach((btn, i) => {
        if (!btn) return;

        if (step.options[i]) {
            btn.style.display = "block";
            btn.textContent = step.options[i].text;

            btn.onclick = () => {
                const next = step.options[i].next;

                if (next === "decisionFriend") {
                    showScene(sceneFriendYN);
                    return;
                }

                if (!next) return;

                renderStep(next);
            };

        } else {
            btn.style.display = "none";
        }
    });

}
