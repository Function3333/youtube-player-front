import React, { useEffect, useState } from 'react';
import TrackPlayer, { usePlaybackState, useProgress, State, Event, useTrackPlayerEvents, RepeatMode } from 'react-native-track-player';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useSelector } from 'react-redux';


const MediaPlayer = ({ playList}) => {
    const playbackState = usePlaybackState();
    const { position, duration } = useProgress();

    const [title, setTitle] = useState('');
    const [isSinglePlayMode, setSinglePlayMode] = useState(false);
    const [isShuffleMode, setShuffleMode] = useState(false);

    const currentIdx = useSelector((state => state.trackInfo.currentIdx));

    useEffect(() => {
        const setupPlayer = async () => {
            const formattedPlayList = await Promise.all(playList.map(async track => {
                const flag = await isTrackAlreadyExist(track.id);

                if (!flag) {
                    return {
                        id: track.id,
                        url: track.audioUrl.replace(/"$/, ''),
                        title: track.title,
                        artist: 'Unknown',
                        artwork: track.thumbnailUrl
                    }
                }
                return null
            }));

            const filteredPlayList = formattedPlayList.filter(track => track !== null);
            if (filteredPlayList.length > 0) {
                await TrackPlayer.add(filteredPlayList);
                // playlist = setPlayList(filteredPlayList);
            }
        };

        setupPlayer();
        updateTitle();
    }, [playList]);

    const isTrackAlreadyExist = async (trackId) => {
        let flag = false;
        const track = await TrackPlayer.getTrack(trackId);
        
        if(track) flag = true;

        return flag
    }

    useEffect(() => {
        console.log(`MediaPlayer currentIdx : ${currentIdx}`);
        playTrackById(currentIdx);
    }, [currentIdx]);

    const playTrackById = async (id) => {
        try {
            const selectTrack = await TrackPlayer.getTrack(id);
            const currentTrack = await TrackPlayer.getActiveTrack();

            if(selectTrack.id !== currentTrack.id) {
                console.log("skip!");
                await TrackPlayer.skip(id);
                await TrackPlayer.play();
            }
            
            updateTitle();
        } catch (error) {
            console.log(`[MediaPlayer.js] PlayTrackById Failed`);
            console.log(error);
        }
    }

    const updateTitle = async () => {
        const currentTrack = await TrackPlayer.getTrack(currentIdx);
        setTitle(currentTrack.title);
    }

    const handlePlayPrevious = async () => {
        try {
            await TrackPlayer.skipToPrevious();
            await TrackPlayer.play();
            await updateTitle();
        } catch (error) {
            console.log(error);
        }
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
        try {
            await TrackPlayer.skipToNext();
            await TrackPlayer.play();
            await updateTitle();
        } catch (error) {
            console.log(error);
        }
    };

    const handlePlaySingleTrack = async () => {
        if (isSinglePlayMode) {
            await TrackPlayer.setRepeatMode(RepeatMode.Queue);
            setSinglePlayMode(false);
        } else {
            await TrackPlayer.setRepeatMode(RepeatMode.Track);
            setSinglePlayMode(true);
            setShuffleMode(false);
        }
    }

    const formatTime = (millis) => {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    useTrackPlayerEvents(["playback-track-changed"], async event => {
        if (event.type === "playback-track-changed" && event.nextTrack != null) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            const { title } = track || {};
            setTitle(title);
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
                <TouchableOpacity>
                    {isShuffleMode ?
                        (<Ionicons name="shuffle" size={32} color="white" />)
                        :
                        (<Ionicons name="shuffle" size={32} color="gray" />)
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePlayPrevious}>
                    <Ionicons name="play-skip-back" size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePlayPause}>
                    <Ionicons name={playbackState.state === State.Playing ? "pause" : "play"} size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePlayNext}>
                    <Ionicons name="play-skip-forward" size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePlaySingleTrack}>
                    {isSinglePlayMode ?
                        (<Ionicons name="repeat" size={32} color="white" />)
                        :
                        (<Ionicons name="repeat" size={32} color="gray" />)
                    }
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
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    slider: {
        width: '100%',
        height: 10,
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