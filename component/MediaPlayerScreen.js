// component/MediaPlayerScreen.js
import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import MediaPlayer from './MediaPlayer';
import { AudioContext } from './AudioProvider';

const MediaPlayerScreen = () => {
    const { currentAudio, loadSound } = useContext(AudioContext);

    const audio = {
        audioUrl: currentAudio ? currentAudio : 'your-default-audio-url',
        title: 'Your Audio Title',
        playListSize: 1,
    };

    return (
        <View style={styles.container}>
            <MediaPlayer audio={audio} currentIdx={0} setCurrentIdx={() => {}} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MediaPlayerScreen;
