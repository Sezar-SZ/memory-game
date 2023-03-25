<script setup lang="ts">
import axiosInstance from '@/axiosInstance';
import { onMounted } from 'vue';

import ModalBase from './ModalBase.vue';

onMounted(() => {
    console.log('helloooo!');
});

async function getLeaderboard() {
    try {
        const response = await axiosInstance.get('/leaderboard');
        // set leaderboard
    } catch (err: unknown) {
        return;
    }
}
</script>

<template>
    <ModalBase mode="leaderboard">Hello!</ModalBase>
</template>

<style lang="scss"></style>
