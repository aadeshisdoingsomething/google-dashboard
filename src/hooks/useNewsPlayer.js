import { useState, useEffect, useRef } from 'react';
import { fetchNprFeed } from '../features/dashboard/services/nprService';
import { STATIONS } from '../features/dashboard/services/stations';

const useNewsPlayer = () => {
  const [currentStation, setCurrentStation] = useState(STATIONS[0]);
  
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(new Audio());

  // --- MAIN LOAD LOGIC ---
  const loadStation = async (station = currentStation, isAutoRefresh = false) => {
    if (!isAutoRefresh) {
        setLoading(true);
        setError(false);
        audioRef.current.pause();
        setIsPlaying(false);
    }

    try {
      if (station.type === 'rss') {
        const newPlaylist = await fetchNprFeed(station.url);
        
        if (!isAutoRefresh) {
            setPlaylist(newPlaylist);
            setCurrentIndex(0);
            audioRef.current.src = newPlaylist[0].audioUrl;
            setProgress(0);
            setCurrentTime(0);
        } else {
            if (newPlaylist[0].audioUrl !== playlist[0]?.audioUrl) {
                setPlaylist(newPlaylist);
            }
        }
      } else {
        // Live Logic
        setPlaylist([]); 
        audioRef.current.src = station.url;
        setProgress(0);
        setCurrentTime(0);
        setDuration(0);
      }
    } catch (err) {
      console.error("Load failed", err);
      if (!isAutoRefresh) setError(true);
    } finally {
      if (!isAutoRefresh) setLoading(false);
    }
  };

  // --- SWITCH STATION ---
  const changeStation = (stationId) => {
    const newStation = STATIONS.find(s => s.id === stationId);
    if (newStation) {
        setCurrentStation(newStation);
        loadStation(newStation, false);
    }
  };

  // --- LIFECYCLE ---
  useEffect(() => {
    loadStation(currentStation, false);

    const interval = setInterval(() => {
        if (currentStation.type === 'rss') {
            loadStation(currentStation, true);
        }
    }, 5 * 60 * 1000);

    const audio = audioRef.current;

    const onTimeUpdate = () => {
        if (currentStation.type === 'rss' && audio.duration && !isNaN(audio.duration)) {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration);
            setProgress((audio.currentTime / audio.duration) * 100);
        }
    };

    const onEnded = () => {
        if (currentStation.type === 'rss') {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
        }
    };
    
    const onPause = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('play', onPlay);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('play', onPlay);
      clearInterval(interval);
    };
  }, [currentStation]);

  // --- CONTROLS ---
  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(e => console.error("Play failed", e));
  };

  const handleSeek = (event, newValue) => {
    if (currentStation.type === 'rss' && audioRef.current.duration) {
        const newTime = (newValue / 100) * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
        setProgress(newValue);
    }
  };

  // --- UNIVERSAL NAVIGATION ---
  const handlePrev = () => {
      if (currentStation.type === 'rss') {
          // RSS: Go to older news item
          if (currentIndex < playlist.length - 1) {
              const newIndex = currentIndex + 1;
              setCurrentIndex(newIndex);
              audioRef.current.src = playlist[newIndex].audioUrl;
              audioRef.current.play();
          }
      } else {
          // Live: Go to previous station in list
          const index = STATIONS.findIndex(s => s.id === currentStation.id);
          const prevIndex = (index - 1 + STATIONS.length) % STATIONS.length;
          changeStation(STATIONS[prevIndex].id);
      }
  };

  const handleNext = () => {
      if (currentStation.type === 'rss') {
          // RSS: Go to newer news item
          if (currentIndex > 0) {
              const newIndex = currentIndex - 1;
              setCurrentIndex(newIndex);
              audioRef.current.src = playlist[newIndex].audioUrl;
              audioRef.current.play();
          }
      } else {
          // Live: Go to next station in list
          const index = STATIONS.findIndex(s => s.id === currentStation.id);
          const nextIndex = (index + 1) % STATIONS.length;
          changeStation(STATIONS[nextIndex].id);
      }
  };

  return {
    currentStation, changeStation,
    playlist, currentIndex, loading, error,
    isPlaying, progress, currentTime, duration,
    togglePlay, handleSeek, handleNext, handlePrev
  };
};

export default useNewsPlayer;