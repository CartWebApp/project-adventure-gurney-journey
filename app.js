// -- BUTTONS -- //
const retryButton = document.querySelector(".retry");
const mainMenuButton = document.querySelector(".mainmenu");
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
const combatContinueBtn = document.querySelector("#scene-combat .decision2");

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
const sceneEscape = document.getElementById("scene-escape");

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

// -- OVERLAY INSIDE BUTTONS -- //
const settingsContinue = document.getElementById("continue-settings");
const settingsRestart = document.getElementById("restart-program-settings");
const settingsExit = document.getElementById("exit-program-settings");


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

function hideOverlayShowScene(sceneToShow) {
    const allOverlays = document.querySelectorAll(".overlay");

    allOverlays.forEach(overlay => {
        overlay.classList.remove("active");
        overlay.classList.add("hidden");
    });

    showScene(sceneToShow);
}


// this saves the game process so there is no glitches
function saveState() {
    localStorage.setItem("gameState", JSON.stringify(state));
}

const items = [
    { name: "Bread", type: "food", hunger: 10, img: "/Images/bread.png" },
    { name: "Protein Bars", type: "food", hunger: 20, img: "/Images/protein-bars.png" },
    { name: "McChicken", type: "food", hunger: 30, img: "/Images/mc-chicken.png" },
    { name: "Fries", type: "food", hunger: 15, img: "/Images/fries.png" },
    { name: "Small Knife", type: "weapon", multi: 1.5, img: "/Images/knife.png" },
    { name: "Machete", type: "weapon", multi: 2, img: "/Images/machete.png" },
    { name: "Bandages", type: "heal", heal: 10, img: "/Images/bandages.png" },
    { name: "Medkit", type: "heal", heal: 50, img: "/Images/medkit.png" },
    { name: "Totem", type: "extraLife", img: "/Images/Totem.png" }
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
    weaponActive: false,
    friend: null
};

