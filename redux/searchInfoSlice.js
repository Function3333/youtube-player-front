import { createSlice } from "@reduxjs/toolkit";

export const searchInfoSlice = createSlice({
    name : "searchInfo",
    initialState : {
        searchIdx : 0,
        keyword : "",
    },
    reducers : {
        increaseSearchIndex : (state) => {
            state.searchIdx += 1;
        },
        decreaseSearchIndex : (state) => {
            state.searchIdx -= 1;
        },
        resetSearchIndex : (state) => {
            state.searchIdx = 0;
        },
        setKeyword : (state, action) => {
            state.keyword = action.payload;
        }
    }
});

export const { increaseSearchIndex, decreaseSearchIndex, resetSearchIndex, setKeyword } = searchInfoSlice.actions;
export default searchInfoSlice.reducer;