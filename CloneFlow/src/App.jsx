import { useState } from 'react';
import Chat from './component/Chat.jsx';
import Inbox from './component/Inbox.jsx';
import Profile from './component/Profile.jsx';
import GiveContext from './component/GiveContext.jsx';
import Compose from './component/Compose.jsx';
import Calender from './component/Calender.jsx';
import TodoList from './component/todolist.jsx';
import Header from './component/Header.jsx';
import './App.css';

function App() {
  const [active, setActive] = useState('chat');

  const renderComponent = () => {
    if (active === 'chat') return <Chat />;
    if (active === 'inbox') return <Inbox />;
    if (active === 'profile') return <Profile />;
    if (active === 'compose') return <Compose />;
    if (active === 'calender') return <Calender />;
    if (active === 'todolist') return <TodoList />;
    if (active === 'givecontext') return <GiveContext />;

    return <h2>Page not found</h2>;
  };

  return (
    <div className="superContainer">
      <Header />
    
  <div className="container">
     
     <div className="sidebar">
       <button onClick={() => setActive('chat')}>Chat</button>
       <button onClick={() => setActive('inbox')}>Inbox</button>
       <button onClick={() => setActive('profile')}>Profile</button>
       <button onClick={()=> setActive('compose')}>Compose</button>
       <button onClick={()=> setActive('calender')}>Calender</button>
       <button onClick={()=> setActive('todolist')}>TodoList</button>
       <button onClick={()=> setActive('givecontext')}>givecontext</button>
     </div>

     <div className="content">
       {renderComponent()}
     </div>
   </div>
    </div>
  
  );
}

export default App;