const monsterBigEyes = {
    health: 75,
    damage: 10,
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

function randomItem() {
    const index = Math.floor(Math.random() * items.length);
    return items[index];
}

function searchRoom() {
    const found = Math.random() < 0.30;

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
    renderInventory();
}

const baseDamage = player.damage;

function equipWeapon(item) {

    if (player.weapon === item) return;

    player.weapon = item;
    player.damage = baseDamage * item.multi;
}

function giveItem(itemName) {
    const item = items.find(i => i.name === itemName);
    if (!item) return;

    inventory.push(item);

    if (item.type === "weapon") {
        equipWeapon(item);
    }
    renderInventory();
}

function useItem(item) {

    if (item.type === "food") {
        player.hunger = Math.min(100, player.hunger + item.hunger);
        inventory.splice(inventory.indexOf(item), 1);
    }

    else if (item.type === "heal") {
        player.health = Math.min(100, player.health + item.heal);
        inventory.splice(inventory.indexOf(item), 1);
    }
    else if (item.type === "extraLife") {
        player.hasExtraLife = true;
    }

    else if (item.type === "weapon") {
        equipWeapon(item);
    }

    progressBars();
    renderInventory();
}

function renderInventory() {
    const allSlot1 = document.querySelectorAll(".slot1");
    const allSlot2 = document.querySelectorAll(".slot2");
    const allSlot3 = document.querySelectorAll(".slot3");
    const allSlot4 = document.querySelectorAll(".slot4");

    [...allSlot1, ...allSlot2, ...allSlot3, ...allSlot4].forEach(slot => slot.innerHTML = "");

    inventory.forEach((item, index) => {
        const allMatchingSlots = [allSlot1, allSlot2, allSlot3, allSlot4][index];
        if (!allMatchingSlots) return;

        allMatchingSlots.forEach(slot => {
            slot.innerHTML = `<img src="${item.img}" alt="${item.name}" style="cursor:pointer;">`;
            slot.querySelector("img").onclick = () => {
                useItem(item);
            };
        });
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
let selectedAction = null;

// doing dialgue in combat here because it is easier to track every combat page instead of doing it for every single combat step in the story dialogue
function updateCombatLog(message) {
    // selecting the p elemnt in the combat dialogue
    const combatDialogue = document.querySelector(".description-text-section-combat .description-text");
    if (combatDialogue) {
        typeWriter(combatDialogue, message);
    }
}

function selectCombatButton(selectedBtn) {
    const allCombatBtns = [attackButton, defendButton, runButton];

    allCombatBtns.forEach(btn => {
        if (btn) btn.style.opacity = "1";
    });

    if (selectedBtn) selectedBtn.style.opacity = "0.75";
}

function setCombatButtonsVisible(visible) {

    if (attackButton) {
        attackButton.style.display = visible ? "flex" : "none"; // if visible true it will display flex if not it will hide it
    }
    if (defendButton) {
        defendButton.style.display = visible ? "flex" : "none";
    }
    if (runButton) {
        runButton.style.display = visible ? "flex" : "none";
    }

    if (combatContinueBtn) {
        combatContinueBtn.style.display = visible ? "flex" : "none";
    }
}

if (attackButton) {
    attackButton.onclick = () => {
        if (!playersTurn || !fighting) return;
        console.log("Attack clicked");

        selectedAction = "attack";
        selectCombatButton(attackButton);
    };
}

if (defendButton) {
    defendButton.onclick = () => {
        if (!playersTurn || !fighting) return;

        selectedAction = "defend";
        selectCombatButton(defendButton);
    };
}

if (runButton) {
    runButton.onclick = () => {
        if (!playersTurn || !fighting) return;

        selectedAction = "run";
        selectCombatButton(runButton);
    };
}

function combatRender() {
    if (!selectedAction || !playersTurn || !fighting) return;

    if (selectedAction === "attack") {

        const dmgDealt = player.damage;

        monsterBigEyes.health -= dmgDealt;
        player.hunger -= 2.5;

        bigEyesHealth.forEach(bar => {
            bar.style.animation = "none";
            bar.offsetHeight;
            bar.style.animation = "shake 0.2s ease";
        });

        progressBars();

        if (monsterBigEyes.health <= 0) {

            fighting = false;
            progressBars();
            updateCombatLog(`You attack the monster for ${dmgDealt} damage. After a brutal battle, you defeat the monster! You win!`);
            setTimeout(() => {
                if (combatWinNext) {
                    renderStep(combatWinNext);
                }
            }, 1500);
            return;
        }

        updateCombatLog(`You attack the monster for ${dmgDealt} damage. The monster is still alive! Keep fighting!`);

    }
    else if (selectedAction === "defend") {

        playerDefending = true;
        updateCombatLog("You defended yourself, it looks like the monster berely damaged you! Nice block!");
        selectedAction = null;
        selectCombatButton(null);
        endPlayerTurn();

    }
    else if (selectedAction === "run") {
        const escape = Math.random() < 0.5;

        if (escape) {
            fighting = false;
            updateCombatLog("You retreat from the monster, luckily the monster didn't chase you. You escaped successfully!");
            setTimeout(() => {
                if (combatWinNext) {
                    renderStep(combatWinNext);
                }
            }, 1500);
            return;
        }

        updateCombatLog("You try to run but the monster is faster than you! You're forced to keep fighting.");
    }

    selectedAction = null;
    selectCombatButton(null);
    endPlayerTurn();
};

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
        setTimeout(() => {
            updateCombatLog(`The monster deals you ${damage} damage. Luckly you defended yourself, now you only take ${damage} damage!`);
        }, 4000);
    }
    else {
        setTimeout(() => {
            updateCombatLog(`The monster deals you ${damage} damage. Next time try to defend yourself becuase that really hurt!`);
        }, 4000);
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
        updateCombatLog("Your health is gone. The monster has defeated you! You lose!");
        setTimeout(() => {
            if (combatLoseNext) {
                renderStep(combatLoseNext);
            } else {
                showScene(sceneGameOver);
            }
        }, 8000);
        return
    }
    playersTurn = true;

    setTimeout(() => {
        updateCombatLog("The monster finished its attack. Now pick between attacking, defending or running away!");
        selectedAction = null;
        selectCombatButton(null);

        if (combatContinueBtn) {
            combatContinueBtn.onclick = combatRender;
        }

    }, 8000);
}

let currentTimer = null;

function typeWriter(element, text, speed = 30) { // type writer animation for dialogue
    element.textContent = "";
    let i = 0;
    let done = false;

    if (currentTimer) {
        clearInterval(currentTimer);
    }

    currentTimer = setInterval(() => {
        element.textContent += text[i];
        i++;

        if (i >= text.length) {
            clearInterval(currentTimer);
            done = true;
        }
    }, speed);

    element.onclick = () => {
        if (!done) {
            clearInterval(currentTimer);
            element.textContent = text;
            done = true;
        }
    };
}

// Just the base for the audio, I will add a sound later
// let song = new Audio("sounds/heresound");

// To play/pause the music
// song.play();
// song.pause();

// Here is where we are gonna connect pages

function game() {

    // Settings Overlay
    document.querySelectorAll('.Settings').forEach(btn => {
        btn.onclick = () => {
            showOverlay(settingsOverlay);
        }
    });

    if (settingsOverlay) {
        settingsOverlayBackground.onclick = () => {
            hideOverlay(settingsOverlay)
        }
    }

    if (settingsContinue) {
        settingsContinue.onclick = () => {
            hideOverlay(settingsOverlay);
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

    if (settingsExit) {
        settingsExit.onclick = () => {
            hideOverlayShowScene(sceneHome);
        }
    }

    if (settingsRestart) {
        settingsRestart.onclick = () => {
            hideOverlayShowScene(sceneMenu2);
        }
    }


    mainMenuButton.onclick = () => {
        showScene(sceneHome);
    };
    retryButton.onclick = () => {
        showScene(sceneMenu2);
    };
    extraLifeNo.onclick = () => {
        showScene(sceneHome);
    };
    extraLifeYes.onclick = () => {
        // placeholder for now
    };
}

progressBars()
game()


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
        bgImage: "Images/Introduction-image.png",
        text: "On a seemingly normal night, a 17 year old Teddy Barragan wakes up after a long nap.",
        options: [
            { text: "> Continue", next: "intro1" }
        ]
    },

    intro1: {
        type: "dialogueIntro",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/Introduction-image.png",
        text: "I'm so hungry. Maybe I should get some McDonalds.",
        options: [
            { text: "Go Back >", next: "intro0" },
            { text: "> Continue", next: "intro2" }
        ]
    },

    intro2: {
        type: "dialogueIntro",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/Introduction-image.png",
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
        bgImage: "Images/Introduction-image.png",
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
        bgImage: "Images/Introduction-image.png",
        text: "Tv opened in the background, “35 year old Josh Ayala reported missing after taking a casual walk near Athens Lunatic Asylum at night.”",
        options: [
            { text: "> Continue", next: "tvReact" }
        ]
    },

    tvReact: {
        type: "dialogueIntro",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/Introduction-image.png",
        text: "Isn't that the abandoned insane asylum? But brushes it off.",
        options: [
            { text: "Go Back >", next: "tvNews" },
            { text: "> Continue", next: "afterNews" }
        ]
    },

    afterNews: {
        type: "dialogueIntro",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/Introduction-image.png",
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
        bgImage: "Images/Introduction-image.png",
        text: "Teddy calls Anderdingus, the phone rings 3 times until Anderdingus picks up...",
        options: [
            { text: "> Continue", next: "withAnderdingus1" }
        ]
    },

    withAnderdingus1: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus-full.png",
        bgImage: "Images/Introduction-image.png",
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
        bgImage: "Images/Introduction-image.png",
        text: "Nothing much, I'm gonna get some food you wanna come?",
        options: [
            { text: "< Go Back", next: "withAnderdingus1" },
            { text: "> Continue", next: "withAnderdingus3" }
        ]
    },

    withAnderdingus3: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus-full.png",
        bgImage: "Images/Introduction-image.png",
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
        bgImage: "Images/Introduction-image.png",
        text: "Probably McDonalds.",
        options: [
            { text: "< Go Back", next: "withAnderdingus3" },
            { text: "> Continue", next: "withAnderdingus5" }
        ]
    },

    withAnderdingus5: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus-full.png",
        bgImage: "Images/Introduction-image.png",
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
        bgImage: "Images/Introduction-image.png",
        text: "Yeah it's fine though, we're gonna be fine.",
        options: [
            { text: "< Go Back", next: "withAnderdingus5" },
            { text: "> Continue", next: "withAnderdingus7" }
        ]
    },

    withAnderdingus7: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus-full.png",
        bgImage: "Images/Introduction-image.png",
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
        bgImage: "Images/Introduction-image.png",
        text: "I'm paying.",
        options: [
            { text: "< Go Back", next: "withAnderdingus7" },
            { text: "> Continue", next: "withAnderdingus9" }
        ]
    },

    withAnderdingus9: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus-full.png",
        bgImage: "Images/Introduction-image.png",
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
        bgImage: "Images/Introduction-image.png",
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
        bgImage: "Images/McDonalds.png",
        text: "Can I get a large big mac meal with a coke, oreo mcflurry, 3 McChickens and a large fanta, and large fries.",
        options: [
            { text: "< Go Back", next: "withAnderdingusMcD0" },
            { text: "> Continue", next: "withAnderdingusMcD2" }
        ]
    },

    withAnderdingusMcD2: {
        type: "dialogueStory",
        speaker: "Cashier",
        image: "Images/CashierDonalds.png",
        bgImage: "Images/McDonalds.png",
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
        bgImage: "Images/McDonalds.png",
        text: "Yeah.",
        options: [
            { text: "< Go Back", next: "withAnderdingusMcD2" },
            { text: "> Continue", next: "withAnderdingusMcD4" }
        ]
    },

    withAnderdingusMcD4: {
        type: "dialogueStory",
        speaker: "Cashier",
        image: "Images/CashierDonalds.png",
        bgImage: "Images/McDonalds.png",
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
        bgImage: "Images/McDonalds.png",
        text: "Sure.",
        options: [
            { text: "< Go Back", next: "withAnderdingusMcD4" },
            { text: "> Continue", next: "withAnderdingusMcD6" }
        ]
    },

    withAnderdingusMcD6: {
        type: "dialogueStory",
        speaker: "Cashier",
        image: "Images/CashierDonalds.png",
        bgImage: "Images/McDonalds.png",
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
        bgImage: "Images/McDonalds.png",
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
        bgImage: "Images/McDonalds.png",
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
        bgImage: "Images/McDonalds.png",
        text: "Teddy and Anderdingus finish all the McDonalds.",
        options: [
            { text: "> Continue", next: "withAnderdingusAsylum0" }
        ]
    },

    withAnderdingusSaveFood: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/McDonalds.png",
        hungerChange: 15,
        item: "McChicken",
        text: "Anderdingus saves some McChickens for later...",
        options: [
            { text: "> Continue", next: "withAnderdingusAsylum0" }
        ]
    },

    withAnderdingusAsylum0: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/DonaldSideWalk.png",
        text: "Yo we should check out the insane asylum.",
        options: [
            { text: "> Continue", next: "withAnderdingusAsylum1" }
        ]
    },

    withAnderdingusAsylum1: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus-full.png",
        bgImage: "Images/DonaldSideWalk.png",
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
        bgImage: "Images/DonaldSideWalk.png",
        text: "Just to check it out dude we aren't gonna go inside just walk around.",
        options: [
            { text: "< Go Back", next: "withAnderdingusAsylum1" },
            { text: "> Continue", next: "withAnderdingusAsylum3" }
        ]
    },

    withAnderdingusAsylum3: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus-full.png",
        bgImage: "Images/DonaldSideWalk.png",
        text: "I guess bro.",
        options: [
            { text: "< Go Back", next: "withAnderdingusAsylum2" },
            { text: "> Continue", next: "withAnderdingusAsylum4" }
        ]
    },

    withAnderdingusAsylum4: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus-full.png",
        bgImage: "Images/DonaldSideWalk.png",
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
        bgImage: "Images/DonaldSideWalk.png",
        text: "Probably, we are almost at the insane asylum.",
        options: [
            { text: "< Go Back", next: "withAnderdingusAsylum4" },
            { text: "> Continue", next: "withAnderdingusAsylum6" }
        ]
    },

    withAnderdingusAsylum6: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus-full.png",
        bgImage: "Images/GlowyDoor.png",
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
        bgImage: "Images/GlowyDoor.png",
        text: "I see it, dude we should go inside.",
        options: [
            { text: "< Go Back", next: "withAnderdingusAsylum6" },
            { text: "> Continue", next: "withAnderdingusAsylum8" }
        ]
    },

    withAnderdingusAsylum8: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus-full.png",
        bgImage: "Images/GlowyDoor.png",
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
        bgImage: "Images/GlowyDoor.png",
        text: "We will leave right away if there's something bad dude, I paid for the McDonalds.",
        options: [
            { text: "< Go Back", next: "withAnderdingusAsylum8" },
            { text: "> Continue", next: "withAnderdingusAsylum10" }
        ]
    },

    withAnderdingusAsylum10: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus-full.png",
        bgImage: "Images/GlowyDoor.png",
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
        bgImage: "Images/GlowyDoor.png",
        text: "They enter the insane asylum and as soon as they enter, the door shuts instantly.",
        options: [
            { text: "< Go Back", next: "withAnderdingusAsylum10" },
            { text: "> Continue", next: "withAnderdingusEnter1" }
        ]
    },

    withAnderdingusEnter1: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus-full.png",
        bgImage: "Images/DoorShut.png",
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
        bgImage: "Images/DoorShut.png",
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
        bgImage: "Images/DoorShut.png",
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
        bgImage: "Images/DoorShut.png",
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
        bgImage: "Images/DoorShut.png",
        text: "Try ramming it open.",
        options: [
            { text: "> Continue", next: "withAnderdingusRamFriend2" }
        ]
    },

    withAnderdingusRamFriend2: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/DoorShut.png",
        text: "Anderdingus listens and attempts to ram the door. The door does not budge and both of you realize the door is not opening no matter how hard they try.",
        options: [
            { text: "> Continue", next: "withAnderdingusJosh0" }
        ]
    },

    withAnderdingusJosh0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/DoorShut.png",
        text: "After attempting to open the door, they turn around and realize they are trapped and how dark and eerie this place is, but they also notice someone sitting down against the wall.",
        options: [
            { text: "> Continue", next: "withAnderdingusJosh1" }
        ]
    },

    withAnderdingusJosh1: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus-full.png",
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
        image: "Images/anderdingus-full.png",
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
        image: "Images/anderdingus-full.png",
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
        image: "Images/anderdingus-full.png",
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
        image: "Images/anderdingus-full.png",
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
        image: "Images/anderdingus-full.png",
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
        type: "gameOver"
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
        hungerChange: 10,
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
        image: "Images/anderdingus-full.png",
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
        item: "Totem",
        options: [
            { text: "> Continue", next: "withAnderdingusTotemFind2" }
        ]
    },

    withAnderdingusTotemFind2: {
        type: "dialogueStory",
        speaker: "Anderdingus",
        image: "Images/anderdingus-full.png",
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
        image: "Images/anderdingus-full.png",
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
        image: "Images/anderdingus-full.png",
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
        image: "Images/anderdingus-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "Look what I found!",
        item: "Machete",
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
        image: "Images/anderdingus-full.png",
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
        image: "Images/anderdingus-full.png",
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
        image: "Images/anderdingus-full.png",
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
        image: "Images/anderdingus-full.png",
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


    // -- ENDING 2: JUSTIN -- // -- ENDING 2: JUSTIN -- // -- ENDING 2: JUSTIN -- // -- ENDING 2: JUSTIN -- // -- ENDING 2: JUSTIN -- // 

    withJustin0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/Introduction-image.png",
        text: "Teddy calls Justin Buttlord and he picks up instantly.",
        options: [
            { text: "> Continue", next: "withJustin1" }
        ]
    },

    withJustin1: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/Introduction-image.png",
        text: "Hello?",
        options: [
            { text: "< Go Back", next: "withJustin0" },
            { text: "> Continue", next: "withJustin2" }
        ]
    },

    withJustin2: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/Introduction-image.png",
        text: "Yo what are you doing right now?",
        options: [
            { text: "< Go Back", next: "withJustin1" },
            { text: "> Continue", next: "withJustin3" }
        ]
    },

    withJustin3: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/Introduction-image.png",
        text: "Nothing dude I have nothing to do I'm so bored.",
        options: [
            { text: "< Go Back", next: "withJustin2" },
            { text: "> Continue", next: "withJustin4" }
        ]
    },

    withJustin4: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/Introduction-image.png",
        text: "Ima walk over to McDonalds you wanna come?",
        options: [
            { text: "< Go Back", next: "withJustin3" },
            { text: "> Continue", next: "withJustin5" }
        ]
    },

    withJustin5: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/Introduction-image.png",
        text: "Hell yeah man I'm going over to your house right now.",
        options: [
            { text: "< Go Back", next: "withJustin4" },
            { text: "> Continue", next: "withJustin6" }
        ]
    },

    withJustin6: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/Introduction-image.png",
        text: "Alright.",
        options: [
            { text: "< Go Back", next: "withJustin5" },
            { text: "> Continue", next: "withJustinMcD0" }
        ]
    },

    withJustinMcD0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/Introduction-image.png",
        text: "At McDonalds...",
        options: [
            { text: "< Go Back", next: "withJustin6" },
            { text: "> Continue", next: "withJustinMcD1" }
        ]
    },

    withJustinMcD1: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/McDonalds.png",
        text: "Can I get 2 large big mac meals with a coke, oreo mcflurry, and the derpy mcflurry.",
        options: [
            { text: "< Go Back", next: "withJustinMcD0" },
            { text: "> Continue", next: "withJustinMcD2" }
        ]
    },

    withJustinMcD2: {
        type: "dialogueStory",
        speaker: "Cashier",
        image: "Images/CashierDonalds.png",
        bgImage: "Images/McDonalds.png",
        text: "Will that be all?",
        options: [
            { text: "< Go Back", next: "withJustinMcD1" },
            { text: "> Continue", next: "withJustinMcD3" }
        ]
    },

    withJustinMcD3: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/McDonalds.png",
        text: "Yeah.",
        options: [
            { text: "< Go Back", next: "withJustinMcD2" },
            { text: "> Continue", next: "withJustinMcD4" }
        ]
    },

    withJustinMcD4: {
        type: "dialogueStory",
        speaker: "Cashier",
        image: "Images/CashierDonalds.png",
        bgImage: "Images/McDonalds.png",
        text: "That will be $29.83, would you like to round up for charity?",
        options: [
            { text: "< Go Back", next: "withJustinMcD3" },
            { text: "> Continue", next: "withJustinMcD5" }
        ]
    },

    withJustinMcD5: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/McDonalds.png",
        text: "Sure.",
        options: [
            { text: "< Go Back", next: "withJustinMcD4" },
            { text: "> Continue", next: "withJustinMcD6" }
        ]
    },

    withJustinMcD6: {
        type: "dialogueStory",
        speaker: "Cashier",
        image: "Images/CashierDonalds.png",
        bgImage: "Images/McDonalds.png",
        text: "Okay that will be $30 flat.",
        options: [
            { text: "< Go Back", next: "withJustinMcD5" },
            { text: "> Continue", next: "withJustinMcD7" }
        ]
    },

    withJustinMcD7: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/McDonalds.png",
        text: "Teddy pays for the food and they wait for their food... They get their food.",
        options: [
            { text: "< Go Back", next: "withJustinMcD6" },
            { text: "> Continue", next: "withJustinFoodChoice" }
        ]
    },

    withJustinFoodChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/McDonalds.png",
        text: "What do you do with the food?",
        options: [
            { text: "Finish all the food", next: "withJustinFinishFood" },
            { text: "Save some for later", next: "withJustinSaveFood" }
        ]
    },

    withJustinFinishFood: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/McDonalds.png",
        text: "Teddy and Justin finish all the McDonalds.",
        options: [
            { text: "> Continue", next: "withJustinAsylum0" }
        ]
    },

    withJustinSaveFood: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/McDonalds.png",
        hungerChange: 15,
        item: "Fries",
        text: "Teddy saves some fries for later...",
        options: [
            { text: "> Continue", next: "withJustinAsylum0" }
        ]
    },

    withJustinAsylum0: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/DonaldsSideWalk.png",
        text: "Yo we should check out that insane asylum.",
        options: [
            { text: "> Continue", next: "withJustinAsylum1" }
        ]
    },

    withJustinAsylum1: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/DonaldsSideWalk.png",
        text: "Hell yeah man lets go, lets run there.",
        options: [
            { text: "< Go Back", next: "withJustinAsylum0" },
            { text: "> Continue", next: "withJustinAsylum2" }
        ]
    },

    withJustinAsylum2: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/DonaldsSideWalk.png",
        text: "Lets race there.",
        options: [
            { text: "< Go Back", next: "withJustinAsylum1" },
            { text: "> Continue", next: "withJustinAsylum3" }
        ]
    },

    withJustinAsylum3: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/DonaldsSideWalk.png",
        text: "They race towards the insane asylum...",
        options: [
            { text: "> Continue", next: "withJustinAsylum4" }
        ]
    },

    withJustinAsylum4: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/GlowyDoor.png",
        text: "We're here, I was first.",
        options: [
            { text: "< Go Back", next: "withJustinAsylum3" },
            { text: "> Continue", next: "withJustinAsylum5" }
        ]
    },

    withJustinAsylum5: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/GlowyDoor.png",
        text: "I was literally ahead of you dude.",
        options: [
            { text: "< Go Back", next: "withJustinAsylum4" },
            { text: "> Continue", next: "withJustinAsylum6" }
        ]
    },

    withJustinAsylum6: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/GlowyDoor.png",
        text: "Wait you see that? There's light coming from that door.",
        options: [
            { text: "< Go Back", next: "withJustinAsylum5" },
            { text: "> Continue", next: "withJustinAsylum7" }
        ]
    },

    withJustinAsylum7: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/GlowyDoor.png",
        text: "Let's check it out, we have nothing better to do.",
        options: [
            { text: "< Go Back", next: "withJustinAsylum6" },
            { text: "> Continue", next: "withJustinEnter0" }
        ]
    },

    withJustinEnter0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/GlowyDoor.png",
        text: "They enter the insane asylum and as soon as they enter, the door shuts instantly.",
        options: [
            { text: "< Go Back", next: "withJustinAsylum7" },
            { text: "> Continue", next: "withJustinEnter1" }
        ]
    },

    withJustinEnter1: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/DoorShut.png",
        text: "Damn.",
        options: [
            { text: "< Go Back", next: "withJustinEnter0" },
            { text: "> Continue", next: "withJustinEnter2" }
        ]
    },

    withJustinEnter2: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/DoorShut.png",
        text: "Its not opening dude.",
        options: [
            { text: "< Go Back", next: "withJustinEnter1" },
            { text: "> Continue", next: "withJustinDoorChoice" }
        ]
    },

    withJustinDoorChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/DoorShut.png",
        text: "What do you do?",
        options: [
            { text: "Ram the door yourself", next: "withJustinRamSelf" },
            { text: "Tell Justin to ram it", next: "withJustinRamFriend" }
        ]
    },

    withJustinRamSelf: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/DoorShut.png",
        healthChange: -10,
        text: "Teddy attempts to ram the door, but the door does not budge. During the process, Teddy injures himself by ramming the door too hard.",
        options: [
            { text: "> Continue", next: "withJustinJosh0" }
        ]
    },

    withJustinRamFriend: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/DoorShut.png",
        text: "Justin listens and attempts to ram the door. The door does not budge and both of you realize the door is not opening no matter how hard they try.",
        options: [
            { text: "> Continue", next: "withJustinJosh0" }
        ]
    },

    withJustinJosh0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/DoorShut.png",
        text: "After attempting to open the door, they turn around and realize they are trapped and how dark and eerie this place is, but they also notice someone sitting down against the wall.",
        options: [
            { text: "> Continue", next: "withJustinJosh1" }
        ]
    },

    withJustinJosh1: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "Bro you see that?",
        options: [
            { text: "< Go Back", next: "withJustinJosh0" },
            { text: "> Continue", next: "withJustinJosh2" }
        ]
    },

    withJustinJosh2: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Is he dead?",
        options: [
            { text: "< Go Back", next: "withJustinJosh1" },
            { text: "> Continue", next: "withJustinJosh3" }
        ]
    },

    withJustinJosh3: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "Dude, that's the guy from the news!",
        options: [
            { text: "< Go Back", next: "withJustinJosh2" },
            { text: "> Continue", next: "withJustinJosh4" }
        ]
    },

    withJustinJosh4: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "What happened to his leg?",
        options: [
            { text: "< Go Back", next: "withJustinJosh3" },
            { text: "> Continue", next: "withJustinJosh5" }
        ]
    },

    withJustinJosh5: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "GET AWAY FROM ME!",
        options: [
            { text: "< Go Back", next: "withJustinJosh4" },
            { text: "> Continue", next: "withJustinJosh6" }
        ]
    },

    withJustinJosh6: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Woah woah woah.",
        options: [
            { text: "< Go Back", next: "withJustinJosh5" },
            { text: "> Continue", next: "withJustinJosh7" }
        ]
    },

    withJustinJosh7: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "Are you okay?",
        options: [
            { text: "< Go Back", next: "withJustinJosh6" },
            { text: "> Continue", next: "withJustinJosh8" }
        ]
    },

    withJustinJosh8: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "Oh... I thought you guys were... something else...",
        options: [
            { text: "< Go Back", next: "withJustinJosh7" },
            { text: "> Continue", next: "withJustinJosh9" }
        ]
    },

    withJustinJosh9: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "What happened to your leg?",
        options: [
            { text: "< Go Back", next: "withJustinJosh8" },
            { text: "> Continue", next: "withJustinJosh10" }
        ]
    },

    withJustinJosh10: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "It got me.",
        options: [
            { text: "< Go Back", next: "withJustinJosh9" },
            { text: "> Continue", next: "withJustinJosh11" }
        ]
    },

    withJustinJosh11: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "What got you?",
        options: [
            { text: "< Go Back", next: "withJustinJosh10" },
            { text: "> Continue", next: "withJustinJosh12" }
        ]
    },

    withJustinJosh12: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "I don't know, but it's not human.",
        options: [
            { text: "< Go Back", next: "withJustinJosh11" },
            { text: "> Continue", next: "withJustinJosh13" }
        ]
    },

    withJustinJosh13: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "Is this a prank?",
        options: [
            { text: "< Go Back", next: "withJustinJosh12" },
            { text: "> Continue", next: "withJustinJosh14" }
        ]
    },

    withJustinJosh14: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Alright dude enough games, how do we get out?",
        options: [
            { text: "< Go Back", next: "withJustinJosh13" },
            { text: "> Continue", next: "withJustinJosh15" }
        ]
    },

    withJustinJosh15: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "There's a key.",
        options: [
            { text: "< Go Back", next: "withJustinJosh14" },
            { text: "> Continue", next: "withJustinJosh16" }
        ]
    },

    withJustinJosh16: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Where is the key?",
        options: [
            { text: "< Go Back", next: "withJustinJosh15" },
            { text: "> Continue", next: "withJustinJosh17" }
        ]
    },

    withJustinJosh17: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "One of the 'monsters' have it.",
        options: [
            { text: "< Go Back", next: "withJustinJosh16" },
            { text: "> Continue", next: "withJustinJosh18" }
        ]
    },

    withJustinJosh18: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Very funny man, stop joking around.",
        options: [
            { text: "< Go Back", next: "withJustinJosh17" },
            { text: "> Continue", next: "withJustinScream" }
        ]
    },

    withJustinScream: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Suddenly a loud scary, bone chilling scream was heard...",
        options: [
            { text: "< Go Back", next: "withJustinJosh18" },
            { text: "> Continue", next: "withJustinJosh19" }
        ]
    },

    withJustinJosh19: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "I'm not lying, there are 2 monsters, you have to get the key from one of them to escape.",
        options: [
            { text: "< Go Back", next: "withJustinScream" },
            { text: "> Continue", next: "withJustinJosh20" }
        ]
    },

    withJustinJosh20: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "Okay but what do we do about those things?",
        options: [
            { text: "< Go Back", next: "withJustinJosh19" },
            { text: "> Continue", next: "withJustinJosh21" }
        ]
    },

    withJustinJosh21: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "Well the first monster should not be a problem, it only appears if you are alone and only attacks if you look at it, but the second monster, you just have to kill it.",
        options: [
            { text: "< Go Back", next: "withJustinJosh20" },
            { text: "> Continue", next: "withJustinJosh22" }
        ]
    },

    withJustinJosh22: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "So there's no other way.",
        options: [
            { text: "< Go Back", next: "withJustinJosh21" },
            { text: "> Continue", next: "withJustinJosh23" }
        ]
    },

    withJustinJosh23: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "If you want to get out of here, yes.",
        options: [
            { text: "< Go Back", next: "withJustinJosh22" },
            { text: "> Continue", next: "withJustinJosh24" }
        ]
    },

    withJustinJosh24: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "Lets go dude we are wasting our time here, lets go find the key.",
        options: [
            { text: "< Go Back", next: "withJustinJosh23" },
            { text: "> Continue", next: "withJustinJosh25" }
        ]
    },

    withJustinJosh25: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Alright.",
        options: [
            { text: "< Go Back", next: "withJustinJosh24" },
            { text: "> Continue", next: "withJustinJosh26" }
        ]
    },

    withJustinJosh26: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "Good luck, you'll need it.",
        options: [
            { text: "< Go Back", next: "withJustinJosh25" },
            { text: "> Continue", next: "withJustinExplore0" }
        ]
    },

    withJustinExplore0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "The two begin exploring, they find and scavenge rooms for supplies like food or even weapons and other items that would help in escaping. Then suddenly, they hear someone screaming for help, and they quickly head towards the scream where they find a blood trail...",
        options: [
            { text: "> Continue", next: "withJustinExplore1" }
        ]
    },

    withJustinExplore1: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy and Justin follow the trail leading to a suspicious room. They enter and search the room. In the room they discover the monster eating a human leg...",
        options: [
            { text: "> Continue", next: "withJustinExplore2" }
        ]
    },

    withJustinExplore2: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Is that Josh's leg?",
        options: [
            { text: "< Go Back", next: "withJustinExplore1" },
            { text: "> Continue", next: "withJustinExplore3" }
        ]
    },

    withJustinExplore3: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "Probably, but you see that key on his forehead? We have to kill this thing.",
        options: [
            { text: "< Go Back", next: "withJustinExplore2" },
            { text: "> Continue", next: "withJustinMonsterChoice" }
        ]
    },

    withJustinMonsterChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "What do you do?",
        options: [
            { text: "Fight the monster", next: "withJustinFight1" },
            { text: "Run away", next: "withJustinRun1" }
        ]
    },

    withJustinFight1: {
        type: "combat",
        winNext: "withJustinAfterMonster0",
        loseNext: "withJustinLose",
        monsterHealth: 75,
    },

    withJustinRun1: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy and Justin both run away and surprisingly the monster does not chase... Maybe its toying with them.",
        options: [
            { text: "> Continue", next: "withJustinAfterMonster0" }
        ]
    },

    withJustinAfterMonster0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "After running for a while, they find themselves deep in the asylum.",
        options: [
            { text: "> Continue", next: "withJustinAfterMonster1" }
        ]
    },

    withJustinAfterMonster1: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Should we search these rooms?",
        options: [
            { text: "< Go Back", next: "withJustinAfterMonster0" },
            { text: "> Continue", next: "withJustinAfterMonster2" }
        ]
    },

    withJustinAfterMonster2: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "Uhhhhh I don't think they have anything in them.",
        options: [
            { text: "< Go Back", next: "withJustinAfterMonster1" },
            { text: "> Continue", next: "withJustinAfterMonster3" }
        ]
    },

    withJustinAfterMonster3: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Yeah but they might have something we could use.",
        options: [
            { text: "< Go Back", next: "withJustinAfterMonster2" },
            { text: "> Continue", next: "withJustinRoomChoice1" }
        ]
    },

    withJustinRoomChoice1: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "What do you do?",
        options: [
            { text: "Search the rooms", next: "withJustinRoomSearch1" },
            { text: "Continue moving forward", next: "withJustinBreak0" }
        ]
    },

    withJustinRoomSearch1: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        hungerChange: 10,
        text: "Teddy searches the room while Justin is on lookout. After a minute of searching Teddy finds 5 old protein bars. They then continue exploring.",
        item: "Protein Bars",
        options: [
            { text: "> Continue", next: "withJustinBreak0" }
        ]
    },

    withJustinBreak0: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Should we take a break? We have been exploring for quite a bit.",
        options: [
            { text: "> Continue", next: "withJustinBreak1" }
        ]
    },

    withJustinBreak1: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "Its up to you man, im down for whatever.",
        options: [
            { text: "< Go Back", next: "withJustinBreak0" },
            { text: "> Continue", next: "withJustinBreakChoice" }
        ]
    },

    withJustinBreakChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "What do you do?",
        options: [
            { text: "Take a break", next: "withJustinRest" },
            { text: "Continue exploring", next: "withJustinTotem0" }
        ]
    },

    withJustinRest: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        hungerChange: 10,
        healthChange: 15,
        text: "Teddy and Justin eat the protein bars to recover their hunger and heal a little from their fight with the monster. They then continue exploring.",
        options: [
            { text: "> Continue", next: "withJustinTotem0" }
        ]
    },

    withJustinTotem0: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "If we ever see that monster again we should definitely chase it.",
        options: [
            { text: "> Continue", next: "withJustinTotem1" }
        ]
    },

    withJustinTotem1: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Yeah it should be pretty weak now.",
        options: [
            { text: "< Go Back", next: "withJustinTotem0" },
            { text: "> Continue", next: "withJustinTotemChoice" }
        ]
    },

    withJustinTotemChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy and Justin talk a little but they encounter some more rooms they can potentially search... What do you do?",
        options: [
            { text: "Search the rooms", next: "withJustinTotemFind" },
            { text: "Continue exploring", next: "withJustinVent0" }
        ]
    },

    withJustinTotemFind: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "They search the rooms and they find a mysterious totem...",
        item: "Totem",
        options: [
            { text: "> Continue", next: "withJustinTotemFind2" }
        ]
    },

    withJustinTotemFind2: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "Real useful stuff, probably does nothing.",
        options: [
            { text: "< Go Back", next: "withJustinTotemFind" },
            { text: "> Continue", next: "withJustinTotemFind3" }
        ]
    },

    withJustinTotemFind3: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Ima keep it anyways, maybe it might be useful.",
        options: [
            { text: "< Go Back", next: "withJustinTotemFind2" },
            { text: "> Continue", next: "withJustinTotemFind4" }
        ]
    },

    withJustinTotemFind4: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "Alright man, you do you.",
        options: [
            { text: "< Go Back", next: "withJustinTotemFind3" },
            { text: "> Continue", next: "withJustinVent0" }
        ]
    },

    withJustinVent0: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "Let's go deeper, maybe we can find even more stuff.",
        options: [
            { text: "> Continue", next: "withJustinVent1" }
        ]
    },

    withJustinVent1: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "As they keep going deeper, it gets colder, until...",
        options: [
            { text: "> Continue", next: "withJustinVent2" }
        ]
    },

    withJustinVent2: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "OMG, you hear that?",
        options: [
            { text: "< Go Back", next: "withJustinVent1" },
            { text: "> Continue", next: "withJustinVent3" }
        ]
    },

    withJustinVent3: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "Yes I do, that's so scary.",
        options: [
            { text: "< Go Back", next: "withJustinVent2" },
            { text: "> Continue", next: "withJustinVent4" }
        ]
    },

    withJustinVent4: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "The vent just broke!",
        options: [
            { text: "< Go Back", next: "withJustinVent3" },
            { text: "> Continue", next: "withJustinVent5" }
        ]
    },

    withJustinVent5: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "No way, do not turn around...",
        options: [
            { text: "< Go Back", next: "withJustinVent4" },
            { text: "> Continue", next: "withJustinVent6" }
        ]
    },

    withJustinVent6: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Why, what is it?",
        options: [
            { text: "< Go Back", next: "withJustinVent5" },
            { text: "> Continue", next: "withJustinVent7" }
        ]
    },

    withJustinVent7: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "Just don't.",
        options: [
            { text: "< Go Back", next: "withJustinVent6" },
            { text: "> Continue", next: "withJustinVentChoice" }
        ]
    },

    withJustinVentChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "What do you do?",
        options: [
            { text: "Turn around", next: "withJustinTurnAround" },
            { text: "Keep moving like nothing happened", next: "withJustinKeepMoving" }
        ]
    },

    withJustinTurnAround: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "They see a monster and they are shocked, the only option is to run or confront it.",
        options: [
            { text: "> Continue", next: "withJustinTurnAround2" }
        ]
    },

    withJustinTurnAround2: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "I guess we have to fight him.",
        options: [
            { text: "< Go Back", next: "withJustinTurnAround" },
            { text: "> Continue", next: "withJustinTurnAround3" }
        ]
    },

    withJustinTurnAround3: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "Let's do it.",
        options: [
            { text: "< Go Back", next: "withJustinTurnAround2" },
            { text: "> Continue", next: "withJustinFinalCombat" }
        ]
    },

    withJustinKeepMoving: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        healthChange: -15,
        text: "When they are walking slowly, the monster behind them deals damage to them and escapes.",
        options: [
            { text: "> Continue", next: "withJustinKeepMoving2" }
        ]
    },

    withJustinKeepMoving2: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "AUCHHH, what was that!",
        options: [
            { text: "< Go Back", next: "withJustinKeepMoving" },
            { text: "> Continue", next: "withJustinKeepMoving3" }
        ]
    },

    withJustinKeepMoving3: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "It was the monster! Should we chase it?",
        options: [
            { text: "< Go Back", next: "withJustinKeepMoving2" },
            { text: "> Continue", next: "withJustinChaseChoice" }
        ]
    },

    withJustinChaseChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "What do you do?",
        options: [
            { text: "Chase the monster", next: "withJustinChase" },
            { text: "Don't chase, recover", next: "withJustinRecover" }
        ]
    },

    withJustinChase: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Let's get that monster!",
        options: [
            { text: "> Continue", next: "withJustinChase2" }
        ]
    },

    withJustinChase2: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "YEAH!",
        options: [
            { text: "< Go Back", next: "withJustinChase" },
            { text: "> Continue", next: "withJustinFinalCombat" }
        ]
    },

    withJustinRecover: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Let's recover for a bit, we are kinda tired.",
        options: [
            { text: "> Continue", next: "withJustinRecover2" }
        ]
    },

    withJustinRecover2: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "Yeah I agree.",
        options: [
            { text: "< Go Back", next: "withJustinRecover" },
            { text: "> Continue", next: "withJustinRecover3" }
        ]
    },

    withJustinRecover3: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Let's sit down here against the wall.",
        options: [
            { text: "< Go Back", next: "withJustinRecover2" },
            { text: "> Continue", next: "withJustinRecover4" }
        ]
    },

    withJustinRecover4: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "They both sit down against the wall relaxing. They think it is pretty relaxing, normal. Too normal...",
        options: [
            { text: "> Continue", next: "withJustinRecover5" }
        ]
    },

    withJustinRecover5: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Where did the monster go again?",
        options: [
            { text: "< Go Back", next: "withJustinRecover4" },
            { text: "> Continue", next: "withJustinRecover6" }
        ]
    },

    withJustinRecover6: {
        type: "dialogueStory",
        speaker: "Justin",
        image: "Images/Justin-Buttlord-full.png",
        bgImage: "Images/story-mechanics.png",
        text: "It went back into the vent, where it came from.",
        options: [
            { text: "< Go Back", next: "withJustinRecover5" },
            { text: "> Continue", next: "withJustinRecover7" }
        ]
    },

    withJustinRecover7: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "The vent on top of us?",
        options: [
            { text: "< Go Back", next: "withJustinRecover6" },
            { text: "> Continue", next: "withJustinGameOver" }
        ]
    },

    withJustinGameOver: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "They both look up and they see the monster... They react too slowly and the monster kills them both with a single strike.",
        options: [
            { text: "> Main Menu", next: null }
        ]
    },

    withJustinFinalCombat: {
        type: "combat",
        winNext: "withJustinWin",
        loseNext: "withJustinLose",
        monsterHealth: 75,
    },

    withJustinLose: {
        type: "gameOver",
    },

    withJustinWin: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "They chase after the monster and because the monster is wounded it is not as fast as it usually is... Teddy catches up to the monster and pushes it to the ground. Then Justin comes in and kicks it in the head. The monster lets out a very loud scream that makes Teddy and Justin cover their ears, this lets the monster get a sneak attack on Teddy.",
        options: [
            { text: "> Continue", next: "withJustinWin2" }
        ]
    },

    withJustinWin2: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy fell to the floor, he blocked the attack so it did not do much. Justin pushes the monster against the wall and punches it over and over again. Teddy recovers and stands back up but the monster kicks Justin away.",
        options: [
            { text: "> Continue", next: "withJustinWin3" }
        ]
    },

    withJustinWin3: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy then grabs the monster and throws it to the ground and begins stomping its head. Justin quickly recovers and prevents the monster from escaping, letting Teddy stomp its head over and over until the monster's brain is destroyed... The monster is finally dead.",
        options: [
            { text: "> Continue", next: "withJustinWin4" }
        ]
    },

    withJustinWin4: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy and Justin grab the key and escape with Josh.",
        options: [
            { text: "> The End", next: null }
        ]
    },

    // -- ENDING 3: NO FRIEND -- // -- ENDING 3: NO FRIEND -- // -- ENDING 3: NO FRIEND -- // -- ENDING 3: NO FRIEND -- // -- ENDING 3: NO FRIEND -- //

    noFriend0: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/Introduction-image.png",
        text: "Teddy doesn't call anyone and decides to get some food alone. He begins to walk to the McDonalds. As he is walking, he wonders after getting some food if he should check out the insane asylum just for fun. Then he says out loud, I should've called someone to come with me.",
        options: [
            { text: "> Continue", next: "noFriendMcD0" }
        ]
    },

    noFriendMcD0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/Introduction-image.png",
        text: "At McDonalds...",
        options: [
            { text: "> Continue", next: "noFriendMcD1" }
        ]
    },

    noFriendMcD1: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/McDonalds.png",
        text: "Can I get a large big mac meal with coke and a oreo mcflurry please.",
        options: [
            { text: "< Go Back", next: "noFriendMcD0" },
            { text: "> Continue", next: "noFriendMcD2" }
        ]
    },

    noFriendMcD2: {
        type: "dialogueStory",
        speaker: "Cashier",
        image: "Images/CashierDonalds.png",
        bgImage: "Images/McDonalds.png",
        text: "Will that be all.",
        options: [
            { text: "< Go Back", next: "noFriendMcD1" },
            { text: "> Continue", next: "noFriendMcD3" }
        ]
    },

    noFriendMcD3: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/McDonalds.png",
        text: "Yea.",
        options: [
            { text: "< Go Back", next: "noFriendMcD2" },
            { text: "> Continue", next: "noFriendMcD4" }
        ]
    },

    noFriendMcD4: {
        type: "dialogueStory",
        speaker: "Cashier",
        image: "Images/CashierDonalds.png",
        bgImage: "Images/McDonalds.png",
        text: "Total is $15.49 would you like to round up for charity?",
        options: [
            { text: "< Go Back", next: "noFriendMcD3" },
            { text: "> Continue", next: "noFriendMcD5" }
        ]
    },

    noFriendMcD5: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/McDonalds.png",
        text: "Sure.",
        options: [
            { text: "< Go Back", next: "noFriendMcD4" },
            { text: "> Continue", next: "noFriendMcD6" }
        ]
    },

    noFriendMcD6: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/McDonalds.png",
        text: "Teddy pays and waits for his food... Teddy receives his food.",
        options: [
            { text: "< Go Back", next: "noFriendMcD5" },
            { text: "> Continue", next: "noFriendFoodChoice" }
        ]
    },

    noFriendFoodChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/McDonalds.png",
        text: "What do you do with the food?",
        options: [
            { text: "Finish all the food", next: "noFriendFinishFood" },
            { text: "Save some for later", next: "noFriendSaveFood" }
        ]
    },

    noFriendFinishFood: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/McDonalds.png",
        text: "Teddy finishes all the McDonalds.",
        options: [
            { text: "> Continue", next: "noFriendAsylum0" }
        ]
    },

    noFriendSaveFood: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/McDonalds.png",
        hungerChange: 1,
        text: "Teddy saves some fries for later...",
        options: [
            { text: "> Continue", next: "noFriendAsylum0" }
        ]
    },

    noFriendAsylum0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/DonaldSideWalk.png",
        text: "Teddy soon finishes his meal and he begins heading towards the Athens Lunatic Asylum. During the walk he regrets once again not bringing someone with him. Teddy wonders if this night would be more enjoyable if he had someone to eat McDonalds with and to explore abandoned buildings.",
        options: [
            { text: "> Continue", next: "noFriendAsylum1" }
        ]
    },

    noFriendAsylum1: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/GlowyDoor.png",
        text: "After being lost in thought, Teddy soon reaches the insane asylum. He notices light shining out from the entrance and he says curiously, That's weird, I thought this place was abandoned. Teddy's instincts warned him to not enter, but his boredom and curiosity said otherwise.",
        options: [
            { text: "< Go Back", next: "noFriendAsylum0" },
            { text: "> Continue", next: "noFriendEnter0" }
        ]
    },

    noFriendEnter0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/DoorShut.png",
        text: "Teddy opens the door and steps in, instantly met by darkness. Teddy realizes the light was an illusion, and this was all a trap. As Teddy nearly escapes the door, it suddenly closes in his face.",
        options: [
            { text: "> Continue", next: "noFriendEnter1" }
        ]
    },

    noFriendEnter1: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "The door is locked, and after a desperate attempt to open the door, Teddy realizes he is trapped. He turns around to see what awaits him, only darkness and the cold, and an uneasy environment. Teddy's eyes soon adjust to the dark, and he spots a figure, sitting down leaning against the wall, motionless. Teddy decides to carefully approach and gently taps the figure waiting for a response.",
        options: [
            { text: "> Continue", next: "noFriendJosh0" }
        ]
    },

    noFriendJosh0: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "BACK OFF!",
        options: [
            { text: "> Continue", next: "noFriendJosh1" }
        ]
    },

    noFriendJosh1: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Calm down man, is your leg okay?",
        options: [
            { text: "< Go Back", next: "noFriendJosh0" },
            { text: "> Continue", next: "noFriendJosh2" }
        ]
    },

    noFriendJosh2: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "Oh... I thought you were something else.",
        options: [
            { text: "< Go Back", next: "noFriendJosh1" },
            { text: "> Continue", next: "noFriendJosh3" }
        ]
    },

    noFriendJosh3: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "What do you mean by that?",
        options: [
            { text: "< Go Back", next: "noFriendJosh2" },
            { text: "> Continue", next: "noFriendJosh4" }
        ]
    },

    noFriendJosh4: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "You want to know what happened to my leg?",
        options: [
            { text: "< Go Back", next: "noFriendJosh3" },
            { text: "> Continue", next: "noFriendJosh5" }
        ]
    },

    noFriendJosh5: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Sure.",
        options: [
            { text: "< Go Back", next: "noFriendJosh4" },
            { text: "> Continue", next: "noFriendJosh6" }
        ]
    },

    noFriendJosh6: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "There are things with us in here... whatever they are, they aren't human.",
        options: [
            { text: "< Go Back", next: "noFriendJosh5" },
            { text: "> Continue", next: "noFriendJosh7" }
        ]
    },

    noFriendJosh7: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "You're joking right?",
        options: [
            { text: "< Go Back", next: "noFriendJosh6" },
            { text: "> Continue", next: "noFriendScream" }
        ]
    },

    noFriendScream: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Suddenly a loud screech comes from deep within the abandoned building.",
        options: [
            { text: "< Go Back", next: "noFriendJosh7" },
            { text: "> Continue", next: "noFriendJosh8" }
        ]
    },

    noFriendJosh8: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "What was that?!",
        options: [
            { text: "< Go Back", next: "noFriendScream" },
            { text: "> Continue", next: "noFriendJosh9" }
        ]
    },

    noFriendJosh9: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "Monsters...",
        options: [
            { text: "< Go Back", next: "noFriendJosh8" },
            { text: "> Continue", next: "noFriendJosh10" }
        ]
    },

    noFriendJosh10: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Okay I believe you, how do I get out of this hell hole?",
        options: [
            { text: "< Go Back", next: "noFriendJosh9" },
            { text: "> Continue", next: "noFriendJosh11" }
        ]
    },

    noFriendJosh11: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "That door is the only way to escape, but you need a key.",
        options: [
            { text: "< Go Back", next: "noFriendJosh10" },
            { text: "> Continue", next: "noFriendJosh12" }
        ]
    },

    noFriendJosh12: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Please tell me you know where the key is.",
        options: [
            { text: "< Go Back", next: "noFriendJosh11" },
            { text: "> Continue", next: "noFriendJosh13" }
        ]
    },

    noFriendJosh13: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "I do, but it's not that simple. That monster has it.",
        options: [
            { text: "< Go Back", next: "noFriendJosh12" },
            { text: "> Continue", next: "noFriendJosh14" }
        ]
    },

    noFriendJosh14: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "So we have to steal the key from it? It's just one monster right?",
        options: [
            { text: "< Go Back", next: "noFriendJosh13" },
            { text: "> Continue", next: "noFriendJosh15" }
        ]
    },

    noFriendJosh15: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "There are two monsters.",
        options: [
            { text: "< Go Back", next: "noFriendJosh14" },
            { text: "> Continue", next: "noFriendJosh16" }
        ]
    },

    noFriendJosh16: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "You are telling me there are two monsters here trying to kill us. How do we even get the key.",
        options: [
            { text: "< Go Back", next: "noFriendJosh15" },
            { text: "> Continue", next: "noFriendJosh17" }
        ]
    },

    noFriendJosh17: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "Simple. Kill it or it kills you.",
        options: [
            { text: "< Go Back", next: "noFriendJosh16" },
            { text: "> Continue", next: "noFriendJosh18" }
        ]
    },

    noFriendJosh18: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "I can't fight those things alone man and you can't even help because of your leg.",
        options: [
            { text: "< Go Back", next: "noFriendJosh17" },
            { text: "> Continue", next: "noFriendJosh19" }
        ]
    },

    noFriendJosh19: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "Maybe I can't but I can help you survive. I know how to survive against those things.",
        options: [
            { text: "< Go Back", next: "noFriendJosh18" },
            { text: "> Continue", next: "noFriendJosh20" }
        ]
    },

    noFriendJosh20: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "Do tell.",
        options: [
            { text: "< Go Back", next: "noFriendJosh19" },
            { text: "> Continue", next: "noFriendJosh21" }
        ]
    },

    noFriendJosh21: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "The first monster will follow you around if you are alone, but you must never look back at it. I was too scared to look back and I survived it. And it only ever appeared when I was alone, after my friend...",
        options: [
            { text: "< Go Back", next: "noFriendJosh20" },
            { text: "> Continue", next: "noFriendJosh22" }
        ]
    },

    noFriendJosh22: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "I'm sorry for your loss.",
        options: [
            { text: "< Go Back", next: "noFriendJosh21" },
            { text: "> Continue", next: "noFriendJosh23" }
        ]
    },

    noFriendJosh23: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "The other monster killed him, that monster... it's like a predator. It has no weaknesses.",
        options: [
            { text: "< Go Back", next: "noFriendJosh22" },
            { text: "> Continue", next: "noFriendJosh24" }
        ]
    },

    noFriendJosh24: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "So I'm cooked.",
        options: [
            { text: "< Go Back", next: "noFriendJosh23" },
            { text: "> Continue", next: "noFriendJosh25" }
        ]
    },

    noFriendJosh25: {
        type: "dialogueStory",
        speaker: "Josh",
        image: "Images/Josh-sabayan.png",
        bgImage: "Images/story-mechanics.png",
        text: "There are weapons, you need to find them in these rooms.",
        options: [
            { text: "< Go Back", next: "noFriendJosh24" },
            { text: "> Continue", next: "noFriendExplore0" }
        ]
    },

    noFriendExplore0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy stays silent, he realizes he must explore the building with monsters constantly on his tail. He also realizes the sooner he waits, the less chance he has to survive, so after Josh's explanations, he begins to explore.",
        options: [
            { text: "> Continue", next: "noFriendExplore1" }
        ]
    },

    noFriendExplore1: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "As Teddy explores, he finds many rooms with supplies such as food, bandaids, and a flashlight. Teddy finds another room, he scavenges it to find a weird totem. This totem emits a mysterious and otherworldly energy, even so Teddy's guts and instincts decided to keep it, for good luck.",
        options: [
            { text: "> Continue", next: "noFriendExplore2" }
        ]
    },

    noFriendExplore2: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy continues his search to gear up for his encounter with the monsters, and as he is exploring, he senses something behind him.",
        options: [
            { text: "> Continue", next: "noFriendMonster1Choice" }
        ]
    },

    noFriendMonster1Choice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "What do you do?",
        options: [
            { text: "Look behind", next: "noFriendLookBehind1" },
            { text: "Keep eyes forward", next: "noFriendKeepForward1" }
        ]
    },

    noFriendLookBehind1: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy succumbs to his curiosity and takes a quick glance behind him. He sees a tall, white skinned skinny monster. For a split second Teddy makes eye contact with it and he realizes the immediate danger he is in. Teddy attempts to run for his life, but the monster is too fast, it catches him and kills him.",
        options: [
            { text: "> Continue", next: "noFriendGameOver" }
        ]
    },

    noFriendKeepForward1: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy is instantly on high alert, but reluctant to look around. After ignoring the peril, Teddy hears footsteps. The footsteps are seemingly following Teddy, growing faster with each step, until suddenly it rushes toward Teddy.",
        options: [
            { text: "> Continue", next: "noFriendMonster2Choice" }
        ]
    },

    noFriendMonster2Choice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Every fiber of Teddy's body is itching to turn around to defend itself. What do you do?",
        options: [
            { text: "Look behind", next: "noFriendLookBehind2" },
            { text: "Don't look", next: "noFriendDontLook" }
        ]
    },

    noFriendLookBehind2: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy looks behind, he sees monster 1 and realizes he messed up. Teddy tries to attack it, but it disappears. Teddy thinks the monster is gone and he is safe but suddenly the monster impales Teddy's stomach from behind...",
        options: [
            { text: "> Continue", next: "noFriendGameOver" }
        ]
    },

    noFriendDontLook: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy stayed strong. And as the last step finally reaches directly behind him, nothing happens. The uneasy atmosphere is lifted and Teddy no longer feels something approaching. He survived.",
        options: [
            { text: "> Continue", next: "noFriendAfterMonster1" }
        ]
    },

    noFriendGameOver: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Game Over.",
        options: [
            { text: "> Main Menu", next: null }
        ]
    },

    noFriendAfterMonster1: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "After the monster is gone, Teddy's heart beats out of his chest...",
        options: [
            { text: "> Continue", next: "noFriendBreakChoice" }
        ]
    },

    noFriendBreakChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy wonders if he should continue exploring or take a quick break to recover and lower heart rate. What do you do?",
        options: [
            { text: "Take a break", next: "noFriendRest1" },
            { text: "Go deeper into asylum", next: "noFriendDeeper0" }
        ]
    },

    noFriendRest1: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy sits down and controls his breathing... Unfortunately Teddy has no resources yet, nothing for his hunger. After a bit Teddy continues exploring.",
        options: [
            { text: "> Continue", next: "noFriendDeeper0" }
        ]
    },

    noFriendDeeper0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "As Teddy continues exploring, he ventures deeper and deeper into the asylum. Walking around, he notices some rooms but they seem empty. But he also has no resources right now.",
        options: [
            { text: "> Continue", next: "noFriendRoomChoice1" }
        ]
    },

    noFriendRoomChoice1: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "What do you do?",
        options: [
            { text: "Search rooms", next: "noFriendRoomSearch1" },
            { text: "Continue exploring", next: "noFriendIntersection" }
        ]
    },

    noFriendRoomSearch1: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        healthChange: 10,
        text: "Teddy searches the rooms and luckily he finds some bandages. Teddy stores the bandages and continues exploring after.",
        item: "Bandages",
        options: [
            { text: "> Continue", next: "noFriendIntersection" }
        ]
    },

    noFriendIntersection: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy finds an intersection, he can either go right or left...",
        options: [
            { text: "> Continue", next: "noFriendIntersectionChoice" }
        ]
    },

    noFriendIntersectionChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Which way do you go?",
        options: [
            { text: "Right", next: "noFriendRight" },
            { text: "Left", next: "noFriendLeft" }
        ]
    },

    noFriendRight: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        healthChange: -15,
        text: "Teddy goes right but he encounters a normal monster... Teddy is forced to fight the normal monster... Surprisingly, the normal monster was not that strong, but Teddy did take some damage in the encounter.",
        options: [
            { text: "> Continue", next: "noFriendBreakChoice2" }
        ]
    },

    noFriendLeft: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        hungerChange: 15,
        text: "Teddy goes left, as Teddy continues forward and he finds the asylum's cafeteria. Teddy searches the cafeteria for food and he finds a pieces of old bread.",
        item: "Bread",
        options: [
            { text: "> Continue", next: "noFriendBreakChoice2" }
        ]
    },

    noFriendBreakChoice2: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy: I'm kinda tired.. I should probably take a break. What do you do?",
        options: [
            { text: "Take a break to rest, eat, and heal", next: "noFriendRest2" },
            { text: "Don't take a break", next: "noFriendWeaponMonster0" }
        ]
    },

    noFriendRest2: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        hungerChange: 10,
        healthChange: 15,
        text: "Teddy eats his pieces of bread to fill his hunger and uses the bandages to heal himself. After resting Teddy continues exploring.",
        options: [
            { text: "> Continue", next: "noFriendWeaponMonster0" }
        ]
    },

    noFriendWeaponMonster0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy goes deeper into the asylum and encounters a normal monster. The monster is holding a small knife. Teddy wonders if he should risk it and fight the monster for the weapon...",
        options: [
            { text: "> Continue", next: "noFriendWeaponChoice" }
        ]
    },

    noFriendWeaponChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "What do you do?",
        options: [
            { text: "Fight monster", next: "noFriendFightMonster" },
            { text: "Run away from monster", next: "noFriendRunMonster" }
        ]
    },

    noFriendFightMonster: {
        type: "combat",
        winNext: "noFriendWin",
        loseNext: "noFriendLose",
        monsterHealth: 75,
    },

    noFriendRunMonster: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy runs away from the monster, thankfully it is too slow to chase.",
        options: [
            { text: "> Continue", next: "noFriendFollowMonster0" }
        ]
    },

    noFriendFollowMonster0: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy continues going deeper... suddenly he hears something, the monster. It does not notice Teddy so he follows the monster quietly.",
        options: [
            { text: "> Continue", next: "noFriendFollowMonster1" }
        ]
    },

    noFriendFollowMonster1: {
        type: "dialogueStory",
        speaker: "Teddy",
        image: "Images/Teddy.png",
        bgImage: "Images/story-mechanics.png",
        text: "I need to fight this monster...",
        options: [
            { text: "< Go Back", next: "noFriendFollowMonster0" },
            { text: "> Continue", next: "noFriendAttackChoice" }
        ]
    },

    noFriendAttackChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "What do you do?",
        options: [
            { text: "Sneak attack", next: "noFriendSneakAttack" },
            { text: "Wait for the right moment", next: "noFriendWait" }
        ]
    },

    noFriendSneakAttack: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy rushes the monster from behind, using his new weapon he stabs the monster over and over again. The monster is injured but not enough to subdue it. Teddy is forced to fight...",
        options: [
            { text: "> Continue", next: "noFriendFinalCombat" }
        ]
    },

    noFriendWait: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy continues to quietly follow the monster. The monster eventually reaches a room and Teddy stays hidden. Teddy waits for a while waiting for the perfect moment.",
        options: [
            { text: "> Continue", next: "noFriendSleepChoice" }
        ]
    },

    noFriendSleepChoice: {
        type: "choiceTwo",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "The monster falls asleep, Teddy makes his move by quietly entering the room the monster is sleeping in. The key is right next to the monster... What do you do?",
        options: [
            { text: "Move quietly to try and steal the key", next: "noFriendStealKey" },
            { text: "Attack the monster", next: "noFriendFinalCombat" }
        ]
    },

    noFriendStealKey: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy tip toes towards the key and slowly reaches for the key. Teddy successfully gets the key but he let out a sigh of relief too soon... luckily the monster did not wake up... Teddy then quietly leaves and once he is far enough, he runs back to the entrance to then successfully escape with Josh.",
        options: [
            { text: "> The End", next: null }
        ]
    },

    noFriendFinalCombat: {
        type: "combat",
        winNext: "noFriendWin",
        loseNext: "noFriendLose",
        monsterHealth: 75,
    },

    noFriendLose: {
        type: "gameOver",
    },

    noFriendWin: {
        type: "dialogueStory",
        speaker: "The Narrator",
        image: null,
        bgImage: "Images/story-mechanics.png",
        text: "Teddy stabs the monster's brain... he expects the monster to still get up so Teddy continues stabbing the monster everywhere... Ultimately the monster is dead. Apparently the monster's weakness is the brain. Teddy takes the key and successfully escapes with Josh.",
        options: [
            { text: "> The End", next: null }
        ]
    },
};

