import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';

const Todoapp = () => {
  const [freshTodo, setFreshTodo] = useState('');
  type Todo = {
  id: number;
  text: string;
  isChecked: boolean;
};

const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
      const loadData = async () => {
        try{
          const jsonValue = await AsyncStorage.getItem('@todos');
          if (jsonValue != null){
            setTodos(JSON.parse(jsonValue))
          }
        } catch (e) {
          console.log('Failed to load todos', e)
        }
      };
      loadData();
    },[])
 
    useEffect(() => {
      const storeData = async() => {
        try{
          const jsonValue = JSON.stringify(todos);
          await AsyncStorage.setItem('@todos', jsonValue)
        }catch (e) {
          console.log('Fail to load todos', e)
        }
      };
      storeData();
    },[todos])

    

  const addTodo = () => {
    if (freshTodo.trim().length < 1) {
      setFreshTodo('');
      return Alert.alert(
        'Error message',
        'Please enter a todo item',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('cancel pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => console.log('OK pressed'),
          },
        ]
      );
    }else{
      const newTodo = {
        id: Math.random(),
        text: freshTodo.trim(),
        isChecked: false
      };
      setTodos([...todos, newTodo]);
    }
    setFreshTodo('');
  }

  const deleteTodo = (id: number) => {
    Alert.alert('Delete todo', 'Are you sure you want to delete this todo?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          setTodos(todos.filter(todo => todo.id !== id));
        },
      },
    ]); 
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => {
      if(todo.id === id && !todo.isChecked) {
        console.log('is checked')
        return{...todo, isChecked: true}
      }
      return todo;
    }))
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={{ padding: 10 }}>
      <View style={{marginTop: 12,marginBottom: 18,}}>
        <View style = {{flexDirection:"row", justifyContent:"space-between"}}>
          <Text style={{ fontSize: 28,fontWeight: '700',color: '#0B1226',}}>My Todos</Text>
          <TouchableOpacity activeOpacity={0.5} onPress={() => setTodos([])}>
            <Text style = {{fontSize:15, fontWeight:'600', alignSelf:"center"}}>Delete all</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ marginTop: 4,color: '#8B94A6',fontSize: 14,}}>{todos.length} tasks</Text>
      </View>

      <View style={{ flexDirection: 'row',alignItems: 'center',marginBottom: 12}}>
        <TextInput
          placeholder="What do you want to do?"
          placeholderTextColor={'black'}
          style={styles.input}
          value={freshTodo}
          onChangeText={value => setFreshTodo(value)}
        />
        <TouchableOpacity style={styles.addButton} activeOpacity={0.7} onPress={() => addTodo()}>
          <Text style={{color: '#FFFFFF',fontWeight: '600',}}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) =>  item.id.toString()}
        contentContainerStyle={{paddingBottom: 20,}}
        renderItem={({ item }) => (
          <View style={styles.todoCard}>
            <Text style={{ fontSize: 16,color: '#0B1226',}}>{item.text}</Text>
            <View style = {{flexDirection: 'row'}}>
              {item.isChecked ? (
                <TouchableOpacity style={[styles.check, {height:36, width:36, backgroundColor: 'lightgreen'}]} activeOpacity={0.5} onPress={() => toggleTodo(item.id)}>
                  <Text style={{color: '#4B7CFE',fontWeight: '700',fontSize:11}}>Done!</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.check} activeOpacity={0.5} onPress={() => toggleTodo(item.id)}>
                  <Text style={{color: '#4B7CFE',fontWeight: '700',}}>✓</Text>
                </TouchableOpacity>
              )}
            <TouchableOpacity style={styles.delete} activeOpacity={0.5} onPress={() => deleteTodo(item.id)}>
              <Text style={{ color: '#4B7CFE',fontWeight: '700',}}>✕</Text>
            </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={{paddingVertical: 12, alignItems: 'center',}}>
        <Text style={{ color: '#A3A9BF',fontSize: 13,}}>All tasks up to date</Text>
        </View>    
      </View>
    </SafeAreaView>
  );
}

export default Todoapp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FB',
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E6E9F2',
    opacity: 0.5
  },
  addButton: {
    marginLeft: 10,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#4B7CFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEF1FB',
  },
  check: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAF0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
    delete: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAF0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
