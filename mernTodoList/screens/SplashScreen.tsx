import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
	const navigation = useNavigation();

	useEffect(() => {
		if (isAuthenticated()) {
			navigation.navigate('Home');
		} else {
			navigation.navigate('SignIn');
		}
	}, []);

	const isAuthenticated = () => {
		return false;
	};

	return (
		<View style={{ flex: 1, justifyContent: 'center' }}>
			{/* Loading icon componenet */}
			<ActivityIndicator />
		</View>
	);
};

export default SplashScreen;
