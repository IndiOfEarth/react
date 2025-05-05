import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// TodoItem component - just returns a rendered <li> element
function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li>
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none',
                           cursor: 'pointer'
            }}
                  onClick={() => handleToggleComplete(todo.id)}
            >
              {todo.text}
            </span>
            <button onClick={() => onDelete(todo.id)}>❌</button>
    </li>
  );
}

// InputForm component = just returns a rendered <input> element
function InputForm({ input, setInput, onEnter }) {

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onEnter(); // calls the function passed from the app
    }
  }; 

  return (
    <input type="text"
           placeholder="Add a task..."
           value={input}
           onChange={(e) => setInput(e.target.value)}
           onKeyDown = {handleKeyDown} // onKeyDown event is a standard event
    />
  );
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  // When adding to the todo list
  const handleAddTodo = () => {
    // Handles edge case - no input
    if (input.trim() === '') return;

    // each new todo has a id, text, and completed attribute
    const newTodo = { id: Date.now(), text: input, completed: false };
    setTodos([...todos, newTodo]);
    setInput('');    
  };

  // When todo clicked, toggle the todo.complete attribute
  const handleToggleComplete = (id) => {
    // Create an updated todos array using map()
    // Updates the todo.completed attribute for the id given
    const updatedTodos = todos.map(todo =>
      todo.id === id ?  {...todo, completed: !todo.completed } : todo
    );
    // call state hook function to update
    setTodos(updatedTodos);
  };

  // When delete button clicked, return an updated array
  const handleDelete = (id) => {
    const filteredTodos = todos.filter(todo => todo.id !== id);
    setTodos(filteredTodos);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>To Do Idiot</h1>

      <InputForm input={input} setInput={setInput} onEnter={handleAddTodo}/>
      <button onClick={handleAddTodo}>Add</button>

      <ul>
        {todos.map(todo => (
          // Creates the TodoItem li component
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggleComplete}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}