import { createSlice } from "@reduxjs/toolkit";

export const trackInfoSlice = createSlice({
    name : "trackInfo",
    initialState : {
        currentIdx : 0
    },
    reducers : {
        increaseTrackIdx : (state, action) => {
            if((state.currentIdx + 1) < action.payload) state.currentIdx += 1;
        },
        decreaseTrackIdx : (state, action) => {
            if((state.currentIdx - 1) >= 0) state.currentIdx -= 1;
        },
        setTrackIdx : (state, action) => {
            state.currentIdx = action.payload;
        }
    }
})

export const { increaseTrackIdx, decreaseTrackIdx, setTrackIdx} = trackInfoSlice.actions;
export default trackInfoSlice.reducer;