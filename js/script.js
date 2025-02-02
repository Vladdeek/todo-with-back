let darkTheme = false
let divid = 2 // глобальная переменная divid = 1 для последующего создания <div class="task"> с новым уникальным id

// Функция для загрузки задач из localStorage
function loadFromLocalStorage() {
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

function showCreateModal() {
	const modal = document.querySelector('.createTask-modal')
	modal.style.display = 'flex'
    const form = document.querySelector('.reg')
	form.style.display = 'none'
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

let colorIndex = 1;

// Функция для создания задачи
function createNewTask(name, description, status = 'var(--status-color1)', id = null) {
    const taskCol = document.createElement('div');
    taskCol.classList.add('for-take-id', 'col-lg-4', 'col-md-6', 'col-xs-12');
    taskCol.id = id || `${divid++}`;

    const taskContent = document.createElement('div');
    taskContent.classList.add('content');
    taskContent.id = `color${colorIndex}`;
    colorIndex = colorIndex < 6 ? colorIndex + 1 : 1;

    const delBtn = document.createElement('button');
    delBtn.classList.add('del-btn');
    delBtn.innerText = '+';
    delBtn.setAttribute('onclick', 'deleteTodo(event)');

    // Добавляем содержимое задачи
    taskContent.innerHTML = `
        <p class="name-task">${name}</p>
        <p class="description-task">${description}</p>
    `;

    taskContent.appendChild(delBtn);
    taskCol.appendChild(taskContent);

    // Находим контейнер, куда добавляются задачи
    const todoRow = document.querySelector('.todo-row');

    // Находим элемент с классом 'new'
    const newElement = document.querySelector('.new');

    // Проверяем, существует ли контейнер todoRow и элемент .new
    if (todoRow && newElement) {
        // Вставляем новую задачу перед элементом .new
        todoRow.insertBefore(taskCol, newElement.closest('.addTaskButton'));
    } else {
        // Если элемент .new не найден, добавляем задачу в конец
        todoRow.appendChild(taskCol);
    }
}


// Функция для загрузки задач из FastAPI, фильтруя по имени пользователя
async function fetchTodos() {
	try {
		// Получаем имя пользователя из localStorage
		const username = localStorage.getItem("username");

		if (!username) {
			console.error('Ошибка: имя пользователя не найдено в localStorage');
			return;
		}

		// Отправляем запрос на сервер с именем пользователя в качестве параметра
		const response = await fetch(`http://localhost:8000/todo/?username=${username}`);
		const todos = await response.json();

		// Создаем задачи на основе полученных данных
		todos.forEach(todo => {
			createNewTask(todo.title, todo.description, 'var(--status-color1)', `${todo.id}`);
		});
	} catch (error) {
		console.error('Ошибка загрузки задач:', error);
	}
}

async function addTodo(event) {
    event.preventDefault(); // Останавливает стандартное поведение формы (обновление страницы)

    let title = document.getElementById("input-name-task").value;
    let description = document.getElementById("input-description-task").value;

    if (!title || !description) {
        alert("Заполните все поля!");
        return;
    }

    // Получаем имя пользователя из localStorage
    let username = localStorage.getItem("username");  // предполагаем, что username сохранен в localStorage

    if (!username) {
        alert("Ошибка: не найдено имя пользователя!");
        return;
    }

    let todoData = { title, description, user_name: username }; // Добавляем user_name в тело запроса

    try {
        let response = await fetch("http://127.0.0.1:8000/todo/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todoData)
        });

        if (response.ok) {
            let data = await response.json();
            console.log("Задача создана: " + JSON.stringify(data)); // Уведомление после создания задачи

            // Создаем задачу на фронтенде, используя данные из ответа сервера
            createNewTask(data.title, data.description, 'var(--status-color1)', `${data.id}`);
        } else {
            let errorData = await response.json();
            console.log("Ошибка: " + errorData.detail);
        }
    } catch (error) {
        console.error("Ошибка запроса:", error);
        console.log("Ошибка соединения с сервером");
    }

    // Закрываем модальное окно после создания задачи
    hideCreateModal();

    // Очищаем поля ввода для следующей задачи
    document.querySelector('.input-name-task').value = '';
    document.querySelector('.input-description-task').value = '';
}


async function deleteTodo(event) {
    event.preventDefault(); // Останавливает стандартное поведение события
   // Находим родительский элемент с классом "for-take-id"
   let taskElement = event.target.closest('.for-take-id');
    
   // Получаем ID этого родительского элемента
   let taskId = taskElement ? taskElement.id : null;

   if (!taskId) {
	   alert("Не найден ID задачи!");
	   return;
   }

   console.log("ID задачи:", taskId);  // Выведет ID элемента, например "8"

    try {
        // Отправляем запрос DELETE на сервер
        let response = await fetch(`http://127.0.0.1:8000/todo/${taskId}`, {
            method: "DELETE",
            headers: { "accept": "application/json" }
        });

        if (response.ok) {
            let data = await response.json();
            console.log("Задача удалена: " + JSON.stringify(data)); // Уведомление после удаления задачи

            // Удаляем задачу с фронтенда (например, удаляя DOM элемент)
            let taskElement = document.getElementById(`${taskId}`);
            if (taskElement) {
                taskElement.remove();
            }
        } else {
            let errorData = await response.json();
            console.log("Ошибка: " + errorData.detail);
        }
    } catch (error) {
        console.error("Ошибка запроса:", error);
        console.log("Ошибка соединения с сервером");
    }
}



function updateUserName(username) {
    const userLink = document.querySelector('.link');
    userLink.textContent = username;
    userLink.onclick = showExitMenu; // При клике открывается меню выхода
    localStorage.setItem("username", username); // Сохраняем имя в localStorage
}

let reg = document.querySelector('.reg');
let auth = document.querySelector('.auth');

reg.style.display = 'flex';

function toggleForm() {
    if (reg.style.display === 'flex') {
        reg.style.display = 'none';
        auth.style.display = 'flex';
    } else {
        reg.style.display = 'flex';
        auth.style.display = 'none';
    }
}

function showRegAuthModal() {
	const modal = document.querySelector('.createTask-modal')
    const form = document.querySelector('.create-task')
	modal.style.display = 'flex'
    form.style.display = 'none'
	setTimeout(() => {
		modal.style.opacity = '1' // Затем плавно показываем его
	}, 0)
}

function hideRegAuthModal() {
	const modal = document.querySelector('.createTask-modal')
	modal.style.opacity = '0'
	setTimeout(() => {
		modal.style.display = 'none' // Убираем из потока после завершения анимации
	}, 200)
}



async function checkUserExists(name) {
    try {
        let response = await fetch(`http://127.0.0.1:8000/users/${name}`);
        return response.ok; // true, если пользователь найден
    } catch (error) {
        console.error("Ошибка запроса:", error);
        return false;
    }
}

async function addUser() {
    let name = document.getElementById("name").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !password || !confirmPassword) {
        alert("Заполните все поля!")
        return;
    }
    if (password !== confirmPassword) {
        alert("Пароли не совпадают!")
        return;
    }
    if (await checkUserExists(name)) {
        alert("Пользователь уже существует!")
        return;
    }
    alert("Все данные заполнены верно.")
    updateUserName(name);  // Меняем текст на имя пользователя
        
    let userData = { name, password };

    try {
        let response = await fetch("http://127.0.0.1:8000/users/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            let data = await response.json();
            alert("Пользователь добавлен: " + JSON.stringify(data)); // Уведомление после закрытия окна
        } else {
            let errorData = await response.json();
            alert("Ошибка: " + errorData.detail);
        }
    } catch (error) {
        console.error("Ошибка запроса:", error);
        alert("Ошибка соединения с сервером");
    }
}

