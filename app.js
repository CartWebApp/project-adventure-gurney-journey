document.addEventListener("DOMContentLoaded", function () {

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
    const goBackButtonSecondPage = document.getElementById("go-back-button");
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

    // -- OVERLAYS -- //
    const SettingIcon = document.querySelector('.Settings');
    const achievmentsOverlay = document.getElementById("achievements-button");
    const creditsOverlay = document.getElementById("credits-button");


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
        overlayToShow.classList.remove("active");
        overlayToShow.classList.add("hidden");
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
                        showScene(sceneMenu2);
                    }
                }, 480);
            }
        }

        if (sceneMenu2) {
            playButton.onclick = () => {
                showScene(sceneIntro);
            }
            goBackButton.onclick = () => {
                showScene(sceneHome);
            }


        }

        if (sceneFriend) {
            friendYes.onclick = () => {
                player.hasFriend = true;
                showScene(sceneFriendYN);
                console.log("Has Friend:", player.hasFriend)
            };
            friendNo.onclick = () => {
                player.hasFriend = false;
                showScene(sceneStory);
                console.log("Has Friend:", player.hasFriend)
            };
        }

        if (sceneGameOver) {
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
    }

    updateInventory()
    game()

    console.log(player.health)
    console.log(player.hasExtraLife)
    console.log(monsterBigEyes.health)

    // -- DIALOG HERE -- // -- DIALOG HERE -- // -- DIALOG HERE -- // -- DIALOG HERE -- //

    const pickAnderdingusBtn = document.getElementById("pick-anderdingus");
    const pickJustinBtn = document.getElementById("pick-justin");

    const speakerText = document.querySelector(".title-text");
    const dialogueText = document.querySelector(".description-text");
    const characterImage = document.querySelector(".image-text");

    const decision1Btn = document.querySelector(".decision1");
    const decision2Btn = document.querySelector(".decision2");
    const decision3Btn = document.querySelector(".decision3");

    let currentStep = "intro0";
    let historyStack = [];

    const story = {
        intro0: {
            type: "dialogue",
            speaker: "The Narrator",
            image: null,
            bgImage: "/Image/Introduction-image.png",
            text: "On a seemingly normal night, a 17 year old Teddy Barragan wakes up after a long nap.",
            next: "intro1",
            options: [
                { Decision1: "Next", next: "intro1" }
            ]
        },

        intro1: {
            type: "dialogue",
            speaker: "Teddy",
            image: "/Images/Teddy.png",
            bgImage: "/Image/Introduction-image.png",
            text: "I'm so hungry. Maybe I should get some McDonalds.",
            next: "intro2",
            options: [
                { Decision1: "Back", next: "intro0" },
                { Decision2: "Next", next: "intro2" }
            ]
        },

        intro2: {
            type: "dialogue",
            speaker: "Teddy",
            image: "/Images/Teddy.png",
            bgImage: "/Image/Introduction-image.png",
            text: "Should I turn on the TV to check the news real quick?",
            page: "Decision-two-intro.html",
            next: "tvDecision"
        },

        tvDecision: {
            type: "choice",
            speaker: "The Narrator",
            image: null,
            text: "What do you do?",
            options: [
                { Decision1: "Turn on TV", next: "tvNews" },
                { Decision2: "Don't turn on TV", next: "noTv" }
            ]
        },

        tvNews: {
            type: "dialogue",
            speaker: "TV",
            image: "/Images/tv.png",
            text: "35-year-old Josh Ayala reported missing near Athens Lunatic Asylum.",
            next: "tvReact"
        },

        tvReact: {
            type: "dialogue",
            speaker: "Teddy",
            image: "/Images/Teddy.png",
            text: "Isn't that the abandoned insane asylum?",
            next: "afterNews"
        },

        noTv: {
            type: "dialogue",
            speaker: "Teddy",
            image: "/Images/Teddy.png",
            text: "Nah... I'm just gonna go get food.",
            next: "afterNews"
        },

        afterNews: {
            type: "dialogue",
            speaker: "The Narrator",
            image: null,
            text: "Click next to decide if Teddy should call a friend...",
            next: "friendChoice"
        }
    };

    // here is the brain of the whole dialog system
    function renderStep(stepId) {
        //see the current step in the story
        const step = story[stepId];

        if (!step) return;

        if (!speakerText || !dialogueText || !characterImage) return;

        // here it saves the current step into a history stack by pushing it and making a list of steps
        if (currentStep) {
            historyStack.push(currentStep); // add current step to history stack
        }

        currentStep = stepId;

        if (sceneIntro) {
            speakerText.textContent = step.speaker + ":"; // changes text-story in box
            dialogueText.textContent = step.text; // changes speaker in box
            // changes image in box
            if (step.image) {
                characterImage.style.display = "block";
                characterImage.src = step.image;
            } else {
                characterImage.style.display = "none";
            }
        }

        if (sceneDecisionTwoIntro) {
            speakerText.textContent = step.speaker + ":"; // changes text-story in box
            dialogueText.textContent = step.text; // changes speaker in box
            // changes image in box
            if (step.image) {
                characterImage.style.display = "block";
                characterImage.src = step.image;
            } else {
                characterImage.style.display = "none";
            }

            decision1Btn.textContent = step.options.Decision1

        }

    }

    // continue button to finish the intro and goes to the friend yes no page when clicked
    if (continueBtn) {
        continueBtn.addEventListener("click", () => {
            const step = story[currentStep];

            if (!step) return;

            // goes to the html page is selected for the decision pages with a delay of 600ms for the cool animation 
            if (step.next === "friendChoice") {
                setTimeout(() => {
                    showScene(sceneFriendYN);
                }, 600);
                return;
            }

            renderStep(step.next);
        });
    }

    if (goBackBtn) {
        goBackBtn.addEventListener("click", () => {
            const previous = historyStack.pop(); // remove the last step from the history stack and returns it
            if (!previous) return; // if there is nothing in history stack do nothing

            renderStep(previous); // load the previous step
        });
    }

    if (speakerText && dialogueText && characterImage) {
        renderStep(currentStep);
    }
});
