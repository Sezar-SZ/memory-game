<script setup lang="ts">
import { onMounted, reactive, ref, type Ref } from 'vue';
import { isAxiosError } from 'axios';
import axiosInstance from './axiosInstance';
import './global.css';

import LeaderboardModal from './components/LeaderboardModal.vue';

import { formatTime, shuffleArray } from './utils';
import type { PlayerData } from './types/api';

interface Card {
    emoji: string;
    isFolded: boolean;
}

let dingSound = new Audio('/ding.mp3');

const cardsImages = ['🐱', '🌷', '🍕', '🍔', '🔥', '☀', '🎯', '😎', '🍉', '🌳'];

const cards = ref<Card[]>([]);
const gameDuration = ref('');

const userData: { username: string | null; bestTime: number | null } = reactive({
    username: 'efef',
    bestTime: null,
});
const userTempData: { username: string | null; time: number | null } = reactive({
    username: null,
    time: null,
});

const error = ref<boolean>(false);

const isShowingModal = ref<null | 'leaderboard' | 'nameInput'>(null);

function createMap(cardsImages: string[]) {
    const cards = shuffleArray([...cardsImages, ...cardsImages]);
    return cards.map((el) => {
        return { emoji: el, isFolded: true };
    });
}

onMounted(async () => {
    cards.value = createMap(cardsImages);
    await getBestTime();
});

async function getBestTime() {
    try {
        const response = await axiosInstance.get<PlayerData>('/');
        userData.username = response.data.username;
        userData.bestTime = response.data.score;
    } catch (err: unknown) {
        if (isAxiosError<{ error: string }>(err) && err.response) {
            if (err.response.status === 401) {
                return;
            } else {
                error.value = true;
                console.log('Something went wrong');
            }
        } else {
            error.value = true;
            console.log('something went wrong');
        }
    }
}

async function setScore() {
    try {
        const response = await axiosInstance.post<PlayerData>('/', {
            username: userTempData.username,
            score: userTempData.time,
        });
        userData.username = response.data.username;
        userData.bestTime = response.data.score;
    } catch (error) {
        console.log('Something Went Wrong');
    }
}

let activeCardIndices: number[] = [];

let timeStart = 0;

async function onCardClick(cardIndex: number) {
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
            dingSound.play();
        }
    }

    if (gameIsOver(cards)) {
        const time = Math.ceil((Date.now() - timeStart) / 1000);
        gameDuration.value = formatTime(time);
        userTempData.time = time;
        await setScore();
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
        <div class="topMenu" v-if="userData.username">
            <div class="usernameContainer">
                <span>{{ userData.username }}</span>
            </div>
            <div class="scoreContainer">
                <span>{{ userData.bestTime }}</span>
            </div>
            <div class="leaderboardContainer" @click="isShowingModal = 'leaderboard'">
                <img src="/chart.svg" />
            </div>
        </div>
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
                    <!-- <span class="highScore">Your best time is {{ formatTime(bestTime!) }}</span> -->
                </div>
            </div>
        </Transition>
    </div>
    <LeaderboardModal v-if="isShowingModal" @modalClose="isShowingModal = null" />
</template>

<style scoped lang="scss">
/* TODO: Rewrite in bootstrap */
.mainContainer {
    width: 100vw;
    height: 100vh;
    position: relative;
}

.topMenu {
    margin: 1vh auto;
    width: 85%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
        font-size: clamp(12px, 5vmin, 45px);
        color: white;
    }
    .leaderboardContainer {
        cursor: pointer;
        img {
            filter: invert(100%);
            width: clamp(16px, 6vmin, 50px);
        }
    }
}
.cardsContainer {
    display: grid;
    grid-template-columns: repeat(5, 1fr);

    @media (max-width: 420px) {
        grid-template-columns: repeat(4, 1fr);
    }
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

    @media (max-width: 420px) {
        margin: 2vh 4vw;
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
