import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./searchSlice";
import pageIndexReducer from "./pageIndexSlice";

export const store = configureStore({
    reducer : {
        search : searchReducer,
        pageIndex : pageIndexReducer
    }
})

export default store;