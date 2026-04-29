// NEXT THING TO DO IS TO CONNECT THE GAME OVER PAGE WHEN THERE IS A GAME OVER TYPE STEP
// CONNECT OVERLAYS BUTTONS WITH PAGES


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

let combatWinNext = null;
let combatLoseNext = null;

const player = {
    health: 100,
    hunger: 100,
    damage: 5,
    hasFriend: false,
    hasExtraLife: false,
    weapon: null,
    friend: null
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
            fighting = false;
            progressBars();
            if (combatWinNext) {
                renderStep(combatWinNext);
            }
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
        fighting = false;
        progressBars();
        if (combatLoseNext) {
            renderStep(combatLoseNext);
        } else {
            showScene(sceneGameOver);
        }
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
            showScene(sceneFriend);
        };
    }

    if (friendNo) {
        friendNo.onclick = () => {
            player.hasFriend = false;
            currentStep = "noFriend0";
            showScene(sceneStory);
            renderStep(currentStep);
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

let currentStep = "intro0";

const pickAnderdingusBtn = document.getElementById("pick-anderdingus");
const pickJustinBtn = document.getElementById("pick-justin");

if (pickAnderdingusBtn) {
    pickAnderdingusBtn.onclick = () => {
        player.friend = "Anderdingus";
        currentStep = "withAnderdingus0";
        showScene(sceneStory);
        renderStep(currentStep);
    };
}

if (pickJustinBtn) {
    pickJustinBtn.onclick = () => {
        player.friend = "Justin";
        currentStep = "withJustin0";
        showScene(sceneStory);
        renderStep(currentStep);
    };
}

const story = {
    intro0: {
        type: "dialogueIntro",
        speaker: "The Narrator",
        image: null,
        bgImage: "/Images/Introduction-image.png",
        text: "On a seemingly normal night, a 17 year old Teddy Barragan wakes up after a long nap.",
        options: [
            { text: "> Continue", next: "intro1" }
        ]
    },

    intro1: {
        type: "dialogueIntro",
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
        type: "dialogueIntro",
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
        type: "dialogueIntro",
        speaker: "The Narrator",
        image: null,
        bgImage: "/Images/Introduction-image.png",
        text: "Tv opened in the background, “35 year old Josh Ayala reported missing after taking a casual walk near Athens Lunatic Asylum at night.”",
        options: [
            { text: "> Continue", next: "tvReact" }
        ]
    },

    tvReact: {
        type: "dialogueIntro",
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
        type: "dialogueIntro",
        speaker: "Teddy",
        image: "/Images/Teddy.png",
        bgImage: "/Images/Introduction-image.png",
        text: "Eh whatever, I am pretty hungry I wonder if I should call my friend to get some food",
        options: [
            // THERE IS NO GO BACK OPTION HERE BECAUSE IT WOULD CAUSE A GLITCH BETWEEN THE INTRODUCTION AND THE TV DECISION
            { text: "> Continue", next: "decisionFriend" } // HERE IT HIDES INTRODUCTION AND OPENS IF HE WANTS TO CALL A FRIEND HTML
        ]
    },

    // -- ENDING 1: ANDERDINGUS -- //

    withAnderdingus0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy calls Anderdingus, the phone rings 3 times until Anderdingus picks up...",
        options: [
            { text: "> Continue", next: "withAnderdingus1" }
        ]
    },

    withAnderdingus1: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "Yo whats up?",
        options: [
            { text: "< Go Back", next: "withAnderdingus0" },
            { text: "> Continue", next: "withAnderdingus2" }
        ]
    },

    withAnderdingus2: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Nothing much, I'm gonna get some food you wanna come?",
        options: [
            { text: "< Go Back", next: "withAnderdingus1" },
            { text: "> Continue", next: "withAnderdingus3" }
        ]
    },

    withAnderdingus3: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "Depends man, what food are you getting?",
        options: [
            { text: "< Go Back", next: "withAnderdingus2" },
            { text: "> Continue", next: "withAnderdingus4" }
        ]
    },

    withAnderdingus4: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Probably McDonalds.",
        options: [
            { text: "< Go Back", next: "withAnderdingus3" },
            { text: "> Continue", next: "withAnderdingus5" }
        ]
    },

    withAnderdingus5: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "McDonalds? The one near the insane asylum? No way man did you see the news?",
        options: [
            { text: "< Go Back", next: "withAnderdingus4" },
            { text: "> Continue", next: "withAnderdingus6" }
        ]
    },

    withAnderdingus6: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Yeah it's fine though, we're gonna be fine.",
        options: [
            { text: "< Go Back", next: "withAnderdingus5" },
            { text: "> Continue", next: "withAnderdingus7" }
        ]
    },

    withAnderdingus7: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "I am not going there bro.",
        options: [
            { text: "< Go Back", next: "withAnderdingus6" },
            { text: "> Continue", next: "withAnderdingus8" }
        ]
    },

    withAnderdingus8: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "I'm paying.",
        options: [
            { text: "< Go Back", next: "withAnderdingus7" },
            { text: "> Continue", next: "withAnderdingus9" }
        ]
    },

    withAnderdingus9: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "I mean I guess...",
        options: [
            { text: "< Go Back", next: "withAnderdingus8" },
            { text: "> Continue", next: "withAnderdingusMcD0" }
        ]
    },

    withAnderdingusMcD0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "At McDonalds...",
        options: [
            { text: "< Go Back", next: "withAnderdingus9" },
            { text: "> Continue", next: "withAnderdingusMcD1" }
        ]
    },

    withAnderdingusMcD1: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Can I get a large big mac meal with a coke, oreo mcflurry, 3 McChickens and a large fanta, and large fries.",
        options: [
            { text: "< Go Back", next: "withAnderdingusMcD0" },
            { text: "> Continue", next: "withAnderdingusMcD2" }
        ]
    },

    withAnderdingusMcD2: {
        type: "dialogueStory",
        speaker: "Cashier",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Will that be all?",
        options: [
            { text: "< Go Back", next: "withAnderdingusMcD1" },
            { text: "> Continue", next: "withAnderdingusMcD3" }
        ]
    },

    withAnderdingusMcD3: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Yeah.",
        options: [
            { text: "< Go Back", next: "withAnderdingusMcD2" },
            { text: "> Continue", next: "withAnderdingusMcD4" }
        ]
    },

    withAnderdingusMcD4: {
        type: "dialogueStory",
        speaker: "Cashier",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "That will be $32.58, would you like to round up for charity?",
        options: [
            { text: "< Go Back", next: "withAnderdingusMcD3" },
            { text: "> Continue", next: "withAnderdingusMcD5" }
        ]
    },

    withAnderdingusMcD5: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Sure.",
        options: [
            { text: "< Go Back", next: "withAnderdingusMcD4" },
            { text: "> Continue", next: "withAnderdingusMcD6" }
        ]
    },

    withAnderdingusMcD6: {
        type: "dialogueStory",
        speaker: "Cashier",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Okay that will be $33 flat.",
        options: [
            { text: "< Go Back", next: "withAnderdingusMcD5" },
            { text: "> Continue", next: "withAnderdingusMcD7" }
        ]
    },

    withAnderdingusMcD7: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy pays for the food and they wait for their food... They get their food.",
        options: [
            { text: "< Go Back", next: "withAnderdingusMcD6" },
            { text: "> Continue", next: "withAnderdingusFoodChoice" }
        ]
    },

    withAnderdingusFoodChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "What do you do with the food?",
        options: [
            { text: "Finish all the food", next: "withAnderdingusFinishFood" },
            { text: "Save some for later", next: "withAnderdingusSaveFood" }
        ]
    },

    withAnderdingusFinishFood: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy and Anderdingus finish all the McDonalds.",
        options: [
            { text: "> Continue", next: "withAnderdingusAsylum0" }
        ]
    },

    withAnderdingusSaveFood: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        hungerChange: 15,
        text: "Anderdingus saves some McChickens for later...",
        options: [
            { text: "> Continue", next: "withAnderdingusAsylum0" }
        ]
    },

    withAnderdingusAsylum0: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Yo we should check out the insane asylum.",
        options: [
            { text: "> Continue", next: "withAnderdingusAsylum1" }
        ]
    },

    withAnderdingusAsylum1: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "Bro why.",
        options: [
            { text: "< Go Back", next: "withAnderdingusAsylum0" },
            { text: "> Continue", next: "withAnderdingusAsylum2" }
        ]
    },

    withAnderdingusAsylum2: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Just to check it out dude we aren't gonna go inside just walk around.",
        options: [
            { text: "< Go Back", next: "withAnderdingusAsylum1" },
            { text: "> Continue", next: "withAnderdingusAsylum3" }
        ]
    },

    withAnderdingusAsylum3: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "I guess bro.",
        options: [
            { text: "< Go Back", next: "withAnderdingusAsylum2" },
            { text: "> Continue", next: "withAnderdingusAsylum4" }
        ]
    },

    withAnderdingusAsylum4: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "You think the missing guy was walking down here as well?",
        options: [
            { text: "< Go Back", next: "withAnderdingusAsylum3" },
            { text: "> Continue", next: "withAnderdingusAsylum5" }
        ]
    },

    withAnderdingusAsylum5: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Probably, we are almost at the insane asylum.",
        options: [
            { text: "< Go Back", next: "withAnderdingusAsylum4" },
            { text: "> Continue", next: "withAnderdingusAsylum6" }
        ]
    },

    withAnderdingusAsylum6: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "Yo there is light coming from the door.",
        options: [
            { text: "< Go Back", next: "withAnderdingusAsylum5" },
            { text: "> Continue", next: "withAnderdingusAsylum7" }
        ]
    },

    withAnderdingusAsylum7: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "I see it, dude we should go inside.",
        options: [
            { text: "< Go Back", next: "withAnderdingusAsylum6" },
            { text: "> Continue", next: "withAnderdingusAsylum8" }
        ]
    },

    withAnderdingusAsylum8: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "You said we wouldn't.",
        options: [
            { text: "< Go Back", next: "withAnderdingusAsylum7" },
            { text: "> Continue", next: "withAnderdingusAsylum9" }
        ]
    },

    withAnderdingusAsylum9: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "We will leave right away if there's something bad dude, I paid for the McDonalds.",
        options: [
            { text: "< Go Back", next: "withAnderdingusAsylum8" },
            { text: "> Continue", next: "withAnderdingusAsylum10" }
        ]
    },

    withAnderdingusAsylum10: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "I guess bro.",
        options: [
            { text: "< Go Back", next: "withAnderdingusAsylum9" },
            { text: "> Continue", next: "withAnderdingusEnter0" }
        ]
    },

    withAnderdingusEnter0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "They enter the insane asylum and as soon as they enter, the door shuts instantly.",
        options: [
            { text: "< Go Back", next: "withAnderdingusAsylum10" },
            { text: "> Continue", next: "withAnderdingusEnter1" }
        ]
    },

    withAnderdingusEnter1: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "Yo...",
        options: [
            { text: "< Go Back", next: "withAnderdingusEnter0" },
            { text: "> Continue", next: "withAnderdingusEnter2" }
        ]
    },

    withAnderdingusEnter2: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Its not opening dude.",
        options: [
            { text: "< Go Back", next: "withAnderdingusEnter1" },
            { text: "> Continue", next: "withAnderdingusDoorChoice" }
        ]
    },

    withAnderdingusDoorChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "What do you do?",
        options: [
            { text: "Ram the door yourself", next: "withAnderdingusRamSelf" },
            { text: "Tell Anderdingus to ram it", next: "withAnderdingusRamFriend" }
        ]
    },

    withAnderdingusRamSelf: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        healthChange: -10,
        text: "Teddy attempts to ram the door, but the door does not budge. During the process, Teddy injures himself by ramming the door too hard.",
        options: [
            { text: "> Continue", next: "withAnderdingusJosh0" }
        ]
    },

    withAnderdingusRamFriend: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Try ramming it open.",
        options: [
            { text: "> Continue", next: "withAnderdingusRamFriend2" }
        ]
    },

    withAnderdingusRamFriend2: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Anderdingus listens and attempts to ram the door. The door does not budge and both of you realize the door is not opening no matter how hard they try.",
        options: [
            { text: "> Continue", next: "withAnderdingusJosh0" }
        ]
    },

    withAnderdingusJosh0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "After attempting to open the door, they turn around and realize they are trapped and how dark and eerie this place is, but they also notice someone sitting down against the wall.",
        options: [
            { text: "> Continue", next: "withAnderdingusJosh1" }
        ]
    },

    withAnderdingusJosh1: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "Bro you see that?",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh0" },
            { text: "> Continue", next: "withAnderdingusJosh2" }
        ]
    },

    withAnderdingusJosh2: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Is he dead?",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh1" },
            { text: "> Continue", next: "withAnderdingusJosh3" }
        ]
    },

    withAnderdingusJosh3: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "Dude, that's the guy from the news!",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh2" },
            { text: "> Continue", next: "withAnderdingusJosh4" }
        ]
    },

    withAnderdingusJosh4: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "What happened to his leg?",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh3" },
            { text: "> Continue", next: "withAnderdingusJosh5" }
        ]
    },

    withAnderdingusJosh5: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "GET AWAY FROM ME!",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh4" },
            { text: "> Continue", next: "withAnderdingusJosh6" }
        ]
    },

    withAnderdingusJosh6: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Woah woah woah.",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh5" },
            { text: "> Continue", next: "withAnderdingusJosh7" }
        ]
    },

    withAnderdingusJosh7: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "Are you okay?",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh6" },
            { text: "> Continue", next: "withAnderdingusJosh8" }
        ]
    },

    withAnderdingusJosh8: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "Oh... I thought you guys were... something else...",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh7" },
            { text: "> Continue", next: "withAnderdingusJosh9" }
        ]
    },

    withAnderdingusJosh9: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "What happened to your leg?",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh8" },
            { text: "> Continue", next: "withAnderdingusJosh10" }
        ]
    },

    withAnderdingusJosh10: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "It got me.",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh9" },
            { text: "> Continue", next: "withAnderdingusJosh11" }
        ]
    },

    withAnderdingusJosh11: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "What got you?",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh10" },
            { text: "> Continue", next: "withAnderdingusJosh12" }
        ]
    },

    withAnderdingusJosh12: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "I don't know, but it's not human.",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh11" },
            { text: "> Continue", next: "withAnderdingusJosh13" }
        ]
    },

    withAnderdingusJosh13: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "You're telling us there's a monster here that will kill us?",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh12" },
            { text: "> Continue", next: "withAnderdingusJosh14" }
        ]
    },

    withAnderdingusJosh14: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "Two.",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh13" },
            { text: "> Continue", next: "withAnderdingusJosh15" }
        ]
    },

    withAnderdingusJosh15: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Alright dude enough games, how do we get out?",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh14" },
            { text: "> Continue", next: "withAnderdingusJosh16" }
        ]
    },

    withAnderdingusJosh16: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "There's a key.",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh15" },
            { text: "> Continue", next: "withAnderdingusJosh17" }
        ]
    },

    withAnderdingusJosh17: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Where is the key?",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh16" },
            { text: "> Continue", next: "withAnderdingusJosh18" }
        ]
    },

    withAnderdingusJosh18: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "One of the 'monsters' have it.",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh17" },
            { text: "> Continue", next: "withAnderdingusJosh19" }
        ]
    },

    withAnderdingusJosh19: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Very funny man, stop joking around.",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh18" },
            { text: "> Continue", next: "withAnderdingusScream" }
        ]
    },

    withAnderdingusScream: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Suddenly a loud scary, bone chilling scream was heard...",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh19" },
            { text: "> Continue", next: "withAnderdingusJosh20" }
        ]
    },

    withAnderdingusJosh20: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "You still think I'm joking?",
        options: [
            { text: "< Go Back", next: "withAnderdingusScream" },
            { text: "> Continue", next: "withAnderdingusJosh21" }
        ]
    },

    withAnderdingusJosh21: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "Okay so to leave we have to get the key from these monsters.",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh20" },
            { text: "> Continue", next: "withAnderdingusJosh22" }
        ]
    },

    withAnderdingusJosh22: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "Yeah.",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh21" },
            { text: "> Continue", next: "withAnderdingusJosh23" }
        ]
    },

    withAnderdingusJosh23: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "How do we do that?",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh22" },
            { text: "> Continue", next: "withAnderdingusJosh24" }
        ]
    },

    withAnderdingusJosh24: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "Like I said there are 2 monsters, the first monster only appears if you are alone but you cannot look at it, and the second monster, you just have to survive it.",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh23" },
            { text: "> Continue", next: "withAnderdingusJosh25" }
        ]
    },

    withAnderdingusJosh25: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "How do you know about the first monster?",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh24" },
            { text: "> Continue", next: "withAnderdingusJosh26" }
        ]
    },

    withAnderdingusJosh26: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "I had a friend.",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh25" },
            { text: "> Continue", next: "withAnderdingusJosh27" }
        ]
    },

    withAnderdingusJosh27: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Oh, I'm sorry. Anderdingus we have to get that key.",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh26" },
            { text: "> Continue", next: "withAnderdingusJosh28" }
        ]
    },

    withAnderdingusJosh28: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "No way dude, do you not see what they did to this guy.",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh27" },
            { text: "> Continue", next: "withAnderdingusJosh29" }
        ]
    },

    withAnderdingusJosh29: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "There's no other way, we will die here if we don't do anything, you are coming.",
        options: [
            { text: "< Go Back", next: "withAnderdingusJosh28" },
            { text: "> Continue", next: "withAnderdingusExplore0" }
        ]
    },

    withAnderdingusExplore0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy forces Anderdingus to explore, and after a while, Anderdingus finally agrees. They then search many rooms, finding weapons, food, and if they are lucky, a special item.",
        options: [
            { text: "> Continue", next: "withAnderdingusExplore1" }
        ]
    },

    withAnderdingusExplore1: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "After exploring they take a little break, they can rest up by recovering their hunger or health. After resting up and recovering, they find a suspicious room.",
        options: [
            { text: "> Continue", next: "withAnderdingusExplore2" }
        ]
    },

    withAnderdingusExplore2: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy and Anderdingus both slowly approach the room with caution, and as they glance into the room, the monster notices them and begins chasing.",
        options: [
            { text: "> Continue", next: "withAnderdingusChaseChoice" }
        ]
    },

    withAnderdingusChaseChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy and Anderdingus both run but it soon catches Anderdingus... What do you do?",
        options: [
            { text: "Keep running, save yourself", next: "withAnderdingusRunSelf" },
            { text: "Go back and save Anderdingus", next: "withAnderdingusSaveFriend" }
        ]
    },

    withAnderdingusRunSelf: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy looks back and sees Anderdingus slowing down, he extends his arm out to Teddy, trying to pull him forward. Just as they almost lock hands the monster catches Anderdingus. Anderdingus screams for help but Teddy thinks he can't do anything, so he continues running.",
        options: [
            { text: "> Continue", next: "withAnderdingusRunSelf2" }
        ]
    },

    withAnderdingusRunSelf2: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Anderdingus dies... Teddy runs and runs, looking for a safe spot, but just as he thinks he is safe, he hears footsteps.",
        options: [
            { text: "> Continue", next: "withAnderdingusRunSelf3" }
        ]
    },

    withAnderdingusRunSelf3: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Thinking that monster 2 had caught up with Teddy, he looks. A fatal mistake, it was not monster 2. Teddy locks eyes with monster 1 and realizes the completely different monster he is seeing is the one he should never look at. Teddy quickly turns around and sprints away, but it is useless. The monster instantly catches Teddy, and kills him.",
        options: [
            { text: "> Continue", next: "withAnderdingusGameOver" }
        ]
    },

    withAnderdingusGameOver: {
        type: "GameOver"
    },

    withAnderdingusSaveFriend: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy looks back and sees Anderdingus slowing down, he extends his arm out to Teddy, trying to pull him forward. Just as they almost lock hands the monster catches Anderdingus. Anderdingus screams for help while the monster is preparing to deal a fatal strike.",
        options: [
            { text: "> Continue", next: "withAnderdingusSaveFriend2" }
        ]
    },

    withAnderdingusSaveFriend2: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Then, the monster is sent back. Teddy had rammed into the monster at the last second just as Anderdingus was about to be struck. Teddy then helps Anderdingus up and they instantly run. They look back but the monster is gone...",
        options: [
            { text: "> Continue", next: "withAnderdingusAfterChase0" }
        ]
    },

    withAnderdingusAfterChase0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "They run until they feel somewhat safe, free of danger at least. Teddy and Anderdingus are both out of breath, tired and shaking from what they just experienced. They continue exploring but Anderdingus eventually says they should take a break.",
        options: [
            { text: "> Continue", next: "withAnderdingusBreakChoice" }
        ]
    },

    withAnderdingusBreakChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "What do you do?",
        options: [
            { text: "Continue exploring, no breaks", next: "withAnderdingusStorage0" },
            { text: "Take a break to rest and recover", next: "withAnderdingusRest" }
        ]
    },

    withAnderdingusRest: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        hungerChange: 20,
        healthChange: 15,
        text: "They take a moment to rest and recover before heading deeper into the asylum.",
        options: [
            { text: "> Continue", next: "withAnderdingusStorage0" }
        ]
    },

    withAnderdingusStorage0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "They continue exploring and they find the storage room of the insane asylum. However, the storage room is locked and there is a small box with an alarm.",
        options: [
            { text: "> Continue", next: "withAnderdingusStorageChoice" }
        ]
    },

    withAnderdingusStorageChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "What do you do?",
        options: [
            { text: "Do the puzzle to get into the storage room", next: "withAnderdingusStorageSolve" },
            { text: "Don't take the risk and continue exploring", next: "withAnderdingusRoom0" }
        ]
    },

    withAnderdingusStorageSolve: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy and Anderdingus search the storage room, and after searching more and more, they find a rusty knife. It will help them fight the monster, but there are most likely stronger weapons.",
        options: [
            { text: "> Continue", next: "withAnderdingusRoom0" }
        ]
    },

    withAnderdingusRoom0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy and Anderdingus continue exploring... They find another room, but luckily the door is not locked.",
        options: [
            { text: "> Continue", next: "withAnderdingusRoomChoice" }
        ]
    },

    withAnderdingusRoomChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "What do you do?",
        options: [
            { text: "Scavenge the room", next: "withAnderdingusRoomSearch" },
            { text: "Ignore the room, continue exploring", next: "withAnderdingusDeeper0" }
        ]
    },

    withAnderdingusRoomSearch: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy and Anderdingus search the room. They find absolutely nothing.",
        options: [
            { text: "> Continue", next: "withAnderdingusDeeper0" }
        ]
    },

    withAnderdingusDeeper0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "As Teddy and Anderdingus venture deeper into the asylum, the air becomes colder, the feeling of danger is more prominent. Maybe they will find something more useful in these rooms.",
        options: [
            { text: "> Continue", next: "withAnderdingusDeeper1" }
        ]
    },

    withAnderdingusDeeper1: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "What do you do?",
        options: [
            { text: "Search the rooms", next: "withAnderdingusDeeperSearch" },
            { text: "Go deeper into the asylum", next: "withAnderdingusTotem0" }
        ]
    },

    withAnderdingusDeeperSearch: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        hungerChange: 15,
        text: "Teddy and Anderdingus scavenge the rooms thoroughly, they are lucky enough to find some food to restore their hunger. After they finish searching they go deeper into the asylum.",
        options: [
            { text: "> Continue", next: "withAnderdingusTotem0" }
        ]
    },

    withAnderdingusTotem0: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "I think we should keep going, these rooms probably don't have anything we need.",
        options: [
            { text: "> Continue", next: "withAnderdingusTotemChoice" }
        ]
    },

    withAnderdingusTotemChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "What do you do?",
        options: [
            { text: "Search rooms", next: "withAnderdingusTotemFind" },
            { text: "Listen to Anderdingus, keep going", next: "withAnderdingusMachete0" }
        ]
    },

    withAnderdingusTotemFind: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "At first there is nothing useful, but as they search more and more, they find a weird looking totem.",
        options: [
            { text: "> Continue", next: "withAnderdingusTotemFind2" }
        ]
    },

    withAnderdingusTotemFind2: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "What is that?",
        options: [
            { text: "< Go Back", next: "withAnderdingusTotemFind" },
            { text: "> Continue", next: "withAnderdingusTotemFind3" }
        ]
    },

    withAnderdingusTotemFind3: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "I don't know but I'm gonna keep it just in case.",
        options: [
            { text: "< Go Back", next: "withAnderdingusTotemFind2" },
            { text: "> Continue", next: "withAnderdingusMachete0" }
        ]
    },

    withAnderdingusMachete0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "The deeper they go, the more and more danger they feel. They see many scratches and blood on the walls.",
        options: [
            { text: "> Continue", next: "withAnderdingusMachete1" }
        ]
    },

    withAnderdingusMachete1: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "This is probably where the monster stays.",
        options: [
            { text: "< Go Back", next: "withAnderdingusMachete0" },
            { text: "> Continue", next: "withAnderdingusMachete2" }
        ]
    },

    withAnderdingusMachete2: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "You think it leaves the key in his nest or something?",
        options: [
            { text: "< Go Back", next: "withAnderdingusMachete1" },
            { text: "> Continue", next: "withAnderdingusMachete3" }
        ]
    },

    withAnderdingusMachete3: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "I don't know, we don't even know if that thing has a nest. We should probably search more rooms to find more weapons, this rusty knife isn't doing much.",
        options: [
            { text: "< Go Back", next: "withAnderdingusMachete2" },
            { text: "> Continue", next: "withAnderdingusMachete4" }
        ]
    },

    withAnderdingusMachete4: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "There's some more rooms here they seem kinda empty though.",
        options: [
            { text: "< Go Back", next: "withAnderdingusMachete3" },
            { text: "> Continue", next: "withAnderdingusMacheteChoice" }
        ]
    },

    withAnderdingusMacheteChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "What do you do?",
        options: [
            { text: "Search the rooms", next: "withAnderdingusMacheteFind" },
            { text: "Go deeper to look for the nest of monster 2", next: "withAnderdingusHallway0" }
        ]
    },

    withAnderdingusMacheteFind: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "They search the rooms, seemingly empty, but they are thorough.",
        options: [
            { text: "> Continue", next: "withAnderdingusMacheteFind2" }
        ]
    },

    withAnderdingusMacheteFind2: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "Look what I found!",
        options: [
            { text: "< Go Back", next: "withAnderdingusMacheteFind" },
            { text: "> Continue", next: "withAnderdingusMacheteFind3" }
        ]
    },

    withAnderdingusMacheteFind3: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "No way is that a machete.",
        options: [
            { text: "< Go Back", next: "withAnderdingusMacheteFind2" },
            { text: "> Continue", next: "withAnderdingusMacheteFind4" }
        ]
    },

    withAnderdingusMacheteFind4: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "Yeah, it looks almost brand new too. It feels very sharp.",
        options: [
            { text: "< Go Back", next: "withAnderdingusMacheteFind3" },
            { text: "> Continue", next: "withAnderdingusMacheteFind5" }
        ]
    },

    withAnderdingusMacheteFind5: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "We stand a chance now.",
        options: [
            { text: "> Continue", next: "withAnderdingusHallway0" }
        ]
    },

    withAnderdingusHallway0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "The 2 boys feel like they can win against the monster now. So they continue searching. After walking around, going deeper and deeper, they find a long hallway, and at the end a mysterious room with blood trails leading to it. But there is also another room opposite the hallway...",
        options: [
            { text: "> Continue", next: "withAnderdingusHallwayChoice" }
        ]
    },

    withAnderdingusHallwayChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Which room do you go to?",
        options: [
            { text: "Go to the room at the end of the hallway", next: "withAnderdingusHallwayBad" },
            { text: "Go to the room opposite of the hallway", next: "withAnderdingusHallwayGood" }
        ]
    },

    withAnderdingusHallwayBad: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy and Anderdingus head towards the room, walking along the long hallway. But suddenly, monster 2 arrives behind them, angry that Teddy and Anderdingus were about to invade its nest. Enraged, the monster moves faster, fast enough to knock down Anderdingus almost instantly.",
        options: [
            { text: "> Continue", next: "withAnderdingusHallwayBad2" }
        ]
    },

    withAnderdingusHallwayBad2: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Anderdingus tries getting back up but the monster ensures he won't be able to. The monster stomps on Anderdingus's head. Teddy tries to use the machete against the monster. Teddy manages to cut off the monster's arm, but ends up taking a fatal hit in return. The monster then knocks away the machete and eats Teddy's whole head.",
        options: [
            { text: "> Continue", next: "withAnderdingusGameOver" }
        ]
    },

    withAnderdingusHallwayGood: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "They enter the room where they hear the monster near them. Luckily the monster doesn't notice them and heads towards the room at the end of the hallway which appears to be the nest of the monster. They realized it was right to come here instead of walking to the room at the end of the hallway.",
        options: [
            { text: "> Continue", next: "withAnderdingusHallwayGood2" }
        ]
    },

    withAnderdingusHallwayGood2: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "We should attack it when it's not paying attention.",
        options: [
            { text: "< Go Back", next: "withAnderdingusHallwayGood" },
            { text: "> Continue", next: "withAnderdingusHallwayGood3" }
        ]
    },

    withAnderdingusHallwayGood3: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "You think he is gonna sleep or something?",
        options: [
            { text: "< Go Back", next: "withAnderdingusHallwayGood2" },
            { text: "> Continue", next: "withAnderdingusHallwayGood4" }
        ]
    },

    withAnderdingusHallwayGood4: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "I don't know, we will see.",
        options: [
            { text: "< Go Back", next: "withAnderdingusHallwayGood3" },
            { text: "> Continue", next: "withAnderdingusHallwayGood5" }
        ]
    },

    withAnderdingusHallwayGood5: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "After waiting for a few minutes, the monster is asleep.",
        options: [
            { text: "> Continue", next: "withAnderdingusHallwayGood6" }
        ]
    },

    withAnderdingusHallwayGood6: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "It's sleeping, lets go.",
        options: [
            { text: "< Go Back", next: "withAnderdingusHallwayGood5" },
            { text: "> Continue", next: "withAnderdingusHallwayGood7" }
        ]
    },

    withAnderdingusHallwayGood7: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "They quietly approach the nest...",
        options: [
            { text: "> Continue", next: "withAnderdingusHallwayGood8" }
        ]
    },

    withAnderdingusHallwayGood8: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "I see the key.",
        options: [
            { text: "< Go Back", next: "withAnderdingusHallwayGood7" },
            { text: "> Continue", next: "withAnderdingusHallwayGood9" }
        ]
    },

    withAnderdingusHallwayGood9: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "They enter the room and approach the monster...",
        options: [
            { text: "> Continue", next: "withAnderdingusHallwayGood10" }
        ]
    },

    withAnderdingusHallwayGood10: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "We have to kill this thing before we get that key, you ready?",
        options: [
            { text: "< Go Back", next: "withAnderdingusHallwayGood9" },
            { text: "> Continue", next: "withAnderdingusHallwayGood11" }
        ]
    },

    withAnderdingusHallwayGood11: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus.png",
        bgImage: "Images/story-mechanics.png",
        text: "Yeah.",
        options: [
            { text: "< Go Back", next: "withAnderdingusHallwayGood10" },
            { text: "> Continue", next: "withAnderdingusFinalFight" }
        ]
    },

    withAnderdingusFinalFight: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy swings his machete on the monster's head, but Teddy fails to completely cut off the head. The monster wakes up and screams, Teddy and Anderdingus both back off and prepare to fight to the death with the monster...",
        options: [
            { text: "> Continue", next: "withAnderdingusCombat" }
        ]
    },

    withAnderdingusCombat: {
        type: "combat",
        monsterHealth: 50,
        winNext: "withAnderdingusWin",
        loseNext: "withAnderdingusLose",
    },

    withAnderdingusWin: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Monster dies. Teddy grabs the key and heads back to the entrance. As Teddy opens the door to escape, Anderdingus helps Josh up, helping him walk. After escaping, they report the incident to the police and shortly after, the abandoned insane asylum was closed off permanently.",
        options: [
            { text: "> The End", next: null }
        ]
    },

    withAnderdingusLose: {
        type: "gameOver",
    },


};