async function authUser() {
    let authname = document.getElementById("authname").value;
    let authpassword = document.getElementById("authpassword").value;

    if (!authname || !authpassword) {
        alert("Заполните все поля!")
        return;
    }

    try {
        let response = await fetch("http://127.0.0.1:8000/auth/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: authname, password: authpassword })
        });

        let data = await response.json(); 
        console.log("Ответ сервера:", data); // Проверяем, что пришло от сервера

        if (response.ok) {
            alert("Добро пожаловать, " + data.user);
            updateUserName(data.user);  
        } else {
            alert("Ошибка: " + data.detail);
        }
    } catch (error) {
        console.error("Ошибка запроса:", error);
        alert("Ошибка соединения с сервером");
    }
}

function showExitMenu() {
    const confirmLogout = confirm("Вы хотите выйти?");
    if (confirmLogout) {
        logoutUser();
    }
}

function logoutUser() {
    const userLink = document.querySelector('.link');
    userLink.textContent = "вход";
    userLink.onclick = showRegAuthModal; // Возвращаем возможность открытия модального окна
    localStorage.removeItem("username"); // Удаляем данные из localStorage
}



// Загружаем задачи при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    fetchTodos();  // Вызов после объявления функции
	loadFromLocalStorage()
});
 // Проверка при загрузке страницы
window.onload = function() {
    const userLink = document.querySelector('.link');
    const savedName = localStorage.getItem("username");

    if (savedName) {
        userLink.textContent = savedName;
        userLink.onclick = showExitMenu; // Устанавливаем событие выхода, если пользователь авторизован
    } else {
        userLink.textContent = "вход";
        userLink.onclick = showRegAuthModal; // Иначе оставляем событие для открытия модального окна
    }
};