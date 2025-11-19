import { SPOTIFY_AUTH_URL, SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from "./common";

export default function handleSpotifySignIn() {
    const scopes = [
        "user-read-private",
        "user-read-email",
        "playlist-read-private",
        "playlist-read-collaborative",
    ];
    const authUrl = `${SPOTIFY_AUTH_URL}` +
        `?response_type=code` +
        `&client_id=${encodeURIComponent(SPOTIFY_CLIENT_ID || "")}` +
        `&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI || "")}` +
        `&scope=${encodeURIComponent(scopes.join(" "))}` +
        `&state=${encodeURIComponent("state")}`;

    window.location.href = authUrl;
}