<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import './global.css';
import { formatTime, shuffleArray } from './utils';
interface Card {
    emoji: string;
    isFolded: boolean;
}
let audio = new Audio('/ding.mp3');

const cardsImages = ['🐱', '🌷', '🍕', '🍔', '🔥', '☀', '🎯', '😎', '🍉', '🌳'];

const cards = ref<Card[]>([]);
const gameDuration = ref('');
const highScore = ref<number | null>(null);

function createMap(cardsImages: string[]) {
    const cards = shuffleArray([...cardsImages, ...cardsImages]);
    return cards.map((el) => {
        return { emoji: el, isFolded: true };
    });
}

onMounted(() => {
    cards.value = createMap(cardsImages);
    highScore.value = Number(localStorage.getItem('highScore')) || null;
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

    if (gameIsOver(cards)) {
        const time = Math.ceil((Date.now() - timeStart) / 1000);
        gameDuration.value = formatTime(time);
        if (!highScore.value || time < highScore.value) highScore.value = time;
        localStorage.setItem('highScore', highScore.value.toString());
        setTimeout(() => {
            location.reload();
        }, 3000);
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

function gameIsOver(cards: Ref<Card[]>) {
    return !cards.value.find((el) => el.isFolded === true);
}
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
        <Transition>
            <div class="timerContainer" v-if="gameDuration">
                <div class="timer">
                    <span class="main">
                        {{ gameDuration }}
                    </span>
                    <span class="highScore">Your best time is {{ formatTime(highScore!) }}</span>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
/* TODO: Rewrite in bootstrap */
.mainContainer {
    width: 100vw;
    height: 100vh;
    position: relative;
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

.timerContainer {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000e0066;
    backdrop-filter: blur(3px);

    .timer {
        height: 30%;
        width: 100%;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .main {
            font-size: 20vmin;
            color: #002000;
        }

        .highScore {
            font-size: 3vmin;
            color: #002000;
        }
    }
}

.v-enter-active,
.v-leave-active {
    transition: all 0.7s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
