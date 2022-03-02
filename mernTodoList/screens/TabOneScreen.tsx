import React, { useState } from 'react';
import {
	StyleSheet,
	FlatList,
	TextInput,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import ToDoItem from '../components/ToDoItem';

let id = '4';

export default function TabOneScreen({
	navigation,
}: RootTabScreenProps<'TabOne'>) {
	const [title, setTitle] = useState('');

	const [todos, setTodos] = useState([
		{ id: '1', content: 'Buy Milk', isCompleted: true },
		{ id: '2', content: 'Buy cereal', isCompleted: false },
		{ id: '3', content: 'Pour Milk', isCompleted: false },
	]);

	const createNewItem = (atIndex: number) => {
		// console.warn(`new item at ${atIndex}`);
		const newTodos = [...todos];
		newTodos.splice(atIndex, 0, {
			id: id,
			content: '',
			isCompleted: false,
		});
		setTodos(newTodos);
	};

	return (
		// KeyboardAvoidngView -> prevents the keyboard from blocking the interface
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 130 : 0}
			style={{ flex: 1 }}
		>
			<View style={styles.container}>
				<TextInput
					value={title}
					onChangeText={setTitle}
					placeholder={'Title'}
					style={styles.title}
				/>

				{/* Flatlist componet -> scrolling list of data */}
				<FlatList
					data={todos} // Pass in the data
					// passing in a prop called todo with all the data
					renderItem={({ item, index }) => (
						<ToDoItem
							todo={item}
							onSubmit={() => createNewItem(index + 1)}
						/>
					)}
					style={styles.todos}
				/>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
	},
	todos: {
		width: '100%',
	},
	title: {
		// backgroundColor: 'red',
		width: '100%',
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
		marginLeft: 20,
		marginBottom: 12,
	},
});
