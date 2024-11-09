'use client';

import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, SkipForward, SkipBack, Volume2, Twitter, Instagram, Youtube, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar"
import { Button } from "./components/ui/button";
import { CardContent } from "./components/ui/card";
import { ScrollArea } from "./components/ui/scroll-area";
import { Slider } from './components/ui/slider';
import { Progress } from "./components/ui/progress";

// Modify the song data to include formats and sizes
const artist = {
  name: "Boy Teddy",
  image: "logo.png",
  songs: [
    { 
      id: 1, 
      title: "Track 1", 
      url: "/audio/habibi.mp3",
      // Add alternative formats for better browser compatibility
      formats: {
        mp3: "/audio/habibi.mp3",
      }
    },
    { 
      id: 2, 
      title: "Track 2", 
      url: "/audio/banike.mp3",
      // Add alternative formats for better browser compatibility
      formats: {
        mp3: "/audio/banike.mp3",
      }
    },
    { 
      id: 3, 
      title: "Track 3", 
      url: "/audio/khuleka.mp3",
      // Add alternative formats for better browser compatibility
      formats: {
        mp3: "/audio/khuleka.mp3",
      }
    },
    { 
      id: 4, 
      title: "Track 4", 
      url: "/audio/jehovah.mp3",
      // Add alternative formats for better browser compatibility
      formats: {
        mp3: "/audio/jehovah.mp3",
      }
    },
    { 
      id: 5, 
      title: "Track 5", 
      url: "/audio/sibaningi.mp3",
      // Add alternative formats for better browser compatibility
      formats: {
        mp3: "/audio/sibaningi.mp3",
      }
    },
    // ... repeat for other tracks
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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);
  const audioPreloadRefs = useRef({});

  // Preload adjacent tracks
  useEffect(() => {
    const currentIndex = artist.songs.findIndex(song => song.id === currentSong.id);
    const preloadTracks = [
      artist.songs[(currentIndex + 1) % artist.songs.length],
      artist.songs[(currentIndex - 1 + artist.songs.length) % artist.songs.length]
    ];

    // Clear old preloaded tracks
    audioPreloadRefs.current = {};

    // Preload adjacent tracks
    preloadTracks.forEach(track => {
      const audio = new Audio();
      audio.preload = "metadata"; // Only load metadata initially
      audio.src = track.url;
      audioPreloadRefs.current[track.id] = audio;
    });

    // Cleanup function
    return () => {
      Object.values(audioPreloadRefs.current).forEach(audio => {
        audio.src = '';
        audio.load();
      });
    };
  }, [currentSong]);

  const handleSeek = (newValue) => {
    setProgress(newValue[0]);
    playerRef.current.seekTo(newValue[0]);
  };

  // Error handling function
  const handleError = (error) => {
    console.error('Playback Error:', error);
    setError('Unable to play this track. Please try again later.');
    setIsBuffering(false);
    
    // Try to recover by switching formats if available
    if (currentSong.formats) {
      const formats = Object.values(currentSong.formats);
      const currentFormat = currentSong.url;
      const nextFormat = formats[(formats.indexOf(currentFormat) + 1) % formats.length];
      
      if (nextFormat !== currentFormat) {
        setCurrentSong({ ...currentSong, url: nextFormat });
      }
    }
  };

  const handleSongSelect = async (song) => {
    setError(null);
    setIsBuffering(true);
    setLoadingProgress(0);
    
    // Check if song was preloaded
    const preloadedAudio = audioPreloadRefs.current[song.id];
    if (preloadedAudio?.readyState >= 2) {
      setLoadingProgress(100);
    }

    setCurrentSong(song);
    setIsPlaying(true);
  };

  // Modified player event handlers
  const handleBuffer = () => {
    setIsBuffering(true);
  };

  const handleBufferEnd = () => {
    setIsBuffering(false);
    setLoadingProgress(100);
  };

  const handleProgress = (state) => {
    setProgress(state.played);
    // Update loading progress based on loaded fraction
    setLoadingProgress(state.loaded * 100);
  };

  // Add ready handler
  const handleReady = () => {
    setIsBuffering(false);
    setLoadingProgress(100);
  };

  // Rest of the handlers remain the same
  const handlePlayPause = () => {
    if (error) return;
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setError(null);
    const currentIndex = artist.songs.findIndex(song => song.id === currentSong.id);
    const previousIndex = (currentIndex - 1 + artist.songs.length) % artist.songs.length;
    setCurrentSong(artist.songs[previousIndex]);
    setIsBuffering(true);
    setLoadingProgress(0);
  };

  const handleNext = () => {
    setError(null);
    const currentIndex = artist.songs.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % artist.songs.length;
    setCurrentSong(artist.songs[nextIndex]);
    setIsBuffering(true);
    setLoadingProgress(0);
  };

  // Add this component for showing loading progress
  const LoadingIndicator = () => (
    <div className="flex flex-col items-center">
      <Loader2 className="h-4 w-4 animate-spin mb-1 text-primary" />
      <Progress value={loadingProgress} className="w-24 h-1" />
    </div>
  );

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
            volume={1}
            onProgress={handleProgress}
            onDuration={setDuration}
            onBuffer={handleBuffer}
            onBufferEnd={handleBufferEnd}
            onReady={handleReady}
            onError={handleError}
            width="0"
            height="0"
            config={{
              file: {
                forceAudio: true,
                attributes: {
                  preload: 'auto',
                }
              }
            }}
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
                value={[1]}
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