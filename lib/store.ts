// lib/store.ts
import {configureStore} from '@reduxjs/toolkit';
import {apiSlice} from './services/api';
import {setupListeners} from '@reduxjs/toolkit/query';

export const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;