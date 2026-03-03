import * as Linking from "expo-linking";

export const linking = {
    prefixes: [
        Linking.createURL("/")
    ],
    config: {
        screens: {
            SpaceDetail: "space/:id",
        },
    },
};