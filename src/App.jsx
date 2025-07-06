import { useState } from 'react'
import './App.css'
import './responsive.css' // Import responsive utilities
import './themes/productivity.css' // Productivity theme only
import './themes/layouts.css' // Layout compositions

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
	
	// Show/hide description state
	const [showDescription, setShowDescription] = useState(true)

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
				{/* Description Toggle */}
				<div style={{ 
					position: 'absolute', 
					top: '20px', 
					right: '20px',
					zIndex: 1000
				}}>
					<select 
						value={showDescription ? 'show' : 'hide'} 
						onChange={(e) => setShowDescription(e.target.value === 'show')}
						style={{
							padding: '8px 16px',
							borderRadius: '6px',
							border: '1px solid #ddd',
							fontSize: '14px',
							cursor: 'pointer',
							background: 'white',
							color: '#333'
						}}
					>
						<option value="show">Show Description</option>
						<option value="hide">Hide Description</option>
					</select>
				</div>
				
				<h1>My Todo List</h1>
			
			{/* Input section for adding new todos */}
			<div className="add-todo-wrapper">
				<div className="add-todo-section card-style">
					<div className="input-fields">
						<input
							type="text"
							value={titleValue}
							onChange={(e) => setTitleValue(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Title"
							className="todo-input title-input"
						/>
						{showDescription && (
							<textarea
								value={descriptionValue}
								onChange={(e) => setDescriptionValue(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="Description (optional)"
								className="todo-input description-input"
								rows="3"
							/>
						)}
					</div>
					
					{/* Image upload options */}
					<div className="image-section">
						{/* Option 1: Icon button */}
						<label className="image-icon-btn" title="Add image">
							📸
							<input
								type="file"
								accept="image/*"
								onChange={handleNewTodoImage}
								style={{ display: 'none' }}
							/>
						</label>
						
						{/* Option 2: Drag and drop area */}
						<div className="image-drop-area">
							<label>
								<div className="drop-content">
									{imagePreview ? (
										<div className="image-preview-inline">
											<img src={imagePreview.url} alt="Preview" />
											<button 
												onClick={(e) => {
													e.preventDefault();
													setImagePreview(null);
												}}
												className="remove-preview"
											>
												×
											</button>
										</div>
									) : (
										<>
											<span className="drop-icon">🖼️</span>
											<span className="drop-text">Drop image or click</span>
										</>
									)}
								</div>
								<input
									type="file"
									accept="image/*"
									onChange={handleNewTodoImage}
									style={{ display: 'none' }}
								/>
							</label>
						</div>
					</div>
					
					<button onClick={addTodo} className="add-button">
						Add Todo
					</button>
				</div>
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
