import React, { createContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentAudio, setCurrentAudio] = useState(null);

    useEffect(() => {
        const enableAudio = async () => {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: false,
            });
        };
        enableAudio();

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    const loadSound = async (audio) => {
        if (sound) {
            await sound.unloadAsync();
        }
        const { sound: newSound, status } = await Audio.Sound.createAsync(
            { uri: audio.audioUrl },
            {},
            updateScreenForSoundStatus
        );
        setSound(newSound);
        setDuration(status.durationMillis);
        setCurrentAudio(audio);
    };

    const updateScreenForSoundStatus = (status) => {
        if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis);
            setIsPlaying(status.isPlaying);
        } else if (status.error) {
            console.log(`FATAL PLAYER ERROR: ${status.error}`);
        }
    };

    const playSound = async () => {
        if (sound) {
            await sound.playAsync();
            setIsPlaying(true);
        }
    };

    const pauseSound = async () => {
        if (sound) {
            await sound.pauseAsync();
            setIsPlaying(false);
        }
    };

    const value = {
        sound,
        isPlaying,
        position,
        duration,
        currentAudio,
        loadSound,
        playSound,
        pauseSound,
        setPosition,
        setDuration,
        setIsPlaying,
    };

    return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};