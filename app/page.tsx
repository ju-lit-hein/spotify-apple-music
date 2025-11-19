"use client";

import { useEffect, useState } from "react";

import handleSpotifySignIn from "./spotify/handleSignIn";
import { useSpotifyCode } from "./spotify/spotifyCodeContext";
import getPlaylist from "./spotify/getPlaylist";
import getPlaylistTracks from "./spotify/getPlaylistTracks";

import handleAppleSignIn from "./apple/handleSignIn";
import { useAppleCode } from "./apple/appleCodeContext";

export default function Home() {
  // spotify
  const { spotifyCode, setSpotifyCode } = useSpotifyCode();
  const [isSpotifyButtonHovered, setIsSpotifyButtonHovered] = useState(false);
  const handleMouseEnterSpotify = () => setIsSpotifyButtonHovered(true);
  const handleMouseLeaveSpotify = () => setIsSpotifyButtonHovered(false);
  const handleSpotifySignOut = () => setSpotifyCode(null);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);
  const [currentPlaylistID, setCurrentPlaylistID] = useState("");
  const [currentPlaylistTracks, setCurrentPlaylistTracks] = useState([]);
  const [currentPlaylistTracksISRCs, setCurrentPlaylistTracksISRCs] = useState<string[]>([]);

  useEffect(() => {
    if (spotifyCode) {
      console.log("Fetching Spotify playlists with code:", spotifyCode);
      getPlaylist(spotifyCode).then((data) => {
        console.log("Fetched Spotify Playlists:", data);
        setSpotifyPlaylists(data || []);
      });
    } else {
      console.log("No Spotify code available, clearing playlists.");
      setSpotifyPlaylists([]);
    }
  }, [spotifyCode]);

  useEffect(() => {
    console.log("Current Playlist ID changed:", currentPlaylistID);
    if (spotifyCode && currentPlaylistID) {
      getPlaylistTracks(spotifyCode, currentPlaylistID).then((data) => {
        console.log(
          `Fetched tracks for playlist ${currentPlaylistID}:`,
          data
        );
        setCurrentPlaylistTracks(data || []);
        setCurrentPlaylistTracksISRCs([]);
        let isrcs: string[] = [];
        for (const item of data) {
          const isrc = item.track.external_ids.isrc;
          if (isrc) {
            isrcs.push(isrc);
          }
        }
        setCurrentPlaylistTracksISRCs(isrcs);
      });
    } else {
      setCurrentPlaylistID("");
      setCurrentPlaylistTracks([]);
      setCurrentPlaylistTracksISRCs([]);
    }
  }, [currentPlaylistID, spotifyCode]);

  // apple
  const { appleCode, setAppleCode } = useAppleCode();
  const [isAppleButtonHovered, setIsAppleButtonHovered] = useState(false);
  const handleMouseEnterApple = () => setIsAppleButtonHovered(true);
  const handleMouseLeaveApple = () => setIsAppleButtonHovered(false);
  const handleAppleSignOut = () => setAppleCode(null);

  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-black">
      <main className="flex min-h-screen w-full flex-col items-center py-10 px-16 bg-white dark:bg-black sm:items-start">
        <div className="grid grid-cols-2 w-full gap-8 justify-center">
          <button
            className={`mb-16 rounded-full px-8 py-3 font-medium w-64 ${
              spotifyCode
                ? "bg-green-500 text-black" + (isSpotifyButtonHovered
                  ? " hover:bg-red-700"
                  : "")
                : "bg-white text-black" + (isSpotifyButtonHovered
                  ? " hover:bg-zinc-200"
                  : "")
            }`}
            onClick={spotifyCode ? handleSpotifySignOut : handleSpotifySignIn}
            onMouseEnter={handleMouseEnterSpotify}
            onMouseLeave={handleMouseLeaveSpotify}
          >
            {
              spotifyCode && isSpotifyButtonHovered ? "Log out" : spotifyCode ? "Signed In with Spotify" : "Sign In with Spotify"
            }
          </button>
          <button
            className={`mb-16 rounded-full px-8 py-3 font-medium w-64 ${
              appleCode
                ? "bg-green-500 text-black" + (isAppleButtonHovered
                  ? " hover:bg-red-700"
                  : "")
                : "bg-white text-black" + (isAppleButtonHovered
                  ? " hover:bg-zinc-200"
                  : "")
            }`}
            onClick={appleCode ? handleAppleSignOut : handleAppleSignIn}
            onMouseEnter={handleMouseEnterApple}
            onMouseLeave={handleMouseLeaveApple}
          >
            {
              appleCode && isAppleButtonHovered ? "Log out" : appleCode ? "Signed In with Apple" : "Sign In with Apple"
            }
          </button>
        </div>
        <div className="grid grid-cols-4">
          <div className="flex overflow-auto max-h-[80vh]">
            <div className="flex flex-col rounded-lg w-96">
              <nav className="flex min-w-60 flex-col gap-1 p-1.5">
                {spotifyPlaylists.map((playlist: any) => (
                  <div
                    key={playlist.id}
                    role="button"
                    className={"text-slate-800 flex w-80 h-18 mx-6 hover:w-86 hover:h-20 hover:mx-3 items-center rounded-md p-3 transition-all" + (currentPlaylistID === playlist.id
                      ? " bg-blue-300"
                      : " bg-slate-800 hover:bg-slate-700")}
                    onClick={() => setCurrentPlaylistID(playlist.id)}
                  >
                    <div className="mr-4 grid place-items-center">
                      <img
                        alt="candice"
                        src={playlist.images[0]?.url}
                        className="relative inline-block h-12 w-12 rounded-md  object-cover object-center"
                      />
                    </div>
                    <div>
                      <h6 className="text-white font-medium">
                        {(playlist.name ?? '').length > 30 ? `${(playlist.name ?? '').slice(0, 29)}...` : playlist.name}
                      </h6>
                      <p className="text-slate-400 text-sm">
                        {playlist.tracks.total} songs
                      </p>
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </div>
          <div className="flex overflow-auto max-h-[80vh]">
            <div className="flex flex-col rounded-lg w-96">
              <nav className="flex min-w-60 flex-col gap-1 p-1.5">
                {currentPlaylistTracks.map((track: any) => (
                  <div
                    key={track.track.id}
                    role="button"
                    className="text-white flex w-80 h-18 mx-6 hover:w-86 hover:h-20 hover:mx-3 items-center rounded-md p-3 transition-all border-slate-200 bg-slate-800 hover:bg-slate-700"
                  >
                    <div className="mr-4 grid place-items-center">
                      <img
                        alt="candice"
                        src={track.track.album.images[0]?.url}
                        className="relative inline-block h-12 w-12 rounded-md  object-cover object-center"
                      />
                    </div>
                    <div>
                      <h6 className="text-white font-medium">
                        {(track.track.name ?? '').length > 30 ? `${(track.track.name ?? '').slice(0, 29)}...` : track.track.name}
                      </h6>
                      <p className="text-slate-400 text-sm">
                        {track.track.artists.map((artist: any) => artist.name).join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </div>
          {currentPlaylistID ? <div className="col-span-2">
            <div className="flex justify-center items-center my-5">
                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-white">
                      New Playlist Name
                  </label>
                  <input
                    className="w-full bg-transparent placeholder:text-slate-200 text-white text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Type here..."
                  />
                  <p className="flex items-start mt-2 text-xs text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1.5">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                    </svg>
                    Let this empty to use the same name as the Spotify playlist.
                  </p>
                </div>
            </div>
            <div className="flex justify-center items-center">
                <button
                  className="mb-16 rounded-full px-8 py-3 font-medium w-64 bg-white text-black"
                >
                  Create Playlist
                </button>
            </div>
            <div className="">
              {/* Status messages go here, with the link to the Apple Music playlist */}
            </div>
          </div> : <></>}
        </div>
      </main>
    </div>
  );
}