// here is the brain of the whole dialog system
function renderStep(stepId) {
    //see the current step in the story
    const step = story[stepId];

    if (step.item) { //gives player items in specific scenes
        giveItem(step.item);
    }

    if (!step || step.type === "gameOver") {
        showScene(sceneGameOver);
        return;
    }

    if (!step.options) {
        return;
    }

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
    if (activeImage) {
        if (step.image) {
            activeImage.style.display = "block";
            activeImage.src = step.image;
        } else {
            activeImage.style.display = "none";
        }
    }

    if (step.bgImage) {
        activeScene.style.backgroundImage = `url('${step.bgImage}')`;
        activeScene.style.backgroundSize = "cover";
        activeScene.style.backgroundPosition = "center";
        activeScene.style.zIndex = "-2";
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
        player.hunger -= 1; // drops hunger every step
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

                const nextStep = story[next];

                if (nextStep && nextStep.type === "combat") {
                    showScene(sceneCombat);
                    combatWinNext = nextStep.winNext;
                    combatLoseNext = nextStep.loseNext;
                    monsterBigEyes.health = nextStep.monsterHealth || 75;
                    fighting = true;
                    playersTurn = true;
                    playerDefending = false;
                    selectedAction = null;
                    selectCombatButton(null);
                    combatContinueBtn.onclick = combatRender;
                    updateCombatLog("You confront the monster bravely, be ready to attack and defend yourself to win this battle!");
                    progressBars();
                    return;
                }

                if (!next) {
                    showScene(sceneEscape);
                    return;
                }

                renderStep(next);
            };

        } else {
            btn.style.display = "none";
        }
    });
    typeWriter(activeDialogue, step.text);
}