// here is the brain of the whole dialog system
function renderStep(stepId) {
    //see the current step in the story
    const step = story[stepId];

    if (!step || !step.options) return;

    currentStep = stepId;

    if (step.type === "dialogueIntro") {
        showScene(sceneIntro);
    }
    else if (step.type === "choiceIntro") {
        showScene(sceneDecisionTwoIntro);
    }
    else if (step.type === "choiceTwo") {
        showScene(sceneDecisionTwo);
    }
    else if (step.type === "choiceThree") {
        showScene(sceneDecisionThree);
    }
    else if (step.type === "dialogueStory") {
        showScene(sceneStory);
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

    if (step.type === "combat") {
        showScene(sceneCombat);
        combatWinNext = step.winNext;
        combatLoseNext = step.loseNext;
        monsterBigEyes.health = step.monsterHealth || 15; // reset monster health
        fighting = true;
        playersTurn = true;
        progressBars();
        return;
    }

    // chnages value throughout the decisions of the user
    if (step.healthChange) {
        player.health += step.healthChange;
        if (player.health <= 0) {
            player.health = 0;
            showScene(sceneGameOver); // if he dies game over page appears
            return;
        }
        progressBars();
    }

    if (step.hungerChange) {
        player.hunger += step.hungerChange;
        if (player.hunger < 0) {
            player.hunger = 0;
        }
        progressBars();
    }

    // here it drop hunger on every step the user does
    if (step.type === "dialogueStory" || step.type === "choiceTwo" || step.type === "choiceThree") {
        player.hunger -= 0.5; // drops hunger every step
        if (player.hunger <= 0) {
            player.hunger = 0;
            player.health -= 2;  // drops health faster when hunger is 0
        }
        progressBars();
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
