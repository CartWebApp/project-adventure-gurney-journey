document.addEventListener("DOMContentLoaded", function () {

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
    const attackButton = document.getElementById("attack-button");
    const defendButton = document.getElementById("defend-button");
    const runButton = document.getElementById("run-button");
    const playButton = document.getElementById("play-button");
    const goBackButton = document.getElementById("go-back-button");

    //progress bars
    const playerHealth = document.getElementById("health-progress");
    const playerHunger = document.getElementById("hunger-progress");
    const bigEyesHealth = document.getElementById("health-progress-bigEyes");

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
        if (playerHealth) {
            playerHealth.value = player.health;
        }
        if (playerHunger) {
            playerHunger.value = player.hunger;
        }
        if (bigEyesHealth) {
            bigEyesHealth.value = monsterBigEyes.health;
        }
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

            bigEyesHealth.style.animation = "none";
            bigEyesHealth.offsetHeight;
            bigEyesHealth.style.animation = "shake 0.2s ease";

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

        playerHealth.style.animation = "none";
        playerHealth.offsetHeight;
        playerHealth.style.animation = "shake 0.2s ease";

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
            }
        }

        if (document.URL.includes("OtherPages/Second-main.html")) {
            playButton.onclick = () => {
                window.location.href = "Introduction-page.html";
            }
            goBackButton.onclick = () => {
                window.location.href = "/index.html";
            }


        }

        if (document.URL.includes("OtherPages/Friend-yes-no.html")) {
            friendYes.onclick = () => {
                player.hasFriend = true;
                window.location.href = "Select-friend.html";
                console.log("Has Friend:", player.hasFriend)
            };
            friendNo.onclick = () => {
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

        progressBars()
    }

    updateInventory()
    game()

    console.log(player.health)
    console.log(player.hasExtraLife)
    console.log(monsterBigEyes.health)

    // -- DIALOG HERE -- // -- DIALOG HERE -- // -- DIALOG HERE -- // -- DIALOG HERE -- //
    const friendYesBtn = document.getElementById("Friend-Y-button");
    const friendNoBtn = document.getElementById("Friend-N-button");

    const pickAnderdingusBtn = document.getElementById("pick-anderdingus");
    const pickJustinBtn = document.getElementById("pick-justin");

    const speakerText = document.getElementById("speaker-text");
    const dialogueText = document.getElementById("story-text");
    const characterImage = document.getElementById("image-text");

    const continueBtn = document.getElementById("continue");
    const goBackBtn = document.getElementById("go-back");

    const decision1Btn = document.getElementById("decision1");
    const decision2Btn = document.getElementById("decision2");
    const decision3Btn = document.getElementById("decision3");

    let currentStep = "intro0";
    let historyStack = [];

    const story = {
        intro0: {
            type: "dialogue",
            speaker: "The Narrator",
            image: null,
            text: "On a seemingly normal night, a 17 year old Teddy Barragan wakes up after a long nap.",
            next: "intro1"
        },

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
            next: "Decision-two-intro.html"
        },

        "Decision-two-intro.html": {
            type: "choice",
            speaker: "The Narrator",
            image: null,
            text: "What do you do?",
            options: [
                { text: "Turn on TV", next: "tvNews" },
                { text: "Don't turn on TV", next: "noTv" }
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

    // continue button to finish the intro and goes to the friend yes no page when clicked

    if (continueBtn) {
        continueBtn.addEventListener("click", () => {
            const step = story[currentStep];

            if (!step) return;

            // goes to the html page is selected for the decision pages with a delay of 600ms for the cool animation 
            if (step.next && step.next.includes(".html")) {
                setTimeout(() => {
                    window.location.href = step.next;

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
