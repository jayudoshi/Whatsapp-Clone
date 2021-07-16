import React , {useEffect, useState} from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import io  from "socket.io-client";

import Main from './mainComponent';

import './App.css';

let socket;

function App() {

  useEffect(()=>{
    console.log("Use effect of app called")
    // localStorage.clear();
    return () => {
      console.log('Clean Function got called !!')
      localStorage.clear();
    }
  } , [])

  // const [formText , setFormText] = useState("");
  // const [msg , setMsg] = useState([]);

  // useEffect(() => {
  //   setMsg([])
  //   socket = io("http://localhost:9000");

  //   socket.on('connect' , () => {
  //     setUser(socket.id);
  //   });

  //   socket.on('newMsg' , (msg) => {
  //     setMsg(prevState => [...prevState , msg])
  //   })

  //   socket.on('newLoactionMsg' , (msg) => {
  //     setMsg(prevState => [...prevState , msg])
  //   })
  
  //   socket.on('disconnect',() => {
  //     console.log("Disconnected From Server !!");
  //     setMsg([])
  //     socket.close();
  //   });
  // } , [])

  // window.onunload = () => {
  //   alert("Close Event Triggered !!")
  //   localStorage.clear();
  // }
  
  return (
    <Router>
      <Main />
    </Router>
  );
}


export default App;