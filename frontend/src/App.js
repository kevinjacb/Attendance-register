import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { Track, Register } from './RTPages.js';

import { ProSidebarProvider } from 'react-pro-sidebar';
import { useState } from 'react';
import ModifyPage from './Modifypage';
import Layout from "./Sidebar";
import { SocialIcon } from 'react-social-icons';

function App() {
  return (
    <ProSidebarProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/trackme" element={<Screens screen='track' />} />
            <Route path="/register" element={<Screens screen='register' />} />
            <Route path="/modify" element={<Screens screen='modify' />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ProSidebarProvider>
  );
}

function WelcomeScreen() {
  return (
    <div className="welcome">
      <div className='welcome-components'>
        <h1 className='welcome-components'>ATTENDANCE <br></br>TRACKER</h1>
        <p className='welcome-components'>REGISTER AND TRACK YOUR ATTENDANCE EASILY!</p>
        <Link to='/trackme' id="welcome-button">GET STARTED</Link>
      </div>
    </div>
  );
}

function Screens(props) {
  let screen;
  switch (props.screen) {
    case 'track':
      screen = <Track />;
      break;
    case 'register':
      screen = <Register />;
      break;
    case 'modify':
      screen = <ModifyPage />;
      break;

    default:
      screen = null;
  }
  return (
    <div id='screens'>
      <SocialIcon url="https://github.com/kevinjacb/Attendance-register" bgColor='rgb(255,255,255,0.4)' fgColor='black' className='social-icon' style={{ position: 'absolute', 'zIndex': 9999 }} />
      <Layout />
      {screen}
    </div>
  );
}


export default App;
