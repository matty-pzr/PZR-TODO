import { useState } from 'react'
import './App.css'
import './responsive.css' // Import responsive utilities
import './themes/productivity.css' // Productivity theme only

function App() {
	// State to hold our list of todos
	// Each todo will be an object with id, text, and completed status
	const [todos, setTodos] = useState([])
	
	// State for the input fields
	const [titleValue, setTitleValue] = useState('')
	const [descriptionValue, setDescriptionValue] = useState('')
	const [imagePreview, setImagePreview] = useState(null)
	
	// Productivity theme is always active
	const currentTheme = 'productivity'

	// Function to add a new todo
	const addTodo = () => {
		// Don't add empty todos
		if (titleValue.trim() === '') return
		
		// Create a new todo object with title, description, and media
		const newTodo = {
			id: Date.now(), // Simple ID using timestamp
			title: titleValue,
			description: descriptionValue,
			completed: false,
			media: imagePreview ? [imagePreview] : [] // Include preview image if exists
		}
		
		// Add the new todo to our list
		setTodos([...todos, newTodo])
		
		// Clear all input fields
		setTitleValue('')
		setDescriptionValue('')
		setImagePreview(null)
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
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			addTodo()
		}
	}
	
	// Handle image upload for new todo
	const handleNewTodoImage = (e) => {
		const file = e.target.files[0]
		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader()
			reader.onload = (e) => {
				setImagePreview({ url: e.target.result, type: file.type })
			}
			reader.readAsDataURL(file)
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
				<div className="input-fields">
					<input
						type="text"
						value={titleValue}
						onChange={(e) => setTitleValue(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder="Title"
						className="todo-input title-input"
					/>
					<textarea
						value={descriptionValue}
						onChange={(e) => setDescriptionValue(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder="Description (optional)"
						className="todo-input description-input"
						rows="3"
					/>
					<div className="image-upload-section">
						<label className="image-upload-label">
							<span>Add Image (optional)</span>
							<input
								type="file"
								accept="image/*"
								onChange={handleNewTodoImage}
								style={{ display: 'none' }}
							/>
						</label>
						{imagePreview && (
							<div className="image-preview">
								<img src={imagePreview.url} alt="Preview" />
								<button 
									onClick={() => setImagePreview(null)}
									className="remove-preview"
								>
									×
								</button>
							</div>
						)}
					</div>
				</div>
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
								
								<div className={`todo-content ${todo.completed ? 'completed' : ''}`}>
									<h3 className="todo-title">{todo.title || todo.text}</h3>
									{todo.description && (
										<p className="todo-description">{todo.description}</p>
									)}
								</div>
								
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
									+
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
