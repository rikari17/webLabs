const API_URL = 'https://jsonplaceholder.typicode.com/users';
const REQUEST_TIMEOUT_MS = 10000;

// Получение элементов страницы по айди
const loadBtn = document.getElementById('loadBtn');
const userList = document.getElementById('userList');
const loader = document.getElementById('loader');
const errorDiv = document.getElementById('error');

// Для состояния загрузки
function setLoading(isLoading) {
  loader.classList.toggle('hidden', !isLoading);
  loadBtn.disabled = isLoading;
}

// Ошибка
function showError(msg) {
  errorDiv.textContent = msg;
  errorDiv.classList.remove('hidden');
}

// Создание одной карточки с пользователем
function renderUser(user) {
  const card = document.createElement('article');
  card.className = 'user-card';

  const name = document.createElement('h3');
  name.textContent = user.name;

  const email = document.createElement('p');
  email.textContent = `Email: ${user.email}`;

  const city = document.createElement('p');
  city.textContent = `Город: ${user.address?.city ?? '—'}`;

  card.append(name, email, city);
  return card;
}

// Обработчик клика
loadBtn.addEventListener('click', async () => {
  userList.replaceChildren();  // очистка контейнера
  errorDiv.classList.add('hidden');  // убрать сообщение об ошибке
  setLoading(true);  // отображение состояния загрузки

  // отмена по таймауту
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    // запрос
    const response = await fetch(API_URL, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    // обработка ответа JSON
    const users = await response.json();
    if (!Array.isArray(users)) throw new Error('Некорректный формат данных');

    // собрать карточки с пользователями
    const fragment = document.createDocumentFragment();
    users.forEach(u => fragment.appendChild(renderUser(u)));
    userList.appendChild(fragment);
  } catch (err) {
    // таймаут / другие ошибки
    const msg = err.name === 'AbortError'
      ? 'Превышено время ожидания'
      : err.message;
    showError('Не удалось загрузить данные: ' + msg);
  } finally {
    clearTimeout(timer);
    setLoading(false);
  }
});