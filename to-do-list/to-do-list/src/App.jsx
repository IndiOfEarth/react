import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// TodoItem component - just returns a rendered <li> element
function TodoItem({ todo, onToggle, onDelete, onEdit, onSaveEdit }) {

  const [editText, setEditText] = useState(todo.text); // sets the state of text to be edited to current todo text

  return (
    <li>
      {/* check if in editing mode */}
      {todo.editing ? (
        <>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') onSaveEdit(todo.id, editText);
            }}
          />
          <button onClick={() => onSaveEdit(todo.id, editText)}>Save</button>
        </>
      ) : (
        <>
        <span 
          style={{ textDecoration: todo.completed ? 'line-through' : 'none',
                   cursor: 'pointer',
            
          }}
          onClick={() => onToggle(todo.id)}
        >
          {todo.text}
        </span>
        {todo.dueDate && (
          <span style={{ marginLeft: '1rem', color: 'gray', fontSize: '0.9rem' }}>
            (Due: {new Date(todo.dueDate).toLocaleString()})
          </span>
        )}
        <button onClick={() => onEdit(todo.id)}>✏️</button>
        <button onClick={() => onDelete(todo.id)}>❌</button>
        </>
      )}
    </li>
  );
}

// InputForm component = just returns a rendered <input> element
function InputForm({ input, setInput, dueDate, setDueDate, onEnter }) {

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onEnter(); // calls the function passed from the app
    }
  }; 

  return (
    <>
      <input type="text"
            placeholder="Add a task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown = {handleKeyDown} // onKeyDown event is a standard event
      />
      <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
      />
    </>
  );
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [didLoad, setDidLoad] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');

  // useEffect hook
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos'); // get from local storage
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos)); // convert back to array and update state
    }
    setDidLoad(true); // waits for it to load
  }, []);
  // listens for changes to the todos state
  useEffect(() => {
    if (didLoad) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, didLoad]);

  // When adding to the todo list
  const handleAddTodo = () => {
    // Handles edge case - no input
    if (input.trim() === '') return;

    // each new todo object has an id, text, and completed attribute
    const newTodo = { id: Date.now(), 
                      text: input, 
                      completed: false, 
                      dueDate: dueDate || null };
    setTodos([...todos, newTodo]);
    setInput('');
    setDueDate('');    
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

  const handleEdit = (id) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? {...todo, editing: true } : todo
    );
    setTodos(updatedTodos);
  };

  const handleSaveEdit = (id, newText) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? {...todo, text: newText, editing: false} : todo
    );
    setTodos(updatedTodos);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'incomplete') return !todo.completed;
    return true; // all
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1>To Do Idiot</h1>

      <div style={{ margin: '1rem 0' }}>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('incomplete')}>Incomplete</button>
      </div>

      <InputForm 
        input={input} 
        setInput={setInput} 
        dueDate={dueDate}
        setDueDate={setDueDate}
        onEnter={handleAddTodo}
      />
      <button onClick={handleAddTodo}>Add</button>

      <ul>
        {filteredTodos.map(todo => (
          // Creates the TodoItem li component
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggleComplete}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onSaveEdit={handleSaveEdit}
          />
        ))}
      </ul>
    </div>
  );
}