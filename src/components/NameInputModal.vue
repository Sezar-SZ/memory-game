<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
</script>

<template>
    <div class="fullScreen">
        <div class="modalContainer">
            <form>
                <label>Enter you Username:</label>
                <input type="text" v-model="username" />
                <button>Submit</button>
            </form>
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
    align-items: start;
}

.modalContainer {
    margin-top: 20vh;
    width: 80%;
    height: 35%;
    background-color: #2d2d2d;
    border-radius: 10px;
    max-width: 1200px;

    display: flex;
    justify-content: center;
    align-items: center;

    form {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        label {
            color: #ddd;
        }
        input {
            margin-top: 2vh;
            width: 30%;
            padding: 9px 5px;
            background-color: #eee;
            border: none;
            border-radius: 5px;
        }
        button {
            all: unset;
            margin-top: 2vh;
            padding: 7px 10px;
            background-color: #eee;
            border: 1px solid black;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover {
            background-color: #ddd;
        }
    }
}

@media (max-width: 480px) {
    .modalContainer {
        width: 90%;
        height: 30%;
        form {
            input {
                width: 80%;
            }
        }
    }
}
</style>
