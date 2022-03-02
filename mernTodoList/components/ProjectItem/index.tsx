import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './styles';

interface ProjectItemProps {
	project: {
		id: string;
		title: string;
		createdAt: string;
	};
}

const ProjectItem = ({ project }: ProjectItemProps) => {
	return (
		<View style={styles.root}>
			{/* Project/Task List  */}
			<View style={styles.iconContainer}>
				<MaterialCommunityIcons
					name="file-outline"
					size={24}
					color="grey"
				/>
			</View>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Text style={styles.title}>{project.title}</Text>
				<Text style={styles.time}>{project.createdAt}</Text>
			</View>
		</View>
	);
};

export default ProjectItem;
