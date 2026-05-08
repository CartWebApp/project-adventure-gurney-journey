import { story } from "./StoryData.js";
import {
    player,
    monsterBigEyes,
    progressBars,
    giveItem,
    searchRoom,
    combatState,
    journal,
    addToJournal,
    setCurrentStep,
    choiceLog,
    addToChoiceLog
} from "./GameLogic.js";

// -- BUTTONS -- //
const retryButton = document.querySelector(".retry");
const mainMenuButton = document.querySelector(".mainmenu");
const mainMenuButtonEscaped = document.querySelector(".mainmenu-escaped");
const retryButtonEscaped = document.querySelector(".retry-escaped");
const extraLifeYes = document.getElementById("extra-life-yes-button");
const extraLifeNo = document.getElementById("extra-life-no-button");
const friendYes = document.getElementById("Friend-Y-button");
const friendNo = document.getElementById("Friend-N-button");
const indexContinue = document.getElementById("index-continue");
const clickContinue = document.getElementById("click-continue");
const attackButton = document.getElementById("attack-button");
const defendButton = document.getElementById("defend-button");
const runButton = document.getElementById("run-button");
const playButton = document.getElementById("play-button");
const goBackButtonSecondPage = document.querySelector(".go-back-button");
const goBackBtn = document.querySelector(".go-back-button-text");
const continueBtn = document.querySelector(".continue-button-text");
const combatContinueBtn = document.querySelector("#scene-combat .decision2");
const summaryRetryButton = document.getElementById("summary-retry");
const summaryMainMenuButton = document.getElementById("summary-mainmenu");
const volumeIcons = document.querySelectorAll(".Volume");

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
const sceneSummary = document.getElementById("scene-summary");

// -- PROGRESS BARS -- //
const playerHealth = document.querySelectorAll(".health-progress");
const playerHunger = document.querySelectorAll(".hunger-progress");
const bigEyesHealth = document.querySelectorAll(".health-progress-bigEyes");

// -- BACKGROUND OVERLAYS -- //
const achievementsOverlayBackground = document.getElementById("achievements-overlay-background");
const creditsOverlayBackground = document.getElementById("credits-overlay-background");
const settingsOverlayBackground = document.getElementById("settings-overlay-background");

// -- OVERLAY BUTTONS -- //
const achievementsButton = document.getElementById("achievements-button");
const creditsButton = document.getElementById("credits-button");

// -- OVERLAYS -- //
const creditsOverlay = document.getElementById("credits-overlay-container");
const settingsOverlay = document.getElementById("settings-overlay-container");
const achievementsOverlay = document.getElementById("achievements-overlay-container");

// -- OVERLAY INSIDE BUTTONS -- //
const settingsContinue = document.getElementById("continue-settings");
const settingsRestart = document.getElementById("restart-program-settings");
const settingsExit = document.getElementById("exit-program-settings");

// -- FRIEND PICK BUTTONS -- //
const pickAnderdingusBtn = document.getElementById("pick-anderdingus");
const pickJustinBtn = document.getElementById("pick-justin");

// -- JOURNAL OVERLAY-- //
const journalOverlay = document.getElementById("journal-overlay-container");
const journalOverlayBackground = document.getElementById("journal-overlay-background");
const journalClose = document.getElementById("journal-close");
const journalEntriesContainer = document.getElementById("journal-entries");

// -- SUMMARY PAGE -- //
const summaryEndingTitle = document.getElementById("summary-ending-title");
const summaryHealth = document.getElementById("summary-health");
const summaryHunger = document.getElementById("summary-hunger");
const summaryChoicesCount = document.getElementById("summary-choices-count");
const summaryStepsCount = document.getElementById("summary-steps-count");
const summaryPathEntries = document.getElementById("summary-path-entries");
const summaryChoiceEntries = document.getElementById("summary-choice-entries");

// // -- AUDIO -- //
const bgMusic = new Audio("/Images/Audio.mp3");
bgMusic.loop = true;


// Switching scenes

export function showScene(sceneToShow) {
    const allScenes = document.querySelectorAll(".scene");
    allScenes.forEach(scene => {
        scene.classList.remove("active");
        scene.classList.add("hidden");
    });
    sceneToShow.classList.remove("hidden");
    sceneToShow.classList.add("active");
}

