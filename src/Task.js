import React, { useState, useRef } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Pressable } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import "react-native-gesture-handler";
import SharedTodoModalContent from "./ShareToDoModalContent";
import ToDoModalContent from "./ToDoModalContent";


function CheckMark({ id, completed, toggleToDo}) {


    async function toggle() {
        const response = await fetch(`http://192.168.1.85:8080/update/todo`, {   
            headers: {
                "x-api-key": "abcdef123456",
                "Content-Type": "application/json",
            },     
            method: "PUT",
            body: JSON.stringify({
                value: completed ? false : true,
                idToDo: id
            }),
        });
        const data = await response.json();
        toggleToDo(id);
        console.log(data);
    }


    return (
        <Pressable
            onPress={toggle}
            style={[
                styles.checkMark,
                { backgroundColor: completed === 0 ? "#E9E9EF" : "#0EA5E9" },
            ]}
        ></Pressable>
    )
}





export default function Task({ id_to_do, title, shared_with_id, completed, clearToDo, toggleToDo }) {
    const [isDeleteActive, setIsDeleteActive] = useState(false);
    const bottomSheetModalRef = useRef(null);
    const sharedBottomSheetRef = useRef(null);
    const snapPoints = ["25%", "48%", "75%"]; // para ver que tanto porcentaje aparacera el modal
    const snapPointsShared = ["40%"];


    function handlePresentModal() {
        bottomSheetModalRef.current?.present();
    }

    function handlePresentShared() {
        sharedBottomSheetRef.current?.present();
    }



    async function deleteTodo() {
        const response = await fetch(`http://192.168.1.85:8080/delete/todos`, {
            headers: {
                "x-api-key": "abcdef123456",
            },
            method: "DELETE",
        });
        clearTodo(id);
        console.log(response.status);
    }

    console.log("shared_with_id: ",shared_with_id);


    return (
        <TouchableOpacity
            onLongPress={() => setIsDeleteActive(true)}
            onPress={() => setIsDeleteActive(false)}
            activeOpacity={0.8}
            style={[styles.container]}
        >
            <View style={styles.containerTextCheckBox}>
                <CheckMark id={id_to_do} completed={completed} toggleToDo={toggleToDo} />
                <Text style={styles.text}> {title} </Text>
            </View>


            {shared_with_id !== null ? (
                <Feather
                    onPress={handlePresentShared}
                    name="users"
                    size={20}
                    color="#383839"
                />
            ) : (
                <Feather
                    onPress={handlePresentModal}
                    name="share"
                    size={20}
                    color="#383839"
                />
            )}



            {isDeleteActive && (
                <Pressable onPress={deleteTodo} style={styles.deleteButton}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>x</Text>
                </Pressable>
            )}

              
            {/* shared todos info */}
            <BottomSheetModal
                ref={sharedBottomSheetRef}
                snapPoints={snapPointsShared}
                backgroundStyle={{ borderRadius: 50, borderWidth: 4 }}
            >
                 <SharedTodoModalContent
                    id={id_to_do}
                    title={title}
                    shared_with_id={shared_with_id}
                    completed={completed}
                /> 

            </BottomSheetModal>


            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={2}
                snapPoints={snapPoints}
                backgroundStyle={{ borderRadius: 50, borderWidth: 4 }}
            >
                <ToDoModalContent id={id_to_do} title={title} />
            </BottomSheetModal>


        </TouchableOpacity>
    )
}



const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 14,
        borderRadius: 21,
        marginBottom: 10,
        backgroundColor: "white",
    },
    containerTextCheckBox: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        flexGrow: 1,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
        color: "#383839",
        letterSpacing: -0.011 * 16, // 16 = baseFontSize
        flexShrink: 1,
        marginHorizontal: 8,
    },
    checkMark: {
        width: 20,
        height: 20,
        borderRadius: 7,
    },
    deleteButton: {
        position: "absolute",
        right: 0,
        top: -6,
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ef4444",
        borderRadius: 10,
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 15,
    },
    row: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    title: {
        fontWeight: "900",
        letterSpacing: 0.5,
        fontSize: 16,
    },
    subtitle: {
        color: "#101318",
        fontSize: 14,
        fontWeight: "bold",
    },
    description: {
        color: "#56636F",
        fontSize: 13,
        fontWeight: "normal",
        width: "100%",
    },
});
