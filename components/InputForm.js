import { KeyboardAvoidingView, StyleSheet, Text, TextInput, Pressable, Platform } from 'react-native';
import React, {useState} from 'react'
import { useDispatch } from 'react-redux';
import { addTodo } from '../redux/slices/todoSlice';

const InputForm = () => {
    const [currentValue, setCurrentValue] = useState(""); // currentValue = 입력값, setCurrentValue = 입력값을 변경하는 함수 
    const dispatch = useDispatch(); // dispatch를 사용하기 위해 useDispatch를 import한다.

    const handleSubmit = () => {
        if(currentValue !== ''){
            dispatch(addTodo(currentValue)); //action.payload에 currentValue를 넣어준다.
            setCurrentValue(''); // 빈값으로로
        }
    }

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.addFormContainer}>
        <TextInput
        style={styles.inputField}
        placeholder="할 일을 작성해주세요" 
        value={currentValue}
        onChangeText={setCurrentValue}
        onSubmitEditing={handleSubmit}
        />
        <Pressable style={styles.addButton} onPress={handleSubmit}>
            <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </KeyboardAvoidingView>
  )
}

export default InputForm

const styles = StyleSheet.create({
    addFormContainer:{
        flexDirection: 'row',
        marginTop: 'auto',
        marginBottom: 30,
        paddingHorizontal: 20,
        backgroundColor: '#f7f8fa'
    },
    inputField: {
        flex: 1,
        height: 40,
        padding: 5,
        borderRadius: 4,
        borderColor: 'rgba(0, 0 , 0, 0.2)',
        borderWidth: 1,
        color:'#000000',
        fontSize: 15,
        textAlign: 'center'
    },
    addButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 42,
        height: 42,
        borderRadius: 4,
        backgroundColor: 'rgba(0,0,0,0.7)',
        shadowColor: '#000000',
        shadowOpacity: 0.14,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4
        }
    },
    addButtonText: {
        color: 'white',
        fontSize: 25}
})