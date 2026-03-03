import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';

export const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth', 'favorites', 'settings'],
};


