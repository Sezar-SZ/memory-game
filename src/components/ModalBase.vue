<script setup lang="ts">
type Mode = 'leaderboard' | 'nameInput';
const props = defineProps<{ mode: Mode }>();
</script>

<template>
    <div class="fullScreen">
        <div class="modalContainer">
            <div
                class="closeButtonContainer"
                v-if="props.mode === 'leaderboard'"
                @click="$emit('modalClose')"
            >
                <img src="/close.svg" />
            </div>
            <main>
                <slot></slot>
            </main>
        </div>
    </div>
</template>

<style lang="scss">
.fullScreen {
    position: absolute;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: #000a;
    backdrop-filter: blur(3px);
    display: flex;
    justify-content: center;
    align-items: center;
}

.closeButtonContainer {
    cursor: pointer;
    margin-left: 1vw;
    img {
        filter: invert(100%);
        width: clamp(12px, 6vmin, 80px);
    }
}

.modalContainer {
    width: 40%;
    height: 85%;
    background-color: #2d2d2d;
    border-radius: 10px;
}

@media (max-width: 480px) {
    .modalContainer {
        width: 100%;
        height: 100%;
    }
    .closeButtonContainer {
        margin-left: 2vw;
        margin-top: 2vh;
    }
}
</style>
