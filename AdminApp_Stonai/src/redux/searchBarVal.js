import { createSlice } from '@reduxjs/toolkit';

export const searchBarSlice = createSlice({
    name: 'searchBar',
    initialState: {
        value: ''
    },
    reducers: {
        update: (state, action) => {
            state.value = action.payload;
        },
        clear: (state) => {
            console.log("called clear", state)
            state.value = '';
        }



    }
});

export const { update, clear } = searchBarSlice.actions;



export default searchBarSlice.reducer;
