import { useState } from 'react'
import './App.css'
import Dock from './components/Dock'
import Window from './components/Window'
import MiniAda from './components/MiniAda'

import Home from './windows/Home';
import About from './windows/About';
import Projects from './windows/Projects';
import Skills from './windows/Skills';

function App() {
  const [openWindows, setOpenWindows] = useState([]);
  const [zCounter, setCounter] = useState(1000);

  const handleAppClick = (id) => {
    if (!openWindows.some(win => win.id === id)) {
      const windowWidth = 400;
      const windowHeight = 300;
  
      const maxX = window.innerWidth - windowWidth;
      const maxY = window.innerHeight - windowHeight;
  
      const randomX = Math.floor(Math.random() * maxX);
      const randomY = Math.floor(Math.random() * maxY);
  
      const newWindow = {
        id,
        x: randomX,
        y: randomY,
      };
  
      setOpenWindows([...openWindows, newWindow]);
    }
  };

  const handleClose = (id) => {
    setOpenWindows(openWindows.filter(win => win.id !== id));
  };

  const getWindowContent = (id) => {
    switch (id) {
      case 'home':
        return <Home />;
      case 'about':
        return <About />;
      case 'projects':
        return <Projects />;
      case 'skills':
        return <Skills />;
      case 'contact':
        return <MiniAda />
      default:
        return <p>Unknown window</p>
    }
  };

  return (
    <>
      <div className='graffiti-bg' />
      <Dock onAppClick={handleAppClick} />

      {openWindows.map(({ id, x, y }) => (
        <Window
          key={id}
          title={id}
          id={id}
          initialX={x}
          initialY={y}
          onClose={() => handleClose(id)}
          bringToFront={() => {
            setCounter(prevZ => prevZ + 1);
            return zCounter + 1;
          }}
        >
          {getWindowContent(id)}
        </Window>
      ))}
    </>
  );
}

export default App;
