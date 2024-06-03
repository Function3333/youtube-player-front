import React, { createContext, useState, useEffect, useContext} from "react";
import { Audio } from "expo-av";

const AudioContext = createContext();

export const AudioProvider = ({children}) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [title, setTitle] = useState("");

    // Start useEffect Logic
    useEffect(() => {
        const enableAudio = async () => {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: false,
            });
        };
        enableAudio();
    }, []);
    // End useEffect Logic

    const loadSound = async (audioUrl, autoPlay = false) => {
        if(sound) {
            await sound.unloadAsync();
            setSound(null);
        }

        const { sound: newSound, status } = await Audio.Sound.createAsync({uri : audioUrl}, {}, updateScreenForSoundStatus);
        setSound(newSound);
        setDuration(status.durationMillis);

        if(autoPlay) {
            await newSound.playAsync();
            setIsPlaying(true);
        }
    }

    const updateScreenForSoundStatus = (status) => {
        if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis);
            setIsPlaying(status.isPlaying);
        } else if (status.error) {
            console.log(`[AudioProvider] updateScreenForSoundStatus Error : ${status.error}`);
        }
    }

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

    const unloadSound = async () => {
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
        }
    };

    return (
        <AudioContext.Provider 
        value={{
            sound, isPlaying, 
            position, duration, 
            title, setTitle,
            loadSound, playSound, 
            pauseSound, unloadSound 
        }}>
            {children}
        </AudioContext.Provider>
    )
}

export const useAudioProvider = () => useContext(AudioContext);
