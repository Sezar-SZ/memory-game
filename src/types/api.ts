export interface PlayerData {
    username: string;
    score: number;
}

interface UserData extends PlayerData {
    position: number;
}

export interface Leaderboard {
    player: UserData;
    topPlayers: PlayerData[];
}
