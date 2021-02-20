/**Testing**/
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import App from './App'; // Импортирование главного компонента веб-приложения
import renderer from 'react-test-renderer';
import firebase from 'firebase/app'; // импорт api для работы с бд

configure({ adapter: new Adapter() });
const auth = firebase.auth(); // Авторизация
const firestore = firebase.firestore(); // Подгрузка данных
const cases = { // все возможные случаи отрисовки
  app_name: "<div></div>",
  app_header: '<Header></Header>',
  app_signout: '<Button></Button>',
  app_chatroom: '<ChatRoom></ChatRoom>',
  app_signin: '<SignIn></SignIn>',
  app_chatmessage: { // получение всех сообщений
    _component: '<ChatMessage></ChatMessage>',
    id: firestore.collection('messages').id,
    text: firestore.collection('messages').text,
    createdAt: firestore.collection('messages').createdAt,
    receiver: firestore.collection('messages').receiver
  }
};

let container = null; // определение контейнера компонентов
// до отрисовки
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});
// после отрисовки
afterEach(() => {
  ReactDOM.unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('App render', ()=>{
  it('render without crashing', () => {
    // если все компоненты были отрисованы, значит все работает
    render(<App></App>); // рендер главного компонента приложения
    // ниже все возможные подкомпоненты
    const app_name = document.querySelector('.App');
    const app_header = document.querySelector('header');
    const app_signout = document.querySelector('.SignOut');
    const app_chatroom = document.querySelector('.ChatRoom');
    const app_signin = document.querySelector('.SignIn');
    const app_chatmessage = document.querySelector('.ChatMessage');
    // определение всех компонентов
    expect(app_name.textContent).toBe(cases.app_name);
    expect(app_header.textContent).toBe(cases.app_header);
    expect(app_signout.textContent).toBe(cases.app_signout);
    expect(app_chatroom.textContent).toBe(cases.app_chatroom);
    expect(app_signin.textContent).toBe(cases.app_signin);
    expect(app_chatmessage.textContent).toBe(cases.app_chatmessage);
  });
})
describe('Connection test', ()=>{
  it('database connection', () => {
    // если бд вернула результат, значит все работает
    const first_msg = firestore.collection('messages');
    let ans = first_msg.text; // получение текста сообщений
  });
})

