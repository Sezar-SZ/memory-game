<script setup lang="ts">
import { onMounted, ref } from 'vue';
import './global.css';
import { shuffleArray } from './utils';
interface Card {
    emoji: string;
    isFolded: boolean;
}
let audio = new Audio('/ding.mp3');

const cardsImages = ['🐱', '🌷', '🍕', '🍔', '🔥', '☀', '🎯', '😎', '🍉', '🌳'];

const cards = ref<Card[]>([]);

function createMap(cardsImages: string[]) {
    const cards = shuffleArray([...cardsImages, ...cardsImages]);
    return cards.map((el) => {
        return { emoji: el, isFolded: true };
    });
}

onMounted(() => {
    cards.value = createMap(cardsImages);
});

let activeCardIndices: number[] = [];

let timeStart = 0;

function onCardClick(cardIndex: number) {
    if (!timeStart) timeStart = Date.now();
    if (activeCardIndices.includes(cardIndex)) return;
    if (activeCardIndices.length === 2) {
        foldCard(activeCardIndices[0]);
        foldCard(activeCardIndices[1]);
        activeCardIndices = [];
    }
    activeCardIndices.push(cardIndex);
    visibleCard(cardIndex);

    if (activeCardIndices.length === 2) {
        if (checkSameCards(activeCardIndices[0], activeCardIndices[1])) {
            visibleCard(activeCardIndices[1]);
            activeCardIndices = [];
            audio.play();
        }
    }
}

function foldCard(index: number) {
    cards.value[index].isFolded = true;
}

function checkSameCards(index1: number, index2: number) {
    if (cards.value[index1].emoji === cards.value[index2].emoji) return true;
    return false;
}

function visibleCard(index: number) {
    cards.value[index].isFolded = false;
}

// TODO: Show time took for player to win
// function checkIfOver(cards) {

// }
</script>

<template>
    <div class="mainContainer">
        <div class="cardsContainer">
            <div
                class="card"
                v-for="(card, index) in cards"
                :key="index"
                :class="card.isFolded ? 'cardFolded' : 'cardUnfolded'"
                @click="onCardClick(index)"
            >
                <span
                    :style="card.isFolded ? { visibility: 'hidden' } : { visibility: 'visible' }"
                    >{{ card.emoji }}</span
                >
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
/* TODO: Rewrite in bootstrap */
.mainContainer {
    width: 100vw;
    height: 100vh;
}
.cardsContainer {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
}

.card {
    border: solid 1px black;
    margin: 3vh 4vw;
    padding: 7.5vh 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    cursor: pointer;
    position: relative;

    span {
        position: absolute;
        font-size: 7vmin;
        user-select: none;
    }
}
.cardFolded {
    background-color: #222;
}
.cardUnfolded {
    background-color: #898;
}
</style>
