import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Platform } from 'react-native';
import InputForm from '../components/InputForm' // 대소문자 정확히 일치
import TodoItem from '../components/TodoItem';
import { useSelector } from 'react-redux';


const MainScreen = () => {
  const todos = useSelector(state => state.todo.todos)
  const todoTasks = todos.filter((item) => item.state === 'todo') // todo 상태인 것만 필터링
  const completedTasks = todos.filter((item) => item.state === 'done') // done 상태인 것만 필터링
  return (
    <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={'default'} />
      <Text style={styles.pageTitle}>ToDo App</Text>
      <View style={styles.listView}>
        <Text style={styles.listTitle}>할일</Text>
        {todoTasks.length !== 0? (
          <FlatList
          data={todoTasks}
          renderItem={({item}) => <TodoItem {...item} />}
          keyExtractor={(item) => item.id}
          />
        ):
          (<Text style={styles.emptyListText}>할 일이 없습니다.</Text>)//todo list가 비어있을 때
        }
      </View>
      <View style={styles.separator} />
      <View style={styles.listView}>
        <Text style={styles.listTitle}>완료된 일</Text>
        {completedTasks.length !== 0? ( //0이 아닐때, 즉, 완료된 일이 있을 때
          <FlatList
          data={completedTasks}
          renderItem={({item}) => <TodoItem {...item} />}
          keyExtractor={(item) => item.id}
          />
        ):
          (<Text style={styles.emptyListText}>완료된 일이 없습니다.</Text>)//완료된 일이 없을 때
        }
      </View> 

<InputForm/>
    </SafeAreaView>
  )
}

export default MainScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    backgroundColor: '#f7f8fa'
  },
  pageTitle: {
    marginBottom: 35,
    paddingHorizontal: 15,
    fontSize: 54,
    fontWeight: '600'
  },
  separator:{
    marginHorizontal: 10,
    marginTop : 25,
    marginBottom : 10,
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  listView: {
    flex: 1,
  },
  listTitle: {
    marginBottom: 25, 
    paddingHorizontal: 15,
    fontSize: 41,
    fontWeight: '500'
  },
  emptyListText: {
    paddingTop : 10,
    paddingHorizontal: 15,
    paddingBottom  :15,
    fontSize: 15,
    lineHeight: 20,
    color : '#737373'
  }
})