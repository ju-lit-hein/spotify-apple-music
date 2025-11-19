import React from "react";
import { SPOTIFY_API_BASE_URL } from "./common";

export default function getPlaylistTracks(spotifyCode: string, playlistID: string) {
  return fetch(`${SPOTIFY_API_BASE_URL}/playlists/${playlistID}/tracks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${spotifyCode}`,
    },
  }).then((res) => res.json()).then((data) => data.items);
}