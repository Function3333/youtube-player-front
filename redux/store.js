import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./searchSlice";
import searchInfoReducer from "./searchInfoSlice";

export const store = configureStore({
    reducer : {
        search : searchReducer,
        searchInfo : searchInfoReducer
    }
})

export default store;