import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./searchSlice";
import searchInfoReducer from "./searchInfoSlice";
import trackInfoReducer from "./trackInfoSlice";

export const store = configureStore({
    reducer: {
        search: searchReducer,
        searchInfo: searchInfoReducer,
        trackInfo : trackInfoReducer
    }
})

export default store;