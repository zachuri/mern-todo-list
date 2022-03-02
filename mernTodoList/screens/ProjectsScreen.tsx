import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import ProjectItem from '../components/ProjectItem';

export default function TabTwoScreen() {
	const [project, setProject] = useState([
		{
			id: '1',
			title: 'Project 1',
			createdAt: '1d',
		},
		{
			id: '2',
			title: 'Project 2',
			createdAt: '2d',
		},
		{
			id: '3',
			title: 'Project 3',
			createdAt: '3d',
		},
	]);

	return (
		<View style={styles.container}>
			<FlatList
				style={styles.flatListStyle}
				data={project}
				renderItem={({ item }) => <ProjectItem project={item} />}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	flatListStyle: {
		// If ever the icons are in the middle
		// Set the width to 100% so it it fill the width
		width: '100%',
	},
});
