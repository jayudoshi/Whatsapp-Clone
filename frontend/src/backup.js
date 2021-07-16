import React, { useEffect, useState } from 'react';
import DefaultView from './defualtView';
import ProfileView from './profileView';

import {Avatar, makeStyles} from '@material-ui/core';
import { deepPurple } from '@material-ui/core/colors';
import MessageIcon from '@material-ui/icons/Message';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CreateIcon from '@material-ui/icons/Create';
import DoneIcon from '@material-ui/icons/Done';
import { Button, Input, Label, Modal, PopoverBody, PopoverHeader, UncontrolledPopover } from 'reactstrap';
import Room from '../room'
import Users from '../users'

function Sidebar(props){

    const [searchText , setSearchText] = useState("");
    const [contactSearchText , setContactSearchText] = useState("");
    // const []
    const [rooms , setRooms] = useState(Room);
    const [contacts, setContacts] = useState(Users);
    const [view , setView] = useState("DEFAULT")
    // const [user , setUser] = useState("Jay")
    // const [about , setAbout] = useState("About");
    

    // useEffect(() => {
    //     setDiasbledName(true)
    // } ,[])

    const classes = makeStyles((theme) => ({
        root: {
          display: 'flex',
          '& > *': {
            margin: theme.spacing(1),
          },
        },
        small: {
          width: theme.spacing(3),
          height: theme.spacing(3),
        },
        large: {
          width: theme.spacing(7),
          height: theme.spacing(7),
        },
        xlarge: {
            width: theme.spacing(27),
            height: theme.spacing(27)
        },
        purple: {
          color: theme.palette.getContrastText(deepPurple[500]),
          backgroundColor: deepPurple[500],
        }
      }))();

    const handleChange =(event) => {
        if(event.target.name === "searchInput"){
            setSearchText(event.target.value)
        }
    }

    const handleContactSearchChange = (event) => {
        if(event.target.name === "contactSerachInput"){
            setContactSearchText(event.target.value)
        }
    }

    const handleClick = (event) => {
        setView(event.target.name);
    }

    const handleBackClick = (event) => {
        setView("DEFAULT");
    }

    const renderRooms = () => {
        const renderRoom = (rooms) => rooms.map(room => (
            <div className="row middle-align" style={{height:"90px"}}>
                <div className="col-2 m-auto"><Avatar className={classes.large}  style={{margin:"auto"}}>Hi</Avatar></div>
                    <div className="col-7 m-auto  ">
                        <h4 className="m-0">{room.name}</h4>
                        <div className="m-0" >
                            <p className="m-0">User: Message</p>
                        </div>
                    </div>
                    <div className="col-3 m-auto" >
                        <p className="m-0 p-0" style={{margin:"auto"}}>26/12/2021</p>
                        <Avatar className={classes.purple} style={{margin:"auto"}}>2</Avatar>
                    </div>
                    <hr className=" mt-2 mb-2 offset-2 col-9 offset-1 h-0" style={{border: "1px solid #128C7E"}}/>
            </div>
        ))
        return searchText === "" ? renderRoom(rooms) : renderRoom(rooms.filter(room => room.name.includes(searchText)));
    }

    const renderContacts = () => {
        const renderContact = (contacts) => contacts.map(contact => (
            <div className="row middle-align" style={{height:"90px"}}>
                <div className="col-2 m-auto"><Avatar className={classes.large}  style={{margin:"auto"}}>Hi</Avatar></div>
                    <div className="col-10 m-auto  ">
                        <h4 className="m-0">{contact.name}</h4>
                        <div className="m-0" >
                            <p className="m-0">{contact.about}</p>
                        </div>
                    </div>
                    <hr className=" mt-2 mb-2 offset-2 col-10 h-0" style={{border: "1px solid #128C7E" , opacity:"0.1"}}/>
            </div>
        ))
        return contactSearchText === "" ? renderContact(contacts) : renderContact(contacts.filter(contact => contact.name.includes(contactSearchText)));
    }

    // const renderProfileView = () => (
    //     <React.Fragment>
    //         <div className="row componentHeader">
    //             <div className="h-100 row m-auto ">
    //                 <button className="btn btn-lg col-1 m-auto p-0 b-0" onClick={handleBackClick}>
    //                     <i class="fa fa-lg fa-arrow-left" style={{color:"white"}}></i>
    //                 </button>
    //                 <h2 className="col-11 m-auto"> Profile </h2>
    //             </div>
    //         </div>
    //         <div className="row" style={{height:"88%" , backgroundColor:"#F0F0F0" , color:"#075E54"}}>
    //             <div className="container-fluid w-100 h-100 m-0 p-0">
    //                 <div className="row w-100 h-50 m-0 p-0">
    //                     <div className="col m-auto">
    //                         <Avatar src="./images/chatBackground.png" className={classes.xlarge} 
    //                         style={{margin:"auto",boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
    //                         </Avatar>
    //                     </div>
    //                 </div>
    //                 <div className="row w-100 h-25 p-2 m-0">
    //                     <div className="col-12 m-auto">
    //                         <p><small>Your Name</small></p>
    //                         <div className="row m-auto">
    //                             <div className="col-11 p-0" style={{border:"0px" , backgroundColor:"transparent"}}>
    //                                 <Input disabled={disabledName} id="nameProfileView" 
    //                                     className="p-0" type="text" bsSize="lg" 
    //                                     value={user}
    //                                     style={{border:'0px', width:"90%" , backgroundColor:"transparent" }}
    //                                     />
    //                             </div>
    //                             <button id="nameProfileBtn" className="p-0 col-1 m-auto text-center btn btn-lg"
    //                                 style={{backgroundColor:"transparent" , border:"0px" , outlineColor:'none' , color:"#075E54"}}
    //                                 onClick={() => setDiasbledName(!disabledName)}>
    //                                 {disabledName ? <CreateIcon /> : <DoneIcon />}
    //                             </button>
    //                         </div>
    //                     </div>
    //                     <hr style={{width:"10%" , margin:"auto" , height:"0px" , borderTop:"10px dotted #075E54" , backgroundColor:"transparent"}}></hr>
    //                 </div>
    //                 <div className="row w-100 h-25 p-2 m-0">
    //                     <div className="col-12 m-auto">
    //                         <p><small>About</small></p>
    //                         <div className="row m-auto">
    //                             <div className="col-11 p-0" style={{border:"0px" , backgroundColor:"transparent"}}>
    //                                 <Input disabled={disabledAbout} id="aboutProfileView" 
    //                                     className="p-0" type="text" bsSize="lg" 
    //                                     value={about}
    //                                     style={{border:'0px', width:"90%" , backgroundColor:"transparent" }}
    //                                     />
    //                             </div>
    //                             <button id="aboutProfileBtn" className="p-0 col-1 m-auto text-center btn btn-lg"
    //                                 style={{backgroundColor:"transparent" , border:"0px" , outlineColor:'none' , color:"#075E54"}}
    //                                 onClick={() => setDiasbledAbout(!disabledAbout)}>
    //                                 {disabledAbout ? <CreateIcon /> : <DoneIcon />}
    //                             </button>
    //                         </div>
    //                     </div>
    //                     <hr className="p-0 m-auto" style={{width:"10%" , margin:"auto" , height:"0px" , borderTop:"10px dotted #075E54" , backgroundColor:"transparent"}}></hr>
    //                 </div>
    //             </div>
    //         </div>
    //     </React.Fragment>
    // )

    const renderNewGroupView = () => (
        <React.Fragment>
            <div className="row componentHeader">
                <div className="h-100 row m-auto ">
                    <button className="btn btn-lg col-1 m-auto p-0 b-0" onClick={handleBackClick}>
                        <i class="fa fa-lg fa-arrow-left" style={{color:"white"}}></i>
                    </button>
                    <h2 className="col-11 m-auto"> Add Group Participants </h2>
                </div>
            </div>
            <div className="row roomContainer overflow-auto">
                <div className="container">
                    <div className="row p-2" style={{ height:"80px" , paddingBottom:"0px"}}>
                        <div className="col m-auto w-80 p-2 m-0" style={{backgroundColor: "transparent"}}>
                            <label htmlFor="conatactSerachInput" className="w-10" style={{width:"5%"}}><i class="fa fa-search icon"></i></label>
                            <input onChange={handleContactSearchChange} autoComplete="off" 
                                id="contactSerachInput" type="text" name="contactSerachInput" 
                                value={contactSearchText} placeholder="Type Contact Name"  >
                            </input>
                        </div>
                        <hr></hr>
                    </div>
                    {renderContacts()}
                </div>
            </div>
        </React.Fragment>
    )

    const renderDefaultView = () => (
        <React.Fragment>
            <div className="row componentHeader">
                <div className="h-100 row m-auto ">
                    <div className="col-2 m-auto p-0 m-0">
                        <Avatar className={classes.large}  style={{margin:"0px"}}>Hi</Avatar>
                    </div>
                    <div className="col-7"></div>
                    <div className="col-3 m-auto">
                        <div className="row">
                            <div className="col-5"> 
                                <button className="p-0 m-0" style={{backgroundColor: "inherit" , border:"0px" , color:"white"}}>
                                    <MessageIcon  fontSize="large" />
                                </button>
                            </div>
                            <div className="offset-2 col-5">
                                <button className="p-0 m-0" id="PopoverLegacySidebar" type="button" style={{backgroundColor: "inherit" , border:"0px" , color:"white"}}>
                                    <MoreVertIcon fontSize="large" />
                                </button>
                                <UncontrolledPopover trigger="legacy" fade="true" placement="bottom-end" target="PopoverLegacySidebar">
                                    <PopoverBody className="p-0" style={{width:"180px" , boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                                        <div className="container p-2">
                                            <button className="w-100 btn btn-lg popover-btn" name="NEW_CHAT" onClick={handleClick} style={{textAlign:"left"}}>New Chat</button>
                                            <button className="w-100 btn btn-lg popover-btn" name="NEW_GROUP" onClick={handleClick} style={{textAlign:"left"}}>New Group</button>
                                            <button className="w-100 btn btn-lg popover-btn" name="PROFILE" onClick={handleClick} style={{textAlign:"left"}}>Profile</button>
                                            <button className="w-100 btn btn-lg popover-btn" name="LOGOUT" style={{textAlign:"left"}}>Logout</button>
                                        </div>
                                    </PopoverBody>
                                </UncontrolledPopover>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row roomContainer overflow-auto">
                <div className="container">
                    <div className="row p-2" style={{ height:"80px" ,backgroundColor: "#E2DAD2"}}>
                        <div className="col m-auto w-80 p-2 m-0 rounded-pill" style={{backgroundColor: "white"}}>
                            <label htmlFor="serachInput" className="w-10" style={{width:"5%"}}><i class="fa fa-search icon"></i></label>
                            <input onChange={handleChange} id="serachInput" type="text" name="searchInput" value={searchText} placeholder="Search"  ></input>
                        </div>
                    </div>
                    {renderRooms()}
                </div>
            </div>
        </React.Fragment>
    )

    return (
        <div className="container p-0 h-100">
            {view === "DEFAULT" && <DefaultView handleClick={handleClick} />}
            {view === "PROFILE" && <ProfileView handleBackClick={handleBackClick} />}
            {view === "NEW_CHAT" && <div><h1>NEW CHAT</h1></div>}
            {view === "NEW_GROUP" && renderNewGroupView()}
        </div>
    )
}

export default Sidebar;