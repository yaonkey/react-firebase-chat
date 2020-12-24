import React from 'react'; // Импортирование библиотеки React
import { render } from '@testing-library/react'; // Импортирование библиотеки с тестами
import App from './App'; // Импортирование главного компонента веб-приложения

test('renders learn react link', () => { // Использование встроенных методов отладки
  const { getByText } = render(<App />); // Отрисовка всех дочерних компонентов родительского компонента App
  const linkElement = getByText('/Atmosphere/'); // Отладка ссылок
  expect(linkElement).toBeInTheDocument(); // Переход по ссылкам
});
