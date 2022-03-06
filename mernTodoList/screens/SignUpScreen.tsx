import {
	View,
	Text,
	TextInput,
	Pressable,
	StyleSheet,
	ActivityIndicator,
	Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// This notation allows us to write GraphQL Queries in tsx file
const SIGN_UP_MUTATION = gql`
	mutation signUp($email: String!, $password: String!, $name: String!) {
		signUp(input: { email: $email, password: $password, name: $name }) {
			token
			user {
				id
				name
				email
			}
		}
	}
`;

const SignUpScreen = () => {
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');

	const navigation = useNavigation();

	// mutation[0] -> a function to tirgger the mutation
	// mutation[1] -> result object
	//      { data, error, loading }
	const [signUp, { data, error, loading }] = useMutation(SIGN_UP_MUTATION);

	// console.log(data);
	// console.log(error);

	useEffect(() => {
		if (error) {
			Alert.alert('Error signing up. Try again');
		}
	}, [error]);

	if (data) {
		// if data is true -> store token & navigate to home screen
		AsyncStorage.setItem('token', data.signUp.token).then(() => {
			navigation.navigate('Home');
		});
	}

	const onSubmit = () => {
		// signUp({ variables: { name: name, email: email, password: password } });
		signUp({ variables: { name: name, email: email, password: password } });
	};

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
				{/* If loading also display loading indicator */}
				{loading && <ActivityIndicator />}
				<Text style={styles.signUpText}>Sign Up</Text>
			</Pressable>

			<Pressable
				disabled={loading} // Disabled if loading
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
		flexDirection: 'row',
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
