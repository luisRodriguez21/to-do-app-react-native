import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Tarea from './src/Task';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function App() {
	const [todos, setTodos] = useState([]);

	useEffect(() => {
		fetchData();

	}, [])


	async function fetchData() {
		const response = await fetch('http://192.168.1.85:8080/get/todos/by/id/user'); 
		const data = await response.json();
		console.log("data: ", data);		
		setTodos(data);
	}



	function clearTodo(id) {
		setTodos(todos.filter((todo) => todo.id_to_do !== id));
	}

	function toggleToDo(id) {
		console.log("toggleToDo-id: ",id);
		setTodos(
			todos.map((todo) =>
				todo.id_to_do === id ? 
					{ ...todo, completed: todo.completed === 1 ? 0 : 1 }
					:
					todo
			)
		);
	}


	return (
		<BottomSheetModalProvider>
			<View style={styles.container}>

				<SafeAreaView>
					<FlatList 
						data={todos}
						keyExtractor={(todos) => todos.id_to_do} 
						renderItem={({ item }) =>  <Tarea {...item} clearTodo={clearTodo} toggleToDo={toggleToDo} /> }
						ListHeaderComponent={(item) => <Text style={styles.title}>Today</Text> }
						contentContainerStyle={styles.contentContainerStyle}
					/>
				</SafeAreaView>

				<StatusBar style="auto" />
			</View>
		</BottomSheetModalProvider>
		
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#E9E9EF',
	},
	title: {
		fontWeight: "800",
		fontSize: 28,
		marginBottom: 15
	},
	contentContainerStyle: {
		padding: 15
	}
});
