import React, { useEffect, useState } from 'react';
import config from '../config';

import DefaultView from './defualtView';
import ProfileView from './profileView';
import NewGroupView from './newGroupView';
import CreateGroupView from './createGroupView';
import NewChatView from './newChatView';

function Sidebar(props){

    // const [contacts, setContacts] = useState(Users);
    const [view , setView] = useState(JSON.parse(localStorage.getItem('view')) || "DEFAULT");
    const [groupParticipants , setGroupParticipants] = useState([]);
    const [rooms , setRooms] = useState([]);

    const getMembers = () => {

        // return contacts.filter(contact => groupParticipants.includes(contact._id));
    }
    
    const handleClick = (event) => {
        setView(event.target.name);
    }

    const handleBackClick = (event) => {
        setView("DEFAULT");
    }

    useEffect(() => {localStorage.setItem('view',JSON.stringify(view))} , [view])
    useEffect(() => {
        fetch(config.baseUrl + "/rooms?user=" + props.user.user._id , {
            method:"GET",
            headers:{
                'Authorization' : 'Bearer ' + localStorage.getItem('token')
            },
        })
        .then(resp => resp.json())
        .then(resp => {
            console.log(resp);
            if(resp.err){
                console.log(resp.err)
            }else{
                setRooms(resp.rooms)
                console.log("No err");
            }
        })
    } ,[])

    return (
        <div className="container p-0 h-100" style={{position:"relative"}}>
            {view === "DEFAULT" && <DefaultView 
                user={props.user} setUser = {props.setUser}
                rooms={rooms} 
                setView={setView}
                setRoom={props.setRoom}
                handleRoomClick={props.handleRoomClick}
                handleClick={handleClick} 
            />}
            
            {view === "PROFILE" && <ProfileView 
                user={props.user}
                setUser={props.setUser}
                handleBackClick={handleBackClick} 

            />}
            
            {view === "NEW_CHAT" && <NewChatView 
                user={props.user}
                setView={setView} 
                handleBackClick={handleBackClick} 
                setRooms={setRooms} />}
            
            {view === "NEW_GROUP" && <NewGroupView 
                user={props.user}
                setView={setView} 
                groupParticipants={groupParticipants} 
                setGroupParticipants={setGroupParticipants} 
                handleBackClick={handleBackClick} />}
            
            {view === "CREATE_GROUP" && <CreateGroupView
                user={props.user}
                groupParticipants={groupParticipants}
                setGroupParticipants={setGroupParticipants} 
                setView={setView} 
                setRooms={setRooms} />}
        </div>
    )
}

export default Sidebar;