import { WSProvider } from '@/service/WSProvider';
import { Stack } from 'expo-router';
import React from "react";

const Layout =() => {
    return (
        <WSProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="role" />
            </Stack>
        </WSProvider>
    );
};


export default Layout;