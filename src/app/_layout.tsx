import { WSProvider } from '@/service/WSProvider';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

const Layout = () => {
    return (
        <GestureHandlerRootView style={styles.container}>
            <WSProvider>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="role" />
                    <Stack.Screen name="customer/selectlocations" />
                    <Stack.Screen name="customer/riderbooking" />
                    <Stack.Screen name="customer/home" />
                    <Stack.Screen name="customer/auth" />
                    <Stack.Screen name="rider/auth" />
                    <Stack.Screen name="customer/liveride" />
                    <Stack.Screen name="rider/liveride" />

                </Stack>
            </WSProvider>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Layout;
