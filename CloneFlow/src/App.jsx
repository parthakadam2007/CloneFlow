import { useState } from 'react';
import Chat from './component/Chat.jsx';
import Inbox from './component/Inbox.jsx';
import Profile from './component/Profile.jsx';
import GiveContext from './component/GiveContext.jsx';
import Compose from './component/Compose.jsx';
import Calender from './component/Calender.jsx';
import TodoList from './component/todolist.jsx';
import Header from './component/Header.jsx';
import Rag from "./component/Rag.jsx"
import Test from "./component/test1.jsx"

import BackgroundEmailFetcher from './component/BackgroundEmailFetcher'; // import it



import './App.css';
import './component/fontCss.css';

import chatIcon from './assets/chat.svg';
import inboxIcon from './assets/inbox.svg';
import composeIcon from './assets/pen.svg';
import calendarIcon from './assets/calendar.svg';
import todoIcon from './assets/list.svg';
import ragIcon from './assets/rag.svg';
function App() {
  const [active, setActive] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [emails, setEmails] = useState([]); 

   const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const renderComponent = () => {
    if (active === 'chat') return <Chat />;
    if (active === 'inbox') return <Inbox emails={emails} />;
    if (active === 'profile') return <Profile />;
    if (active === 'compose') return <Compose />;
    if (active === 'calender') return <Calender />;
    if (active === 'todolist') return <TodoList />;
    if (active === 'givecontext') return <GiveContext />;
    if (active=== 'rag') return <Rag />;
    if (active === 'test') return <Test />;
    // Add more components as needed

    return <h2>Page not found</h2>;
  };

  return (
    <div className="superContainer" >
       <BackgroundEmailFetcher onFetch={setEmails} /> {/* run in background */}
      <Header  toggleSidebar={toggleSidebar}/>
    
  <div className="container" style={{backgroundColor:'#f8fafd'}}>

  <div className={`${sidebarOpen ? 'sidebar' : 'sidebar-close'}`}>
    <div className="composeContainer">
  <button className='rubikSemiBold  btn btn-primary' onClick={() => setActive('compose')}>
    <img src={composeIcon} alt="Compose Icon" className="sidebar-icon" />
    <div className='rubikSemiBold'>Compose</div>
  </button>
    </div>

 
  <button className='rubikRegular' onClick={() => setActive('chat')}>
    <img src={chatIcon} alt="Chat Icon" className="sidebar-icon" />
    Chat
  </button>
  <button className='rubikRegular' onClick={() => setActive('inbox')}>
    <img src={inboxIcon} alt="Inbox Icon" className="sidebar-icon" />
    Inbox
  </button>

  <button className='rubikRegular' onClick={() => setActive('calender')}>
    <img src={calendarIcon} alt="Calendar Icon" className="sidebar-icon" />
    Calendar
  </button>
  <button className='rubikRegular' onClick={() => setActive('todolist')}>
    <img src={todoIcon} alt="Todo Icon" className="sidebar-icon" />
    TodoList
  </button>
   <button className='rubikRegular' onClick={() => setActive('rag')}>
    <img src={ragIcon} alt="Rag Icon" className="sidebar-icon" />
    Memory
  </button>

</div>

     <div className="content" style={{backgroundColor:'white'}}>
       {renderComponent()}
     </div>
   </div>
    </div>
  
  );
}

export default App;
