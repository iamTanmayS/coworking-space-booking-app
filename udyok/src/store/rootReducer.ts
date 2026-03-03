import authReducer from "../features/authentication/Auth.slice";
import { baseApi } from "../api/base.api";
import { chatApi } from "../features/chat/chat.api";
import bookingReducer from "../features/booking/Booking.slice";
import chatReducer from "../features/chat/Chat.slice";
import { combineReducers } from "@reduxjs/toolkit";

import { persistConfig } from "./persistConfig";
import persistReducer from "redux-persist/es/persistReducer";
import settingsReducer from "../features/settings/Settings.slice";
import spacesReducer from "../features/spaces/Spaces.slice";
import uiReducer from "../features/ui/UI.slice";
import userReducer from "../features/user/User.slice";
import walletReducer from "../features/wallet/Wallet.slice";
import notificationsReducer from "../features/notifications/notifications.slice";

import favoritesReducer from "../features/favorites/Favorites.slice";

const appReducer = combineReducers({
    [baseApi.reducerPath]: baseApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    auth: authReducer,
    user: userReducer,
    booking: bookingReducer,
    settings: settingsReducer,

    favorites: favoritesReducer,
    spaces: spacesReducer,
    wallet: walletReducer,

    chat: chatReducer,
    ui: uiReducer,
    notifications: notificationsReducer,
});

export const rootReducer = persistReducer(persistConfig, appReducer);