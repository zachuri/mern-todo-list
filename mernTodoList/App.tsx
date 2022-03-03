import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { ApolloProvider } from '@apollo/client';
import { client } from './apollo';

export default function App() {
	const isLoadingComplete = useCachedResources();
	const colorScheme = useColorScheme();

	if (!isLoadingComplete) {
		return null;
	} else {
		return (
			<SafeAreaProvider>
				{/* Setup Apolo Client  */}
				<ApolloProvider client={client}>
					<Navigation colorScheme={colorScheme} />
					<StatusBar />
				</ApolloProvider>
			</SafeAreaProvider>
		);
	}
}
