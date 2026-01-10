import { useState, useEffect, useRef } from 'react';
import { fetchNprFeed } from '../features/dashboard/services/nprService';

const useNewsPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(new Audio());

  // --- FETCH LOGIC ---
  const loadData = async (isAutoRefresh = false) => {
    if (isAutoRefresh && isPlaying) return; 

    if (!isAutoRefresh) {
        setLoading(true);
        setError(false);
    }

    try {
      const newPlaylist = await fetchNprFeed();
      
      if (!isAutoRefresh) {
          setPlaylist(newPlaylist);
          setCurrentIndex(0);
          
          if (audioRef.current.src !== newPlaylist[0].audioUrl) {
              audioRef.current.src = newPlaylist[0].audioUrl;
              setProgress(0);
              setCurrentTime(0);
          }
      } else {
          // Silent update check
          if (newPlaylist[0].audioUrl !== playlist[0]?.audioUrl) {
              console.log("New news found, updating playlist...");
              setPlaylist(newPlaylist);
          }
      }
    } catch (err) {
      console.error("News load failed", err);
      if (!isAutoRefresh) setError(true);
    } finally {
      if (!isAutoRefresh) setLoading(false);
    }
  };

  // --- LIFECYCLE ---
  useEffect(() => {
    loadData();

    const interval = setInterval(() => loadData(true), 5 * 60 * 1000);
    const audio = audioRef.current;

    const onTimeUpdate = () => {
        if (audio.duration && !isNaN(audio.duration)) {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration);
            setProgress((audio.currentTime / audio.duration) * 100);
        }
    };

    const onEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
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
  }, []);

  // --- CONTROLS ---
  const loadTrack = (index) => {
    if (index >= 0 && index < playlist.length) {
        setCurrentIndex(index);
        audioRef.current.src = playlist[index].audioUrl;
        audioRef.current.play().catch(e => console.error(e));
        setIsPlaying(true);
    }
  };

  const handlePrev = () => {
      if (currentIndex < playlist.length - 1) loadTrack(currentIndex + 1);
  };

  const handleNext = () => {
      if (currentIndex > 0) loadTrack(currentIndex - 1);
  };

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(e => console.error("Play failed", e));
  };

  const skipTime = (seconds) => {
    if (audioRef.current.duration) audioRef.current.currentTime += seconds;
  };

  const handleSeek = (event, newValue) => {
    if (audioRef.current.duration) {
        const newTime = (newValue / 100) * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
        setProgress(newValue);
    }
  };

  return {
    playlist, currentIndex, loading, error,
    isPlaying, progress, currentTime, duration,
    togglePlay, skipTime, handleSeek, handleNext, handlePrev, loadData
  };
};

export default useNewsPlayer;