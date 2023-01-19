import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import Add from './components/Add';
import Definitions from './components/Definitions';
import Examples from './components/Examples';
import Interaction from "./components/Interaction";
import Information from "./components/Information";
import TestKnowledge from "./components/TestKnowledge";
import './App.css';



function App() {
  return (
    <Router>
      <div>
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
        
          <Route path='/definitions' element={<Definitions />} />
        
          <Route path='/examples' element={<Examples />} />

          <Route path='/add' element={<Add />} />

          <Route path='/test_knowledge' element={<TestKnowledge />} />

          <Route path='/try' element={<Interaction />} />

          <Route path='/Information' element={<Information />} />
        </Routes>

      </div>
    </Router>
  )
}

export default App;
