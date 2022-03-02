import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import Checkbox from '../Checkbox';

// Typescript specify what type it is:w
interface ToDoItemProps {
	todo: {
		id: string,
		content: string,
		isCompleted: boolean,
	};
}

const ToDoItem = ({ todo }: ToDoItemProps) => {
	// todo props is passed into child component

	const [isChecked, setIsChecked] = useState(false);
	const [content, setContent] = useState('');

	useEffect(() => {
		if (!todo) {
			return;
		}

		// Any changes to data will be updated from parent Component
		setIsChecked(todo.isCompleted);
		setContent(todo.content);
	}, [todo]);

	return (
		<View style={{ flexDirection: 'row', alignItems: 'center' }}>
			{/* Checkbox */}
			<Checkbox
				isChecked={isChecked}
				onPress={() => {
					setValue(!isChecked);
				}}
			/>

			{/* Tex Input */}
			<TextInput
				value={content}
				onChangeText={setContent}
				style={styles.userInput}
				multiline //Allow to have input on multiple lines
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	userInput: {
		flex: 1,
		fontSize: 16,
		color: 'white',
		backgroundColor: 'black',
		marginLeft: 12,
		marginVertical: 5,
	},
});

export default ToDoItem;
