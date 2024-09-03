// src/App.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { nanoid } from 'nanoid';
import { Todo } from './types';

const initialTodos: Todo[] = [];

const AppContainer = styled.div`
  width: 400px;
  margin: 50px auto;
  text-align: center;
`;

const TodoList = styled.div`
  background-color: #f8f8f8;
  padding: 20px;
  min-height: 200px;
  border-radius: 8px;
`;

const TodoItem = styled.div`
  padding: 10px;
  margin-bottom: 8px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InputContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  font-size: 16px;
`;

const AddButton = styled.button`
  padding: 8px 16px;
  margin-left: 8px;
  font-size: 16px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
  background-color: #ff4d4d;
  color: #fff;
  border: none;
  border-radius: 4px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
`;

const ModalButtons = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const App: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>(initialTodos);
    const [inputValue, setInputValue] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
    const [editInputValue, setEditInputValue] = useState('');

    const handleAddTodo = () => {
        if (inputValue.trim() === '') return;

        const newTodo: Todo = {
            id: nanoid(),
            content: inputValue.trim(),
        };

        setTodos((prevTodos) => [...prevTodos, newTodo]);
        setInputValue('');
    };

    const handleDeleteTodo = (id: string) => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const reorderedTodos = Array.from(todos);
        const [movedTodo] = reorderedTodos.splice(result.source.index, 1);
        reorderedTodos.splice(result.destination.index, 0, movedTodo);

        setTodos(reorderedTodos);
    };

    const handleEditTodo = (todo: Todo) => {
        setIsEditing(true);
        setCurrentTodo(todo);
        setEditInputValue(todo.content);
    };

    const handleSaveEdit = () => {
        if (!currentTodo) return;

        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === currentTodo.id ? { ...todo, content: editInputValue } : todo
            )
        );
        setIsEditing(false);
        setCurrentTodo(null);
        setEditInputValue('');
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentTodo(null);
        setEditInputValue('');
    };

    return (
        <AppContainer>
            <h1>My Todo App</h1>
            <InputContainer>
                <Input
                    type="text"
                    placeholder="Yeni görev ekle..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <AddButton onClick={handleAddTodo}>Ekle</AddButton>
            </InputContainer>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="todos">
                    {(provided) => (
                        <TodoList {...provided.droppableProps} ref={provided.innerRef}>
                            {todos.map((todo, index) => (
                                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                                    {(provided) => (
                                        <TodoItem
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <span>{todo.content}</span>
                                            <div>
                                                <DeleteButton onClick={() => handleEditTodo(todo)}>
                                                    Düzenle
                                                </DeleteButton>
                                                <DeleteButton onClick={() => handleDeleteTodo(todo.id)}>
                                                    Sil
                                                </DeleteButton>
                                            </div>
                                        </TodoItem>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </TodoList>
                    )}
                </Droppable>
            </DragDropContext>
            {isEditing && currentTodo && (
                <ModalOverlay>
                    <ModalContent>
                        <h2>Görevi Düzenle</h2>
                        <Input
                            type="text"
                            value={editInputValue}
                            onChange={(e) => setEditInputValue(e.target.value)}
                        />
                        <ModalButtons>
                            <AddButton onClick={handleSaveEdit}>Kaydet</AddButton>
                            <DeleteButton onClick={handleCancelEdit}>İptal</DeleteButton>
                        </ModalButtons>
                    </ModalContent>
                </ModalOverlay>
            )}
        </AppContainer>
    );
};

export default App;
