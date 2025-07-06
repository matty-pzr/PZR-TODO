import { useState } from 'react'
import './App.css'
import './responsive.css' // Import responsive utilities
import './themes/productivity.css' // Productivity theme only

function App() {
	// State to hold our list of todos
	// Each todo will be an object with id, text, and completed status
	const [todos, setTodos] = useState([])
	
	// State for the input field where users type new todos
	const [inputValue, setInputValue] = useState('')
	
	// Productivity theme is always active
	const currentTheme = 'productivity'

	// Function to add a new todo
	const addTodo = () => {
		// Don't add empty todos
		if (inputValue.trim() === '') return
		
		// Create a new todo object with media support
		const newTodo = {
			id: Date.now(), // Simple ID using timestamp
			text: inputValue,
			completed: false,
			media: [] // Array to store image/video URLs
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

	// Function to handle media upload
	const handleMediaUpload = (todoId, files) => {
		const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
		
		Array.from(files).forEach(file => {
			if (validTypes.includes(file.type)) {
				const reader = new FileReader()
				reader.onload = (e) => {
					setTodos(todos.map(todo => 
						todo.id === todoId 
							? { ...todo, media: [...todo.media, { url: e.target.result, type: file.type }] }
							: todo
					))
				}
				reader.readAsDataURL(file)
			}
		})
	}

	// Function to remove media
	const removeMedia = (todoId, mediaIndex) => {
		setTodos(todos.map(todo => {
			if (todo.id === todoId) {
				const newMedia = [...todo.media]
				newMedia.splice(mediaIndex, 1)
				return { ...todo, media: newMedia }
			}
			return todo
		}))
	}

	return (
		<div className={currentTheme}>
			<div className="app">
				
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
								{/* Checkbox button */}
								<button 
									className={`checkbox-btn ${todo.completed ? 'checked' : ''}`}
									onClick={() => toggleTodo(todo.id)}
									title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
								>
									{todo.completed ? '✓' : ''}
								</button>
								
								<span 
									className={`todo-text ${todo.completed ? 'completed' : ''}`}
								>
									{todo.text}
								</span>
								
								{/* Media display */}
								{todo.media && todo.media.length > 0 && (
									<div className="todo-media">
										{todo.media.map((media, index) => (
											<div key={index} className="media-item">
												{media.type.startsWith('image/') ? (
													<img src={media.url} alt="Todo attachment" />
												) : (
													<video src={media.url} controls />
												)}
												<button 
													onClick={() => removeMedia(todo.id, index)}
													className="remove-media"
												>
													×
												</button>
											</div>
										))}
									</div>
								)}
								
								{/* Media upload button */}
								<label className="media-upload-btn">
									📎
									<input
										type="file"
										multiple
										accept="image/*,video/*"
										onChange={(e) => handleMediaUpload(todo.id, e.target.files)}
										style={{ display: 'none' }}
									/>
								</label>
								
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
