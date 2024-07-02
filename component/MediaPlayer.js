import React, { useEffect, useState } from 'react';
import TrackPlayer, { usePlaybackState, useProgress, State, useTrackPlayerEvents, RepeatMode } from 'react-native-track-player';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useDispatch, useSelector } from 'react-redux';

import { increaseTrackIdx, decreaseTrackIdx } from '../redux/trackInfoSlice';


const MediaPlayer = ({ playList, deletedIdx }) => {
    const playbackState = usePlaybackState();
    const { position, duration } = useProgress();
    const currentIdx = useSelector((state => state.trackInfo.currentIdx));

    const [title, setTitle] = useState('');
    const [isSinglePlayMode, setSinglePlayMode] = useState(false);
    const [isShuffleMode, setShuffleMode] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        const deleteTrackFromQueue = async () => {
            if (deletedIdx !== null) {
                await TrackPlayer.remove([deletedIdx]);
            }
        }

        deleteTrackFromQueue();
        updateTitle();
    }, [deletedIdx]);

    useEffect(() => {
        setupPlayer();
        updateTitle();
    }, [playList]);


    const setupPlayer = async () => {
        const formattedPlayList = await Promise.all(playList.map(async track => {
            const flag = await isTrackAlreadyExist(track.key);

            if (!flag) {
                return {
                    key: track.key,
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
        }
    };


    const isTrackAlreadyExist = async (key) => {
        let flag = false;
        const track = await TrackPlayer.getTrack(key);
        if (track) flag = true;

        return flag
    }

    useEffect(() => {
        playTrackById(currentIdx);
    }, [currentIdx]);

    const playTrackById = async (id) => {
        try {
            const selectTrack = await TrackPlayer.getTrack(id);
            const currentTrack = await TrackPlayer.getActiveTrack();

            if (selectTrack.id !== currentTrack.id) {
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
            const playListSize = (await TrackPlayer.getQueue()).length;
            dispatch(decreaseTrackIdx(playListSize));

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
            const playListSize = (await TrackPlayer.getQueue()).length;
            dispatch(increaseTrackIdx(playListSize));

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

    useTrackPlayerEvents(["playback-queue-ended"], async () => {
        const queue = await TrackPlayer.getQueue();
        const playListSize = queue.length

        dispatch(increaseTrackIdx(playListSize));
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