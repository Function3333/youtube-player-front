import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
    name: "search",
    initialState: [],
    reducers: {
        addSearch: (state, newSearch) => {
            state.push(newSearch);
        },

        setNewSearch: (state, action) => {
            return action.payload
        }
    }
});

export const { addSearch, setNewSearch } = searchSlice.actions;
export default searchSlice.reducer;