import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDk3NKRbiK6slY4FFA3celVKRZsHBCBv_Y",
  authDomain: "atmosphere-messenger.firebaseapp.com",
  databaseURL: "https://atmosphere-messenger.firebaseio.com",
  projectId: "atmosphere-messenger",
  storageBucket: "atmosphere-messenger.appspot.com",
  messagingSenderId: "366185541328",
  appId: "1:366185541328:web:8eeb43e5dc6977f8df38d5",
  measurementId: "G-N5KVS2YG0M"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
// const analytics = firebase.analytics();

var isRulesShow = false;

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header> {/*Создание компонента header*/}
        <h1><a href='https://github.com/yaonkey/react-firebase-chat' target='_blank'>Atmosphere</a></h1>
        <SignOut /> {/* Кнопка выхода из аккаунта */}
      </header>

      <section>
      {/* Отображение кнопки входа, если не пройден процесс аутентификации */}
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    // Получение данных об аутентификации
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <>
    {/* Создание кнопки входа */}
      <button className="sign-in" onClick={signInWithGoogle}>Вход с Google</button>
      <h2 className='sign-in-text'>
        Будьте аккуратны, иначе будете забанены навсегда!
      </h2>
    </>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>🚪</button>
  )
}

// delete it
function getNum(str) {
  let nums = str.match(/(\d+)/g);
  if (nums != null){
    return true;
  }else{
    return false;
  }
}
// delete it

function ChatRoom() {
  const dummy = useRef(); // Получение данных об окружении
  const messagesRef = firestore.collection('messages'); // Получение данных о сообщениях
  const query = messagesRef.orderBy('createdAt').limit(25); // Создание лимита отображаемых сообщений в размере 25
  const [messages] = useCollectionData(query, { idField: 'id' }); // Получение сообщений из базы данных
  const [formValue, setFormValue] = useState(''); // Получение вводимого сообщения
  const sendMessage = async (e) => { // Реализация отправки сообщения
    e.preventDefault(); // Отмена стандартных действий
    const { uid, photoURL } = auth.currentUser; // Получение текущего пользователя

    await messagesRef.add({ // Создание асинхронной функции для ввода текста
      text: `${formValue}`,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Получение времени отправки сообщения
      uid, // Идентификатор пользователя
      photoURL // Фотография пользователя
    })

    setFormValue(''); // Очистка формы
    dummy.current.scrollIntoView({ behavior: 'smooth' }); // Добавление визуального эффекта при прокрутке сообщений
  }
  return (<>
    {/* Возвращение отрисованной страницы с списком всех сообщений, а также с отображением
    компонента для ввода сообщения пользователем (форма ввода и кнопка отправки) */}
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <span ref={dummy}></span>
    </main>
    <form onSubmit={sendMessage}>
      <input autoFocus value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Введите сообщение..." />
      <button type="submit" disabled={!formValue}>🚀</button>
    </form>
  </>)
}

function ChatMessage(props) {
  const { text, uid, photoURL, createdAt } = props.message; // Получение данных о сообщении
  // Получение данных об отправителе
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  // Возвращаем сообщение, а также фотографию пользователя из google
  return (<>
    <div className={`message ${messageClass}`}>
      {/* <p>{createdAt}</p> */}
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}

function RulesShow(){
  return ( <>
    <main>
      <div>
        <h3>
          Подробнее о правилах блокировки
        </h3>
        <p>
          Блокировка пользователей может происходить лишь при нарушении некоторого свода правил, к которым относятся:
        </p>
        <ul>
          <li>1. В чате запрещено спамить</li>
          <li>2. В чате запрещена реклама каких-либо товаров или услуг, запрещенных законодательством</li>
          <li>3. В чате запрещены действия, разжигающие межрасовые или межнациональные конфликты</li>
          <li>4. В чате запрщены ссылки на откровенный контент</li>
        </ul>
        <p>
          При соблюдении данных правил, риск быть заблокированным в системе сводится к нулю. Будьте аккуратны и берегите себя!
        </p>
      </div>
      <div>
        <p>
          Информацию о технической стороне мессенджера можно найти <a href='https://github.com/yaonkey/react-chat-messenger'>
          Тут
          </a>
        </p>
      </div>
      <button onClick={isRulesShow=false}>Принял</button>
    </main>
    </>
  )
}


export default App;
