import { createSlice } from "@reduxjs/toolkit";

const todoSlice = createSlice({
    name: 'todo',
    initialState: {
        currentId: 4,
        todos: []
    },
    reducers: {
        addTodo: (state,action) =>{
            state.todos.push({
                id: state.currentId++,
                text: action.payload.trim(),
                state: 'todo'
            })
        },
            updateTodo: (state,action) => {
                const item = state.todos.findIndex((item) => item.id === action.payload);
                state.todos[item].state === 'todo'?'done':'todo'; //��료되지 않으거면 ��료��다고 변경, ��료 되어�
                state.todos[item].state = state.todos[item].state === 'todo'?'done':'todo'; //완료되지 않으거면 완료됐다고 변경, 완료 되어있는거면 다시 완료가 안된상태로 변경해주면 됨됨
                state.todos.push(state.todos.splice(item,1)[0]); //원래 들어있던 스테이트를 투두에서 아이템을 없애 준 다음에 지금 다시 추가를 푸쉬를 해주는거다.
            },//이앱에 맞게 push 해준것.
            deleteTodo: (state,action) => {
                const item = state.todos.findIndex((item) => item.id === action.payload);
                if(item > -1){ // 무조건 아이템이 있다는 말 없으면 -1이 나오니까 
                    state.todos.splice(item,1);
                }
        }
    }    
});

export default todoSlice.reducer; // 이거는 다른곳에서 사용가능하게 하는 코드
export const { addTodo, updateTodo, deleteTodo } = todoSlice.actions; // 이거는 다른곳에서 사용가능하게 하는 코드
//1