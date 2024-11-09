'use client';

import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, SkipForward, SkipBack, Volume2, Twitter, Instagram, Youtube, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar"
import { Button } from "./components/ui/button";
import { CardContent } from "./components/ui/card";
import { ScrollArea } from "./components/ui/scroll-area";
import { Slider } from './components/ui/slider';

// Mock data remains the same
const artist = {
  name: "Boy Teddy",
  image: "logo.png",
  songs: [
    { id: 1, title: "Track 1", url: "/audio/habibi.mp3" },
    { id: 2, title: "Track 2", url: "/audio/jehovah.mp3" },
    { id: 3, title: "Track 3", url: "/audio/khuleka.mp3" },
    { id: 4, title: "Track 4", url: "/audio/banike.mp3" },
    { id: 5, title: "Track 5", url: "/audio/sibaningi.mp3" },
  ],
  socialMedia: {
    twitter: "https://twitter.com/lilcode",
    instagram: "https://instagram.com/lilcode",
    youtube: "https://youtube.com/lilcode"
  }
}

export default function RapperArtistApp() {
  const [currentSong, setCurrentSong] = useState(artist.songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const playerRef = useRef(null);



  const handleSongSelect = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setIsBuffering(true); // Set buffering state when new song is selected
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setVolume(1);
  };

  const handlePrevious = () => {
    const currentIndex = artist.songs.findIndex(song => song.id === currentSong.id);
    const previousIndex = (currentIndex - 1 + artist.songs.length) % artist.songs.length;
    setCurrentSong(artist.songs[previousIndex]);
    setIsBuffering(true);
  };

  const handleNext = () => {
    const currentIndex = artist.songs.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % artist.songs.length;
    setCurrentSong(artist.songs[nextIndex]);
    setIsBuffering(true);
  };

  const handleProgress = (state) => {
    setProgress(state.played);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleBuffer = () => {
    setIsBuffering(true);
  };

  const handleBufferEnd = () => {
    setIsBuffering(false);
  };

  const handleSeek = (newValue) => {
    setProgress(newValue[0]);
    playerRef.current.seekTo(newValue[0]);
  };


  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d2426] to-black text-white">
      <div className="max-w-4xl mx-auto p-8 pb-48">
        {/* Header section remains the same */}
        <header className="flex items-center mb-8">
          <Avatar className="h-24 w-24 mr-6">
            <AvatarImage src={artist.image} alt={artist.name} />
            <AvatarFallback>{artist.name[0]}</AvatarFallback>
          </Avatar>
          <h1 className="text-4xl md:text-5xl font-bold font-permanent-marker">{artist.name}</h1>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="bg-[#091516] py-3 text-white border border-1 rounded-xl mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Tracks</h2>
                <ScrollArea className="h-[300px]">
                  <ul className="space-y-2">
                    {artist.songs.map((song) => (
                      <li
                        key={song.id}
                        className={`p-2 rounded cursor-pointer hover:bg-white hover:bg-opacity-20 transition ${
                          currentSong.id === song.id ? 'text-primary bg-white bg-opacity-20' : ''
                        }`}
                        onClick={() => handleSongSelect(song)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{song.title}</span>
                          {currentSong.id === song.id && isBuffering && (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </div>

            {/* Social Media section remains the same */}
            <div className="bg-[#091516] py-3 border rounded-xl border-1 text-white">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Social Media</h2>
                <div className="flex justify-center space-x-4">
                  <a href={artist.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon">
                      <Twitter className="h-4 w-4 text-primary" />
                    </Button>
                  </a>
                  <a href={artist.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon">
                      <Instagram className="h-4 w-4 text-primary" />
                    </Button>
                  </a>
                  <a href={artist.socialMedia.youtube} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon">
                      <Youtube className="h-4 w-4 text-primary" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </div>
          </div>

          {/* About section remains the same */}
          <div className="bg-[#091516] border rounded-xl border-1 py-3 text-white">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">About <span className='text-primary font-permanent-marker'>{artist.name}</span></h2>
              <p className="mb-4">
                {artist.name} is a cutting-edge rapper known for blending tech-savvy lyrics with hard-hitting beats.
                With tracks like "React Rhapsody" and "JavaScript Jam", <span className='text-primary font-permanent-marker'>{artist.name}</span> brings a unique flavor to the hip-hop scene,
                inspiring coders and music lovers alike.
              </p>
              <p>
                Follow <span className='text-primary font-permanent-marker'>{artist.name}</span> on social media for the latest updates, behind-the-scenes content, and exclusive releases.
              </p>
            </CardContent>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#0a1a1b] border-t border-gray-700">
        <div className="max-w-4xl mx-auto p-4">
          <ReactPlayer
            ref={playerRef}
            url={currentSong.url}
            playing={isPlaying}
            volume={volume}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onBuffer={handleBuffer}
            onBufferEnd={handleBufferEnd}
            width="0"
            height="0"
          />
          <div className="flex items-center justify-center mb-2">
            <p className="font-semibold">{currentSong.title}</p>
            {isBuffering && (
              <Loader2 className="h-4 w-4 animate-spin ml-2 text-primary" />
            )}
          </div>
          <div className="mb-2">
            <Slider
              value={[progress]}
              max={1}
              step={0.01}
              onValueChange={handleSeek}
              className="w-full relative bg-white bg-opacity-20
                [&>.relative]:h-2
                [&_[role=slider]]:h-4
                [&_[role=slider]]:w-4
                [&_[role=slider]]:bg-[#FF9E00]
                [&_[role=slider]]:border-2
                [&_[role=slider]]:border-black
                [&_[role=slider]]:focus:ring-2
                [&_[role=slider]]:focus:ring-primary
                [&_[role=slider]]:focus:ring-offset-2"
            />
            <div className="flex justify-between text-sm mt-1">
              <span>{formatTime(progress * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handlePrevious}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handlePlayPause}
                disabled={isBuffering}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 hidden w-4" />
              <Slider
                value={[volume]}
                max={1}
                step={0.01}
                className="w-80 hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}