import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import TrackPlayer, { usePlaybackState, useProgress, State, Event, useTrackPlayerEvents } from 'react-native-track-player';


const MediaPlayer = ({ playList, currentIdx }) => {
    const playbackState = usePlaybackState();
    const { position, duration } = useProgress();
    const [title, setTitle] = useState('');

    // Start useEffect Logic
    useEffect(() => {
        const setupPlayer = async () => {
            const formattedPlayList = playList.map(track => ({
                id: track.id,
                url: track.audioUrl.replace(/"$/, ''), 
                title: track.title,
                artist: 'Unknown',
                artwork: track.thumbnailUrl
            }));

            await TrackPlayer.add(formattedPlayList);
        };

        setupPlayer();
        updateTitle();
    }, [playList]);
    
    useEffect(() => {
        if(currentIdx) {
            playTrackById(currentIdx);
        }
    }, [currentIdx]);
    // End useEffect Logic

    const playTrackById = async (id) => {
        try {
            await TrackPlayer.skip(parseInt(id));
            await TrackPlayer.play();
            updateTitle();    
        } catch (error) {
            console.log(`[MediaPlayer.js] PlayTrackById Failed`);
            console.log(error);
        }
    }

    const updateTitle = async () => {
        const activeTrackIdx = parseInt(await TrackPlayer.getActiveTrackIndex());
        
        let track = null;
        if(!isNaN(activeTrackIdx)) {
            track =  await TrackPlayer.getTrack(activeTrackIdx);
        }else {
            track =  await TrackPlayer.getTrack(0);
        }

        setTitle(track.title);
    }

    const handlePlayPrevious = async () => {
        await TrackPlayer.skipToPrevious();
        await TrackPlayer.play();
        await updateTitle();
    };

    const handlePlayPause = async () => {
        if (playbackState.state === State.Playing) {
            await TrackPlayer.pause();
        } else {
            await TrackPlayer.play();
            await updateTitle();
        }
    };

    const handlePlayNext = async () => {
        await TrackPlayer.skipToNext();
        await TrackPlayer.play();
        await updateTitle();
    };

    const formatTime = (millis) => {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    useTrackPlayerEvents(["playback-track-changed"], async event => {
        if (event.type === "playback-track-changed" && event.nextTrack != null) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            const {title} = track || {};
            setTitle(title);
        }
    });

    useTrackPlayerEvents([Event.RemotePause, Event.RemotePlay ], (event) => {
        if (event.type === Event.RemotePause) {
          TrackPlayer.pause();
        } else if (event.type === Event.RemotePlay) {
          TrackPlayer.play();
        }
    });

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
                    <Ionicons name={playbackState.state === State.Playing ? "pause" : "play"} size={32} color="white" />
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