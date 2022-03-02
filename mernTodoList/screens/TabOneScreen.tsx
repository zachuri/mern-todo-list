import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import ToDoItem from '../components/ToDoItem';

export default function TabOneScreen({
	navigation,
}: RootTabScreenProps<'TabOne'>) {
	const [todos, setTodos] = useState([
		{ id: '1', content: 'Buy Milk', isCompleted: true },
		{ id: '2', content: 'Buy cereal', isCompleted: false },
		{ id: '3', content: 'Pour Milk', isCompleted: false },
	]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Tab One two three </Text>

			<FlatList
				data={todos} // Pass in the data

                // passing in a prop called todo with all the data
				renderItem={({ item }) => <ToDoItem todo={item} />}
				style={styles.todos}
			/>
		</View>
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
		fontSize: 20,
		fontWeight: 'bold',
	},
});
