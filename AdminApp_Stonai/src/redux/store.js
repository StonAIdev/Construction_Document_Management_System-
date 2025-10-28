import { configureStore } from '@reduxjs/toolkit';

import searchBarSlice from './searchBarVal';

export default configureStore({
    reducer: {
        searchbar: searchBarSlice
    }
});
