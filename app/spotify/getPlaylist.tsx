import React from "react";
import { SPOTIFY_API_BASE_URL } from "./common";

export default function getPlaylist(spotifyCode: string) {
  return fetch(`${SPOTIFY_API_BASE_URL}/me/playlists`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${spotifyCode}`,
    },
  }).then((res) => res.json()).then((data) => data.items);
}