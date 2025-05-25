import React, { Component } from 'react';
import Login from "./Login.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Dashboard from './Dashboard.js';
//import "bootstrap/dist/css/bootstrap.min.css";


  function App () {
    
  return (
    // <div className="App">
    // <h1>Putni nalozi</h1>
      <Routes>
      <Route path='/'  element={<Login/>}/>
      <Route path='/login'  element={<Login/>}/>
      <Route path='/dashboard'  element={<Dashboard/>}/>
      </Routes>
    
    
  //</div>)
  )}
  

//}


export default App;
