import { items } from "./StoryData.js";

export const player = {
    health: 100,
    hunger: 100,
    damage: 7.5,
    hasFriend: false,
    hasExtraLife: false,
    weapon: null,
    weaponActive: false,
    friend: null
};

export const monsterBigEyes = {
    health: 45,
    damage: 3,
};

export const combatState = {
    playersTurn: true,
    fighting: true,
    playerDefending: false,
    selectedAction: null,
    winNext: null,
    loseNext: null,
};

export let journal = [];

export let choiceLog = [];

export let inventory = [];

export let currentStep = "intro0";

export function setCurrentStep(step) {
    currentStep = step;
}


export function progressBars() {
    const playerHealth = document.querySelectorAll(".health-progress");
    const playerHunger = document.querySelectorAll(".hunger-progress");
    const bigEyesHealth = document.querySelectorAll(".health-progress-bigEyes");

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

//inventory

export function renderInventory() {
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
            slot.querySelector("img").onclick = () => useItem(item);
        });
    });
}

// the weapons type

const baseDamage = player.damage;

export function equipWeapon(item) {
    if (player.weapon === item) return;
    player.weapon = item;
    player.damage = baseDamage * item.multi;
}

// Items functions

export function randomItem() {
    const index = Math.floor(Math.random() * items.length);
    return items[index];
}

export function searchRoom() {
    const found = Math.random() < 0.30;
    if (!found) return;
    addRandomItem();
}

export function addRandomItem() {
    const item = randomItem();
    inventory.push(item);
    if (item.type === "weapon") equipWeapon(item);
    renderInventory();
}

export function giveItem(itemName) {
    const item = items.find(i => i.name === itemName);
    if (!item) return;
    inventory.push(item);
    if (item.type === "weapon") equipWeapon(item);
    renderInventory();
}

export function useItem(item) {
    if (item.type === "food") {
        player.hunger = Math.min(100, player.hunger + item.hunger);
        inventory.splice(inventory.indexOf(item), 1);

    } else if (item.type === "heal") {
        player.health = Math.min(100, player.health + item.heal);
        inventory.splice(inventory.indexOf(item), 1);

    } else if (item.type === "extraLife") {
        player.hasExtraLife = true;

    } else if (item.type === "weapon") {
        equipWeapon(item);
    }

    progressBars();
    renderInventory();
}

export function addToJournal() {
    
}

export function addToChoiceLog() {

}