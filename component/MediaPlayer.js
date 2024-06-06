import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import TrackPlayer, { usePlaybackState, useProgress } from 'react-native-track-player';
import SecureStore from '../utils/SecureStore';

const MediaPlayer = ({ audio, currentIdx, setCurrentIdx }) => {
    const playbackState = usePlaybackState();
    const { position, duration } = useProgress();
    const [title, setTitle] = useState('');
    

    useEffect(() => {
        const setupTrack = async () => {    
            const secureStore = new SecureStore();
            
            const secureStoreAudioUrl = await secureStore.getCurrentAudio();
            const currentUrl = (await TrackPlayer.getActiveTrack())?.url;

            console.log(`currentUrl : ${currentUrl}`);
            console.log(`secureStoreAudioUrl : ${JSON.stringify(secureStoreAudioUrl)}`);
            console.log(`audio : ${JSON.stringify(audio)}`);
            // console.log(`currentTack : ${currentTrack}`);

            secureStore.save("currentAudio", audio);
            if(currentUrl !== secureStoreAudioUrl) {
                await TrackPlayer.reset();
                await TrackPlayer.add({
                    id : currentIdx,
                    url: audio.audioUrl,
                    title: audio.title,
                    artist: 'Unknown',
                    artwork: audio.thumbnailUrl
                });
            
                setTitle(audio.title);
                secureStore.saveCurrentAudio(audio);
                await TrackPlayer.play();
            }else {
                const currentTitle = (await TrackPlayer.getActiveTrack()).title;
                console.log(`currentTitle : ${currentTitle}`);
                setTitle(currentTitle);
            }
        };

        setupTrack();
    }, [audio]);

    const handlePlayPrevious = () => {
        if(currentIdx > 0) {
            setCurrentIdx(currentIdx - 1);
        }
    }

    const handlePlayPause = async () => {
        if (playbackState.state === "playing") {
            await TrackPlayer.pause();
        } else {
            await TrackPlayer.play();
        }
    };

    const handlePlayNext = () => {
        if((currentIdx + 1) < audio.playListSize) {
            setCurrentIdx(currentIdx + 1);  
        } 
    }

    const formatTime = (millis) => {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                thumbTintColor="#FFFFFF"
                onSlidingComplete={async (value) => {
                    await TrackPlayer.seekTo(value);
                }}
            />
            <View style={styles.timeContainer}>
                <Text style={styles.time}>{formatTime(position * 1000)}</Text>
                <Text style={styles.time}>{formatTime(duration * 1000)}</Text>
            </View>
            <View style={styles.controls}>
                <TouchableOpacity onPress={handlePlayPrevious}>
                    <Ionicons name="play-skip-back" size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePlayPause}>
                    <Ionicons name={playbackState.state === "playing" ? "pause" : "play"} size={32} color="white" />
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
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 10,
    },
    title: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    slider: {
        width: '100%',
        height: 20,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    time: {
        color: 'white',
        fontSize: 10,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 10,
    },
});

export default MediaPlayer;
