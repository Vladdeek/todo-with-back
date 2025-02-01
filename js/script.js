let darkTheme = false
let divid = 2 // глобальная переменная divid = 1 для последующего создания <div class="task"> с новым уникальным id

// Функция для сохранения задач в localStorage
function saveToLocalStorage() {
	const tasks = []
	document.querySelectorAll('.todo-row .col-lg-4').forEach(taskElement => {
		const name = taskElement.querySelector('.name-task')?.textContent || ''
		const description =
			taskElement.querySelector('.description-task')?.textContent || ''
		const status =
			taskElement.querySelector('.status')?.style.backgroundColor ||
			'var(--status-color1)'
		const id = taskElement.id || `task${divid++}`

		if (name && description) {
			tasks.push({ id, name, description, status })
			taskElement.id = id // Присваиваем ID элементу
		}
	})
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

// Функция для загрузки задач из localStorage
function loadFromLocalStorage() {
	const tasks = JSON.parse(localStorage.getItem('tasks')) || []
	tasks.forEach(task => {
		createNewTask(task.name, task.description, task.status, task.id)
		const taskNumber = parseInt(task.id.replace('task', ''), 10)
		if (!isNaN(taskNumber) && taskNumber >= divid) {
			divid = taskNumber + 1 // Увеличиваем для уникальности
		}
	})
	// Загружаем состояние темы
	const savedTheme = localStorage.getItem('darkTheme') === 'true' // Преобразуем строку в boolean
	if (savedTheme !== true) {
		// Если тема тёмная, применяем её
		darkTheme = true
	} else {
		darkTheme = false
	}
	toggleTheme() // Вызываем toggleTheme для применения тёмной темы
}

function saveTask(event) {
	// Предотвращаем отправку формы
	event.preventDefault()

	// Получаем значения из инпутов
	const inputName = document.querySelector('.input-name-task').value
	const inputDescription = document.querySelector(
		'.input-description-task'
	).value

	// Проверяем, что оба поля заполнены
	if (inputName && inputDescription) {
		// Если оба поля заполнены, создаём задачу
		createNewTask(inputName, inputDescription)
		console.log('Задача создана:', inputName, inputDescription)
	} else {
		console.error('Введите название и описание задачи.')
	}

	// Закрываем модальное окно после создания задачи
	hideCreateModal()

	// Очищаем поля ввода для следующей задачи
	document.querySelector('.input-name-task').value = ''
	document.querySelector('.input-description-task').value = ''
	document.querySelector('.input-name-task')
	document.querySelector('.input-description-task')
}

// Привязываем обработчик события submit к форме
document.querySelector('.create-task').addEventListener('submit', saveTask)

function showCreateModal() {
	const modal = document.querySelector('.createTask-modal')
	modal.style.display = 'flex'
	setTimeout(() => {
		modal.style.opacity = '1' // Затем плавно показываем его
	}, 0)
}

function hideCreateModal() {
	const modal = document.querySelector('.createTask-modal')
	modal.style.opacity = '0'
	setTimeout(() => {
		modal.style.display = 'none' // Убираем из потока после завершения анимации
	}, 200)
}

let taskRowIndex = 0
let colorIndex = 1

// Модифицированная функция для создания задач
function createNewTask(
	name,
	description,
	status = 'var(--status-color1)',
	id = null
) {
	const taskCol = document.createElement('div')
	taskCol.classList.add('col-lg-4', 'col-md-6', 'col-xs-12')
	taskCol.id = id || `task${divid++}`

	const taskContent = document.createElement('div')
	taskContent.classList.add('content')
	taskContent.id = `color${colorIndex}`
	colorIndex = colorIndex < 6 ? colorIndex + 1 : 1

	const delBtn = document.createElement('button')
	delBtn.classList.add('del-btn', 'text-center')
	delBtn.textContent = '+'
	delBtn.onclick = function () {
		delTask(taskCol.id) // Удаление задачи
	}

	const taskText = document.createElement('div')
	taskText.classList.add('text')

	const taskName = document.createElement('p')
	taskName.classList.add('name-task')
	taskName.textContent = name

	const taskDescription = document.createElement('p')
	taskDescription.classList.add('description-task')
	taskDescription.textContent = description

	const taskStatus = document.createElement('div')
	taskStatus.classList.add('status')
	taskStatus.style.backgroundColor = status
	taskStatus.onclick = function () {
		toggleStatusColor(this)
		saveToLocalStorage() // Сохраняем изменения статуса
	}

	taskText.appendChild(taskName)
	taskText.appendChild(taskDescription)
	taskContent.appendChild(delBtn)
	taskContent.appendChild(taskText)
	taskContent.appendChild(taskStatus)
	taskCol.appendChild(taskContent)

	const todoRow = document.querySelector('.todo-row')
	const addTaskButton = document.querySelector('.addTaskButton')
	todoRow.insertBefore(taskCol, addTaskButton)

	saveToLocalStorage() // Сохраняем после создания новой задачи
}

// Модифицированная функция для удаления задачи
function delTask(taskId) {
	const taskElement = document.getElementById(taskId)
	if (taskElement) {
		taskElement.remove()
		saveToLocalStorage() // Сохраняем изменения после удаления
	}
}

// Функция для обновления счетчика символов
function updateCharacterCount(inputElement, counterElement, maxLength) {
	const currentLength = inputElement.value.length
	counterElement.textContent = `${currentLength}/${maxLength}`
}

// Получаем элементы
const nameInput = document.querySelector('.input-name-task')
const descriptionInput = document.querySelector('.input-description-task')
const nameCounter = document.querySelector('.name-maxlengh')
const descriptionCounter = document.querySelector('.description-maxlengh')

// Добавляем обработчики событий
nameInput.addEventListener('input', function () {
	updateCharacterCount(nameInput, nameCounter, 20)
})

descriptionInput.addEventListener('input', function () {
	updateCharacterCount(descriptionInput, descriptionCounter, 60)
})

// Функция для изменения статуса
function toggleStatusColor(statusElement) {
	let currentColor = statusElement.style.backgroundColor

	// Если currentColor пуст, это значит, что цвет еще не был установлен, присваиваем значение по умолчанию.
	if (!currentColor) {
		currentColor = 'var(--status-color1)'
	}

	if (currentColor === 'var(--status-color1)') {
		console.log('статус1')
		statusElement.style.backgroundColor = 'var(--status-color2)'
	} else if (currentColor === 'var(--status-color2)') {
		console.log('статус2')
		statusElement.style.backgroundColor = 'var(--status-color3)'
	} else if (currentColor === 'var(--status-color3)') {
		console.log('статус3')
		statusElement.style.backgroundColor = 'var(--status-color1)'
	}
}

function toggleTheme() {
	const button = document.querySelector('.new')
	const iconImage = document.querySelector('.theme-icon')
	const root = document.documentElement

	// Меняем изображение и цвета
	if (darkTheme === false) {
		console.log('Тема сменилась на ночную')
		iconImage.src = 'img/brightness.png' // Путь к изображению для ночной темы
		iconImage.style.filter = 'invert(1)'
		root.style.setProperty('--color1', '#FF5A9D')
		root.style.setProperty('--color2', '#7B61FF')
		root.style.setProperty('--color3', '#4ABCE3')
		root.style.setProperty('--color4', '#FF8A63')
		root.style.setProperty('--color5', '#56C56F')
		root.style.setProperty('--color6', '#FFDF6E')
		root.style.setProperty('--color-text', 'black')
		root.style.setProperty('--bg-color', '#242124')
		root.style.setProperty('--color', 'white')
		button.style.filter = 'invert(1)'
		darkTheme = true

		console.log(darkTheme)
	} else if (darkTheme === true) {
		console.log('Тема сменилась на дневную')
		iconImage.src = 'img/night-mode.png' // Путь к изображению для дневной темы
		iconImage.style.filter = 'invert(0)'
		root.style.setProperty('--color1', '#ffc1d6')
		root.style.setProperty('--color2', '#c2b9ff')
		root.style.setProperty('--color3', '#a8e3f5')
		root.style.setProperty('--color4', '#ffd4bf')
		root.style.setProperty('--color5', '#b6f0b6')
		root.style.setProperty('--color6', '#fff2b2')
		root.style.setProperty('--color-text', 'white')
		root.style.setProperty('--bg-color', '#f8f8ff')
		root.style.setProperty('--color', 'black')
		button.style.filter = 'invert(0)'
		darkTheme = false
		console.log(darkTheme)
	}

	localStorage.setItem('darkTheme', darkTheme)
}

// Загружаем задачи при загрузке страницы
window.addEventListener('load', () => {
	loadFromLocalStorage()
	console.log(
		'Задачи загружены:',
		document.querySelectorAll('.todo-row .col-lg-4')
	)
})
