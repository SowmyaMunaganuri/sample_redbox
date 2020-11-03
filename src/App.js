import React from 'react';
import './App.css';
import MainTable from './components/MainTable'
function App() {
  return (
    <div>
      <div className='crownquest'>CrownQuest</div>
        <p style={{fontWeight:'bold', fontSize:'30px'}}>CQ Horizontal Midland Basin Drilling Plan</p>
        <MainTable/>
    </div>
  );
}

export default App;