export function showOverlay(overlayToShow) {
    const allOverlays = document.querySelectorAll(".overlay");
    allOverlays.forEach(overlay => {
        overlay.classList.remove("active");
        overlay.classList.add("hidden");
    });
    overlayToShow.classList.remove("hidden");
    overlayToShow.classList.add("active");
}

export function hideOverlay(overlayToHide) {
    overlayToHide.classList.remove("active");
    overlayToHide.classList.add("hidden");
}

export function hideOverlayShowScene(sceneToShow) {
    const allOverlays = document.querySelectorAll(".overlay");
    allOverlays.forEach(overlay => {
        overlay.classList.remove("active");
        overlay.classList.add("hidden");
    });
    showScene(sceneToShow);
}

let isMuted = false;

function toggleVolume() {
    isMuted = !isMuted;

    volumeIcons.forEach(icon => {
        if (isMuted) {
            icon.src = "/Images/Volume-muted.png";
        } else {
            icon.src = "/Images/Volume.png";
        }
    });

    if (isMuted) {
        bgMusic.pause();
    } else {
        bgMusic.play();
    }
}

// the Typewritter
let currentTimer = null;

export function typeWriter(element, text, speed = 30) {
    element.textContent = "";
    element.onclick = null;
    let i = 0;
    let done = false;

    if (currentTimer) {
        clearInterval(currentTimer);
        currentTimer = null;
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

// Here starts the combat

function updateCombatLog(message) {
    const combatDialogue = document.querySelector(".description-text-section-combat .description-text");
    if (combatDialogue) typeWriter(combatDialogue, message);
}

function selectCombatButton(selectedBtn) {
    const allCombatBtns = [attackButton, defendButton, runButton];
    allCombatBtns.forEach(btn => {
        if (btn) btn.style.opacity = "1";
    });
    if (selectedBtn) selectedBtn.style.opacity = "0.75";
}

function setCombatButtonsVisible(visible) {
    if (attackButton) attackButton.style.display = visible ? "flex" : "none";
    if (defendButton) defendButton.style.display = visible ? "flex" : "none";
    if (runButton) runButton.style.display = visible ? "flex" : "none";
    if (combatContinueBtn) combatContinueBtn.style.display = visible ? "flex" : "none";
}

if (attackButton) {
    attackButton.onclick = () => {
        if (!combatState.playersTurn || !combatState.fighting) return;
        combatState.selectedAction = "attack";
        selectCombatButton(attackButton);
    };
}

if (defendButton) {
    defendButton.onclick = () => {
        if (!combatState.playersTurn || !combatState.fighting) return;
        combatState.selectedAction = "defend";
        selectCombatButton(defendButton);
    };
}

if (runButton) {
    runButton.onclick = () => {
        if (!combatState.playersTurn || !combatState.fighting) return;
        combatState.selectedAction = "run";
        selectCombatButton(runButton);
    };
}

// Ends player Turn function

function endPlayerTurn() {
    combatState.playersTurn = false;
    setTimeout(() => monsterTurn(), 600);
}

// Monster function turn

function monsterTurn() {
    if (!combatState.fighting) return;

    let damage = monsterBigEyes.damage;

    if (combatState.playerDefending) {
        damage *= 0.5;
        combatState.playerDefending = false;
        setTimeout(() => {
            updateCombatLog(`The monster deals you ${damage} damage. Luckly you defended yourself, now you only take ${damage} damage!`);
        }, 4000);
    } else {
        setTimeout(() => {
            updateCombatLog(`The monster deals you ${damage} damage. Next time try to defend yourself becuase that really hurt!`);
        }, 4000);
    }

    player.health -= damage;
    progressBars();

    playerHealth.forEach(bar => {
        bar.style.animation = "none";
        bar.offsetHeight;
        bar.style.animation = "shake 0.2s ease";
    });

    if (player.health <= 0) {
        combatState.fighting = false;
        progressBars();
        updateCombatLog("Your health is gone. The monster has defeated you! You lose!");
        setTimeout(() => {
            if (combatState.loseNext) {
                renderStep(combatState.loseNext);
            } else {
                showSummary("defeated");
            }
        }, 8000);
        return;
    }

    combatState.playersTurn = true;

    setTimeout(() => {
        updateCombatLog("The monster finished its attack. Now pick between attacking, defending or running away!");
        combatState.selectedAction = null;
        selectCombatButton(null);
        if (combatContinueBtn) combatContinueBtn.onclick = combatRender;
    }, 8000);
}

// Render of the Combat

function combatRender() {
    if (!combatState.selectedAction || !combatState.playersTurn || !combatState.fighting) return;

    if (combatState.selectedAction === "attack") {
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
            combatState.fighting = false;
            progressBars();
            updateCombatLog(`You attack the monster for ${dmgDealt} damage. After a brutal battle, you defeat the monster! You win!`);
            setTimeout(() => {
                if (combatState.winNext) renderStep(combatState.winNext);
            }, 1500);
            return;
        }

        updateCombatLog(`You attack the monster for ${dmgDealt} damage. The monster is still alive! Keep fighting!`);

    } else if (combatState.selectedAction === "defend") {
        combatState.playerDefending = true;
        updateCombatLog("You defended yourself, it looks like the monster berely damaged you! Nice block!");
        combatState.selectedAction = null;
        selectCombatButton(null);
        endPlayerTurn();
        return;

    } else if (combatState.selectedAction === "run") {
        const escape = Math.random() < 0.5;

        if (escape) {
            combatState.fighting = false;
            updateCombatLog("You retreat from the monster, luckly the monster didn't chase you. You escaped successfully!");
            setTimeout(() => {
                if (combatState.winNext) renderStep(combatState.winNext);
            }, 1500);
            return;
        }

        updateCombatLog("You try to run but the monster is faster than you! You're forced to keep fighting.");
    }

    combatState.selectedAction = null;
    selectCombatButton(null);
    endPlayerTurn();
}


// the journal render 
function renderJournal() {
    journalEntriesContainer.innerHTML = "";

    if (journal.length === 0) {
        journalEntriesContainer.innerHTML = `<p style="color:#888; text-align:center;">Your story has not begun yet...</p>`;
        return;
    }

    [...journal].reverse().forEach(entry => {
        const div = document.createElement("div");
        div.classList.add("journal-entry");
        div.innerHTML = `
            <p class="journal-entry-number">Entry #${entry.timestamp}</p>
            <p class="journal-entry-speaker">${entry.speaker}:</p>
            <p class="journal-entry-text">${entry.text}</p>
            ${entry.choice ? `<p class="journal-entry-choice">> You chose: "${entry.choice}"</p>` : ""}
        `;
        journalEntriesContainer.appendChild(div);
    });
}

function openJournal() {
    renderJournal();
    showOverlay(journalOverlay);
}

function getEndingTitle() {
    if (player.hasFriend) {
        return "Ending: You called a friend";
    } else {
        return "Ending: You picked solo mode";
    }
}

console.log(window.innerWidth);

// fills the whole summary page
function showSummary(outcome) {
    summaryHealth.textContent = `${player.health} / 100`;
    summaryHunger.textContent = `${player.hunger} / 100`;
    summaryChoicesCount.textContent = choiceLog.length;
    summaryStepsCount.textContent = journal.length;

    if (outcome === "escaped") {
        summaryEndingTitle.textContent = getEndingTitle() + " — Escaped!";
        summaryEndingTitle.style.color = "#7fbf7f";
    } else {
        summaryEndingTitle.textContent = getEndingTitle() + " — Defeated";
        summaryEndingTitle.style.color = "darkred";
    }

    summaryPathEntries.innerHTML = "";
    journal.forEach((entry, i) => {
        const div = document.createElement("div");
        div.classList.add("summary-path-entry");
        div.innerHTML = `
            <span class="summary-path-number">#${i + 1}</span>
            <span class="summary-path-text">
                <strong>${entry.speaker}:</strong> ${entry.text}
                ${entry.choice ? `<br><em style="color:lightcoral;"> Chose: "${entry.choice}"</em>` : ""}
            </span>
        `;
        summaryPathEntries.appendChild(div);
    });

    summaryChoiceEntries.innerHTML = "";
    if (choiceLog.length === 0) {
        summaryChoiceEntries.innerHTML = `<p style="color:#888;">No choices were recorded.</p>`;
    } else {
        choiceLog.forEach(entry => {
            const div = document.createElement("div");
            div.classList.add("summary-choice-entry");
            div.innerHTML = `
                <p class="summary-choice-number">Choice #${entry.stepNumber}</p>
                <p class="summary-choice-text">> "${entry.choice}"</p>
            `;
            summaryChoiceEntries.appendChild(div);
        });
    }

    showScene(sceneSummary);
}



// Render of the Dialogue
export function renderStep(stepId) {

    const step = story[stepId];

    if (!step || step.type === "gameOver") {
        showScene(sceneGameOver);
        return;
    }

    addToJournal(step);

    if (step.item) {
        giveItem(step.item);
    }

    if (!step.options) return;

    setCurrentStep(stepId);

    if (step.type === "dialogueIntro") showScene(sceneIntro);
    else if (step.type === "choiceIntro") showScene(sceneDecisionTwoIntro);
    else if (step.type === "choiceTwo") showScene(sceneDecisionTwo);
    else if (step.type === "choiceThree") showScene(sceneDecisionThree);
    else if (step.type === "dialogueStory") showScene(sceneStory);

    const activeScene = document.querySelector(".scene.active");
    const activeSpeaker = activeScene.querySelector(".title-text");
    const activeDialogue = activeScene.querySelector(".description-text");
    const activeImage = activeScene.querySelector(".image-text");
    const activeDecision1 = activeScene.querySelector(".decision1");
    const activeDecision2 = activeScene.querySelector(".decision2");
    const activeDecision3 = activeScene.querySelector(".decision3");
    const linkText = activeScene.querySelector(".link-text");

    activeSpeaker.textContent = step.speaker + ":";

    if (activeImage) {
        if (step.image) {
            activeImage.style.display = "block";
            activeImage.src = step.image;
        } else {
            activeImage.style.display = "none";
        }
    }

    function bgImgSize() {
        const width = window.innerWidth;

        if (width > 600) {

            if (step.bgImage) {
                activeScene.style.backgroundImage = `url('${step.bgImage}')`;

                activeScene.style.backgroundSize = "cover";

                activeScene.style.zIndex = "-2";
            } else {
                activeScene.style.backgroundImage = "none";
            }
        }


        if (width <= 600) {

            if (step.bgImage) {
                activeScene.style.backgroundImage = `url('${step.bgImage}')`;
                activeScene.style.height = "40vh";
                activeScene.style.zIndex = "-2";
            } else {
                activeScene.style.backgroundImage = "none";
            }
        }
    }

    if (linkText) {
        linkText.style.justifyContent = step.options.length === 1 ? "flex-end" : "";
    }

    if (step.healthChange) {
        player.health += step.healthChange;
        if (player.health <= 0) {
            player.health = 0;
            showSummary("defeated");
            return;
        }
        progressBars();
    }

    if (step.hungerChange) {
        player.hunger += step.hungerChange;
        if (player.hunger < 0) player.hunger = 0;
        progressBars();
    }

    if (step.type === "dialogueStory" || step.type === "choiceTwo" || step.type === "choiceThree") {
        player.hunger -= 1.5;
        if (player.hunger <= 0) {
            player.hunger = 0;
            player.health -= 2;
        }
        progressBars();
    }

    const buttons = [activeDecision1, activeDecision2, activeDecision3];

    buttons.forEach((btn, i) => {
        if (!btn) return;

        if (step.options[i]) {
            btn.style.display = "flex";
            btn.textContent = step.options[i].text;

            btn.onclick = () => {
                const next = step.options[i].next;
                const choiceText = step.options[i].text;

                if (journal.length > 0) {
                    journal[journal.length - 1].choice = choiceText;
                }

                if (step.type === "choiceTwo" || step.type === "choiceThree" || step.type === "choiceIntro") {
                    addToChoiceLog(stepId, choiceText, next || "end");
                }

                if (next === "decisionFriend") {
                    showScene(sceneFriendYN);
                    return;
                }

                const nextStep = story[next];

                if (nextStep && nextStep.type === "combat") {
                    showScene(sceneCombat);
                    combatState.winNext = nextStep.winNext;
                    combatState.loseNext = nextStep.loseNext;
                    monsterBigEyes.health = nextStep.monsterHealth || 45;
                    combatState.fighting = true;
                    combatState.playersTurn = true;
                    combatState.playerDefending = false;
                    combatState.selectedAction = null;
                    selectCombatButton(null);
                    combatContinueBtn.onclick = combatRender;
                    updateCombatLog("You confront the monster bravely, be ready to attack and defend yourself to win this battle!");
                    progressBars();
                    return;
                }

                if (!next) {
                    showSummary("escaped");
                    return;
                }

                renderStep(next);
            };

        } else {
            btn.style.display = "none";
        }
    });
    bgImgSize();
    typeWriter(activeDialogue, step.text);
}


function game() {
    document.querySelectorAll('.Settings').forEach(btn => {
        btn.onclick = () => showOverlay(settingsOverlay);
    });

    if (settingsOverlayBackground) {
        settingsOverlayBackground.onclick = () => {
            hideOverlay(settingsOverlay);
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
                    clearInterval(timer); // this clears time so it doesnt go infinite

                    indexContinue.style.animation = "none";
                    clickContinue.style.color = "#D9D9D9";
                    showScene(sceneMenu2);
                }
            }, 480);
        };
    }

    playButton.onclick = () => {
        showScene(sceneIntro);
        renderStep("intro0");
    };

    if (goBackButtonSecondPage) {
        goBackButtonSecondPage.onclick = () => {
            showScene(sceneHome);
        }
    }

    if (achievementsOverlay) {
        achievementsButton.onclick = () => {
            showOverlay(achievementsOverlay);
        }
    }

    if (creditsButton) {
        creditsButton.onclick = () => {
            showOverlay(creditsOverlay);
        }
    }

    if (achievementsOverlay) {
        achievementsOverlayBackground.onclick = () => {
            hideOverlay(achievementsOverlay);
        }
    }

    if (creditsOverlay) {
        creditsOverlayBackground.onclick = () => {
            hideOverlay(creditsOverlay);
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
            setCurrentStep("noFriend0");
            showScene(sceneStory);
            renderStep("noFriend0");
        };
    }

    if (pickAnderdingusBtn) {
        pickAnderdingusBtn.onclick = () => {
            player.friend = "Anderdingus";
            setCurrentStep("withAnderdingus0");
            showScene(sceneStory);
            renderStep("withAnderdingus0");
        };
    }

    if (pickJustinBtn) {
        pickJustinBtn.onclick = () => {
            player.friend = "Justin";
            setCurrentStep("withJustin0");
            showScene(sceneStory);
            renderStep("withJustin0");
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

    mainMenuButton.onclick = () => showScene(sceneHome);
    retryButton.onclick = () => showScene(sceneMenu2);
    mainMenuButtonEscaped.onclick = () => showScene(sceneHome);
    retryButtonEscaped.onclick = () => showScene(sceneMenu2);

    extraLifeNo.onclick = () => showScene(sceneHome);
    extraLifeYes.onclick = () => {
        // placeholder
    };

    if (document.getElementById("search")) {
        document.getElementById("search").onclick = () => searchRoom();
    }

    if (journalOverlay) {
        document.querySelectorAll(".journal-button").forEach(btn => {
            btn.onclick = () => openJournal();
        });

        journalClose.onclick = () => {
            hideOverlay(journalOverlay);
        }

        journalOverlayBackground.onclick = () => {
            hideOverlay(journalOverlay);
        }
    }

    if (summaryRetryButton) {
        summaryRetryButton.onclick = () => {
            showScene(sceneMenu2);
        }
    }

    if (summaryMainMenuButton) {
        summaryMainMenuButton.onclick = () => {
            showScene(sceneHome);
        }
    }

    volumeIcons.forEach(icon => {
        icon.onclick = () => {
            toggleVolume();
        }
    });
}

progressBars();
game();