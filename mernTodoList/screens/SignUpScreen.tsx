import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useMutation, gql } from '@apollo/client';

// This notation allows us to write GraphQL Queries in tsx file
const SIGN_UP_MUTATION = gql`
	mutation signUp($email: String!, $password: String!, $name: String!) {
		signUp(input: { email: $email, password: $password, name: $name }) {
			token
			user {
				id
				name
			}
		}
	}
`;

const SignUpScreen = () => {
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');

	const navigation = useNavigation();

	const onSubmit = () => {};

	return (
		<View style={styles.container}>
			<TextInput
				placeholder="name"
				value={name}
				onChangeText={setName}
				style={styles.name}
			/>
			<TextInput
				placeholder="example@email"
				value={email}
				onChangeText={setEmail}
				style={styles.email}
			/>
			<TextInput
				placeholder="abc1234"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				style={styles.password}
			/>

			<Pressable onPress={onSubmit} style={styles.signUp}>
				<Text style={styles.signUpText}>Sign Up</Text>
			</Pressable>

			<Pressable
				onPress={() => navigation.navigate('SignIn')}
				style={styles.signIn}
			>
				<Text style={styles.signInText}>Already have an account?</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	name: {
		color: 'white',
		fontSize: 18,
		width: '100%',
		marginVertical: 25,
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
	signUp: {
		backgroundColor: '#e33062',
		height: 50,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 30,
	},
	signUpText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	signIn: {
		height: 50,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 30,
	},
	signInText: {
		color: '#e33062',
		fontSize: 18,
		fontWeight: 'bold',
	},
});

export default SignUpScreen;
