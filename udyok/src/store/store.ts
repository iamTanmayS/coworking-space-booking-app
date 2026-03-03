import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { baseApi } from "../api/base.api";
import { chatApi } from "../features/chat/chat.api";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from 'redux-persist';
import { rootReducer } from "./rootReducer";

export const store = configureStore({
   reducer: rootReducer,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
            ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
         },
      }).concat(baseApi.middleware, chatApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


