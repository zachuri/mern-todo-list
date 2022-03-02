import { Pressable, StyleSheet, View, Text } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CheckBoxProps {
	isChecked: boolean;
	onPress: () => void;
}

const Checkbox = (props: CheckBoxProps) => {
	const { onPress, isChecked } = props;

	const name = isChecked
		? 'checkbox-marked-outline'
		: 'checkbox-blank-outline';

	return (
		<Pressable onPress={onPress} style={styles.checkbox}>
			<MaterialCommunityIcons name={name} size={24} color="white" />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	checkbox: {
		marginLeft: 12,
	},
});

export default Checkbox;
