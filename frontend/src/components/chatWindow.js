import React , {useEffect, useState} from 'react';
import config from '../config'

import { Redirect } from 'react-router-dom';

import ChatComponent from './chatContainer';
import Sidebar from './sidebar';

function ChatWindow(props){

  const [room , setRoom ] = useState();

  const handleRoomClick = (roomId) => {
    fetch(config.baseUrl + "/rooms/"  + roomId , {
      method:"GET",
      headers:{
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
      },
    })
    .then(resp => resp.json())
    .then(resp =>{
      console.log(resp)
      if(resp.err){
      }else{
        setRoom(resp)
      }
    })
  }

  return (<div className="App container-fluid h-100 " style={{paddingLeft:"0px",paddingRight:"0px"}} >
  {!props.user.authenticated && <Redirect to="/login" />}
  <div className="container chatWindow p-0">
    <div className="row h-100" >
      <div className="col-4 chatWindowComponent h-100" style={{backgroundColor:"#f1f1f1"}}>
        <Sidebar user={props.user} setUser={props.setUser} setRoom={setRoom} handleRoomClick={handleRoomClick} />
      </div>
      <div className="col-8 chatWindowComponent h-100">
        <ChatComponent user={props.user} room={room} setRoom={setRoom} handleRoomClick={handleRoomClick}/>
      </div>
    </div>
  </div>
</div>)
}

export default ChatWindow;