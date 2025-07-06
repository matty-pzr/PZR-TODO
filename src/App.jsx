import { useState } from 'react'
import './App.css'
import './responsive.css' // Import responsive utilities
// Import all theme CSS files
import './themes/minimalist.css'
import './themes/playful.css'
import './themes/dark.css'
import './themes/productivity.css'
import './themes/productivity-blue.css'
import './themes/productivity-kanban.css'
import './themes/productivity-analytics.css'
import './themes/productivity-minimal.css'
import './themes/productivity-team.css'

function App() {
	// State to hold our list of todos
	// Each todo will be an object with id, text, and completed status
	const [todos, setTodos] = useState([])
	
	// State for the input field where users type new todos
	const [inputValue, setInputValue] = useState('')
	
	// State for the current theme
	const [currentTheme, setCurrentTheme] = useState('default')
	
	// State for dark mode
	const [isDarkMode, setIsDarkMode] = useState(false)

	// Function to add a new todo
	const addTodo = () => {
		// Don't add empty todos
		if (inputValue.trim() === '') return
		
		// Create a new todo object
		const newTodo = {
			id: Date.now(), // Simple ID using timestamp
			text: inputValue,
			completed: false
		}
		
		// Add the new todo to our list
		// We use the spread operator to create a new array with all existing todos plus the new one
		setTodos([...todos, newTodo])
		
		// Clear the input field
		setInputValue('')
	}

	// Function to toggle a todo between completed/not completed
	const toggleTodo = (id) => {
		// Map through todos and toggle the completed status of the matching todo
		setTodos(todos.map(todo => 
			todo.id === id 
				? { ...todo, completed: !todo.completed }
				: todo
		))
	}

	// Function to delete a todo
	const deleteTodo = (id) => {
		// Filter out the todo with the matching id
		setTodos(todos.filter(todo => todo.id !== id))
	}

	// Handle Enter key press in input field
	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			addTodo()
		}
	}

	return (
		<div className={`${currentTheme} ${isDarkMode ? 'dark-mode' : ''}`}>
			<div className="app">
				{/* Theme and Dark Mode Controls */}
				<div style={{ 
					position: 'absolute', 
					top: '20px', 
					right: '20px',
					zIndex: 1000,
					display: 'flex',
					gap: '10px',
					alignItems: 'center'
				}}>
					{/* Dark Mode Toggle */}
					<button
						onClick={() => setIsDarkMode(!isDarkMode)}
						style={{
							padding: '8px 16px',
							borderRadius: '6px',
							border: '1px solid #ddd',
							fontSize: '14px',
							cursor: 'pointer',
							background: isDarkMode ? '#333' : 'white',
							color: isDarkMode ? 'white' : '#333',
							transition: 'all 0.3s ease'
						}}
					>
						{isDarkMode ? '☀️ Light' : '🌙 Dark'}
					</button>
					
					{/* Theme Selector */}
					<select 
						value={currentTheme} 
						onChange={(e) => setCurrentTheme(e.target.value)}
						style={{
							padding: '8px 16px',
							borderRadius: '6px',
							border: '1px solid #ddd',
							fontSize: '14px',
							cursor: 'pointer',
							background: isDarkMode ? '#333' : 'white',
							color: isDarkMode ? 'white' : '#333'
						}}
					>
						<option value="default">Default Theme</option>
						<option value="minimalist">Minimalist</option>
						<option value="playful">Playful</option>
						<option value="productivity">Productivity</option>
						<option value="productivity-blue">Productivity Blue</option>
						<option value="productivity-kanban">Productivity Kanban</option>
						<option value="productivity-analytics">Productivity Analytics</option>
						<option value="productivity-minimal">Productivity Minimal</option>
						<option value="productivity-team">Productivity Team</option>
					</select>
				</div>
				
				<h1>My Todo List</h1>
			
			{/* Input section for adding new todos */}
			<div className="add-todo-section">
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder="What do you need to do?"
					className="todo-input"
				/>
				<button onClick={addTodo} className="add-button">
					Add Todo
				</button>
			</div>

			{/* List of todos */}
			<div className="todos-list">
				{todos.length === 0 ? (
					<p className="empty-message">No todos yet! Add one above.</p>
				) : (
					<ul>
						{todos.map(todo => (
							<li key={todo.id} className="todo-item">
								<span 
									className={`todo-text ${todo.completed ? 'completed' : ''}`}
									onClick={() => toggleTodo(todo.id)}
								>
									{todo.text}
								</span>
								<button 
									onClick={() => deleteTodo(todo.id)}
									className="delete-button"
								>
									Delete
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
			</div>
		</div>
	)
}

export default App
