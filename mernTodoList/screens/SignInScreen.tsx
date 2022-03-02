import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const navigation = useNavigation();

	const onSubmit = () => {};

	return (
		<View style={styles.container}>
			<TextInput
				placeholder="example@email"
				value={email}
				onChangeText={setEmail}
				style={styles.email}
			></TextInput>
			<TextInput
				placeholder="abc1234"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				style={styles.password}
			></TextInput>

			<Pressable onPress={onSubmit} style={styles.signIn}>
				<Text style={styles.signInText}>Sign In</Text>
			</Pressable>

			<Pressable
				onPress={() => navigation.navigate('SignUp')}
				style={styles.signUp}
			>
				<Text style={styles.signUpText}>New Here? Sign Up</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	email: {
		color: 'white',
		fontSize: 18,
		width: '100%',
		marginVertical: 25,
	},
	password: {
		color: 'white',
		fontSize: 18,
		width: '100%',
		marginVertical: 25,
	},
	signIn: {
		backgroundColor: '#e33062',
		height: 50,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 30,
	},
	signInText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	signUp: {
		height: 50,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 30,
	},
	signUpText: {
		color: '#e33062',
		fontSize: 18,
		fontWeight: 'bold',
	},
});

export default SignInScreen;
