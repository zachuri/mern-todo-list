import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import Checkbox from '../Checkbox';

// Typescript specify what type it is:w
interface ToDoItemProps {
	todo: {
		id: string;
		content: string;
		isCompleted: boolean;
	};
	onSubmit: () => void;
}

const ToDoItem = ({ todo, onSubmit }: ToDoItemProps) => {
	// todo props is passed into child component
	const [isChecked, setIsChecked] = useState(false);
	const [content, setContent] = useState('');
	const input = useRef(null);

	useEffect(() => {
		if (!todo) {
			return;
		}

		// Any changes to data will be updated from parent Component
		setIsChecked(todo.isCompleted);
		setContent(todo.content);
	}, [todo]);

	useEffect(() => {
		// get focus on input
		if (input.current) {
			input?.current?.focus();
		}
	}, [input]);

	const onKeyPress = ({ nativeEvent }) => {
		//On any keyboard press
		// console.log(nativeEvent);

		if (nativeEvent.key === 'Backspace' && content === '') {
			// Delete item
			console.warn('Delete item');
		}
	};

	return (
		<View style={{ flexDirection: 'row', alignItems: 'center' }}>
			{/* Checkbox */}
			<Checkbox
				isChecked={isChecked}
				onPress={() => {
					setIsChecked(!isChecked);
				}}
			/>

			{/* Tex Input */}
			<TextInput
				ref={input}
				value={content}
				onChangeText={setContent}
				style={styles.userInput}
				multiline //Allow to have input on multiple lines
				onSubmitEditing={onSubmit}
				blurOnSubmit
				onKeyPress={onKeyPress}
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
