import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
	const navigation = useNavigation();

	useEffect(() => {
		const checkUser = async () => {
			if (await isAuthenticated()) {
				navigation.navigate('Home');
			} else {
				navigation.navigate('SignIn');
			}
		};
		checkUser();
	}, []);

	const isAuthenticated = async () => {
		// use this function whenever you want to log out
		// await AsyncStorage.removeItem('token');

		const token = await AsyncStorage.getItem('token');
		return !!token; // Syntax
	};

	return (
		<View style={{ flex: 1, justifyContent: 'center' }}>
			{/* Loading icon componenet */}
			<ActivityIndicator />
		</View>
	);
};

export default SplashScreen;
