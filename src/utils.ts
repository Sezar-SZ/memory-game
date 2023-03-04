export function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

export function formatTime(seconds: number) {
    const minute = Math.floor(seconds / 60);
    const second = seconds - minute * 60;
    return minute.toString().padStart(2, '0') + ':' + second.toString().padStart(2, '0');
}
