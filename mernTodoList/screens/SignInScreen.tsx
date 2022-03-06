import {
	View,
	Text,
	TextInput,
	Pressable,
	StyleSheet,
	Alert,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SIGN_IN_MUTATION = gql`
	mutation signIn($email: String!, $password: String!) {
		signIn(input: { email: $email, password: $password }) {
			token
			user {
				id
				name
				email
			}
		}
	}
`;

const SignInScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const navigation = useNavigation();

	const [signIn, { data, error, loading }] = useMutation(SIGN_IN_MUTATION);

	if (error) {
		Alert.alert('Invalid Credentials');
	}

	if (data) {
		// if data is true -> store token & navigate to home screen
		AsyncStorage.setItem('token', data.signUp.token).then(() => {
			navigation.navigate('Home');
		});
	}

	const onSubmit = () => {
		signIn({ variables: { email, password } });
	};

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

			<Pressable onPress={onSubmit} style={styles.signIn} disabled={loading}>
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
