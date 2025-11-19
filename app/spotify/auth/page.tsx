"use client";

import { useEffect } from 'react';
import { redirect, useRouter, useSearchParams } from 'next/navigation'; // or use your routing library equivalent
import { useSpotifyCode } from '../spotifyCodeContext'; // Some client state store
import { SPOTIFY_API_BASE_URL, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI, SPOTIFY_TOKEN_URL } from '../common';

function getSpotifyToken(code: string) : Promise<string> {
  const request = new Request(`${SPOTIFY_TOKEN_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI || "",
      }),
    });
    return fetch(request).then((res) => res.json()).then((data) => {
      if (!data.access_token) {
        console.error('Spotify token error response:', data);
        throw new Error('Failed to get access token');
      }
      console.log('Obtained Spotify access token:', data);
      return data.access_token;
    });
}

export default function spotifyAuth() {
  const searchParams = useSearchParams();
  const { setSpotifyCode } = useSpotifyCode();
  const router = useRouter();
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      getSpotifyToken(code).then((access_token: string) => {
        setSpotifyCode(access_token);
        router.push('/');
      });
    } else {
      // Handle error or missing code
      console.error('No code found in query parameters');
      // Optionally redirect or show an error message
      //
      setSpotifyCode(null);
      router.push('/');
    }
  }, [searchParams, setSpotifyCode, router]);

  return (<div>Processing Spotify Authorization...</div>);
}

/*
export let spotifyCode: string | null = null;
export function setSpotifyCode(code: string | null) {
    spotifyCode = code;
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code) {
        return new Response('Missing query parameter "code"', { status: 400 });
    }

    if (!state) {
        return new Response('Missing query parameter "state"', { status: 400 });
    }

    setSpotifyCode(code);

    return new Response(null, {
        status: 302,
        headers: { Location: '/' },
    });
}
*/