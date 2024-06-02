import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';


const MediaPlayer = ({audio, currentIdx, setCurrentIdx}) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);

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
    
        if (audio.audioUrl) {
            loadSound();
        }
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [audio.audioUrl]);

    useEffect(() => {
        return sound ? () => { sound.unloadAsync(); } : undefined;
    }, [audio.audioUrl]);
    // End useEffect Logic 

    const loadSound = async () => {
        if (sound) {
            await sound.unloadAsync();
        }
        const { sound: newSound, status } = await Audio.Sound.createAsync({ uri: audio.audioUrl }, {}, updateScreenForSoundStatus);
        setSound(newSound);
        setDuration(status.durationMillis);
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

    const handlePlayPrevious = () => {
        if(currentIdx > 0) {
            setCurrentIdx(currentIdx - 1);
        }
    };

    const handlePlayPause = () => {
        isPlaying ? pauseSound() : playSound();
    };

    const handlePlayNext = () => {
        if((currentIdx + 1) < audio.playListSize) {
            setCurrentIdx(currentIdx + 1);  
        } 
    };

    const formatTime = (millis) => {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{audio.title}</Text>
            {/* <Text style={styles.artist}>{audio.title}</Text> */}
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                thumbTintColor="#FFFFFF"
                onSlidingComplete={async (value) => {
                    if (sound) {
                        await sound.setPositionAsync(value);
                    }
                }}
            />
            <View style={styles.timeContainer}>
                <Text style={styles.time}>{formatTime(position)}</Text>
                <Text style={styles.time}>{formatTime(duration)}</Text>
            </View>
            <View style={styles.controls}>
                <TouchableOpacity onPress={handlePlayPrevious}>
                    <Ionicons name="play-skip-back" size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePlayPause}>
                    <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePlayNext}>
                    <Ionicons name="play-skip-forward" size={32} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 10,
        right: 10,
        padding: 10, // 줄여서 컴포넌트 크기를 줄임
        backgroundColor: '#333',
        borderRadius: 10,
    },
    title: {
        color: 'white',
        fontSize: 13, // 글씨 크기 줄임
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    artist: {
        color: 'white',
        fontSize: 12, // 글씨 크기 줄임
        textAlign: 'center',
        marginBottom: 10,
    },
    slider: {
        width: '100%',
        height: 20, // 슬라이더 높이 줄임
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    time: {
        color: 'white',
        fontSize: 10, // 글씨 크기 줄임
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 10, // 마진 줄임
    },
});


export default MediaPlayer;
