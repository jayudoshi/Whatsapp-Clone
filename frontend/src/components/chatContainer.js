import React, { useEffect, useState } from 'react';
import config from '../config';

import GroupInfo from './groupInfo';
import ContactInfo from './contactInfo';

import {Form , FormGroup , Input , UncontrolledPopover, PopoverBody} from 'reactstrap'

import {Avatar, makeStyles} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';


import Chats from '../chat';

function ChatComponent(props){

    const [info , setInfo] = useState(false);
    // const [isPopOpen , setIsPopOpen] = useState(false);
    
    const [chats,setChats] = useState([]);
    const [msg , setMsg] = useState("");

    useEffect(()=>{
        if(props.room){
            console.log("Chat Room Retrieve Id")
            console.log(props.room.chats)
            fetch(config.baseUrl + "/chats/" + props.room.chats , {
                method:"GET",
                headers:{
                    'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                    'Content-type' : 'application/json; charset=UTF-8'
                },
            })
            .then(resp => resp.json())
            .then(resp => {
                if(resp.err){
                    console.log(resp.err)
                }else{
                    setChats(resp.chats)
                    // console.log(resp)
                }
            })
        }
    },[props.room])

    // const handleSubmit = (event) => {
    // event.preventDefault();
    // socket.emit('createMsg' , {
    //     from: user,
    //     text: formText
    // })
    // }

    // const handleChange = (event) => {
    //     if(event.target.name === "text"){
    //       setFormText(event.target.value)
    //     }
    // }

    // const getLocation = () => {
    //     if(!navigator.geolocation){
    //       alert("Service Not Supported Pl Accept Terms !!");
    //     }else{
    //       navigator.geolocation.getCurrentPosition((position) => {
    //         const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
    //         socket.emit('createLocationMsg', {
    //           from: user,
    //           pos: pos
    //         })
    //       } , (err) => console.log(err)
    //       , {enableHighAccuracy: true});
    //     }
    // }

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
            width: theme.spacing(23),
            height: theme.spacing(23)
        },
        xxlarge: {
            width: theme.spacing(80),
            height: theme.spacing(50)
        },
      }))();


    const getSoretedMembers = () => {
        let members = props.room.members.sort((a, b) => {
            let fa = a.name.toLowerCase(),
                fb = b.name.toLowerCase();
            if (fa < fb) {
                return -1;
            }
            if (fa > fb) {
                return 1;
            }
            return 0;
        });
        members = members.filter(mem => mem.name !== props.user.user.name)
        let arr = members.map(mem => mem.name + ", ");
        const str = arr[arr.length-1]
        arr[arr.length-1] = str.substring(0 , str.length-2)
        console.log(arr);
        return [ "You, " , ...arr];
    }

    const handleChange = (event) => {
        setMsg(event.target.value);
    }

    const handleSubmitChat = (event) => {
        event.preventDefault();
        fetch(config.baseUrl + "/chats/" + props.room.chats , {
            method:"PUT",
            headers:{
                'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                'Content-type' : 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                from: props.user.user._id,
                msg: msg
            })
        })
        .then(resp => resp.json)
        .then(resp => {
            console.log(resp);
            if(resp.err){
                console.log(resp.err);
            }else{
                setMsg("")
                console.log("No Err");
            }
        })
    }

    const renderHeaderComponenet = () => {
        if(props.room.group){
            return (
                <div className="row componentHeader">
                    <div className="h-100 row m-auto">
                        <div className="col-1 m-auto p-0 m-0">
                            <Avatar src={config.dpBaseUrl + props.room.groupDP} className={classes.large}  style={{margin:"0px" , backgroundColor:"white"}} />
                        </div>
                        <div className= {info ? "offset-2 col-8" : "col-10"} style={{margin:"auto" , padding:"0px"}}>
                            <h3 className="m-0 p-0">{props.room.name}</h3>
                            <p className="m-0 p-0 w-100" style={{height:"24px" , overflow:"hidden" ,textOverflow: "ellipsis" , whiteSpace: "nowrap"}}>{getSoretedMembers()}</p>
                        </div>
                        <div className="col-1 m-auto p-0 m-0" style={{textAlign: "right"}} >
                            <button className="p-0 m-0" id="roomPopover" style={{backgroundColor: "inherit" , border:"0px" , color:"white"}}>
                                <MoreVertIcon fontSize="large" />
                            </button>
                            <UncontrolledPopover trigger="legacy" placement="bottom-end" target="roomPopover">
                                <PopoverBody className="p-0" style={{width:"180px" , boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                                    <div className="container p-2">
                                        <button className="w-100 btn btn-lg popover-btn" style={{textAlign:"left"}}>Select Msg</button>
                                        <button onClick={() => {setInfo(true)}} className="w-100 btn btn-lg popover-btn" style={{textAlign:"left"}}>Group Info</button>
                                        <button className="w-100 btn btn-lg popover-btn" style={{textAlign:"left"}}>Clear Chat</button>
                                        <button className="w-100 btn btn-lg popover-btn" style={{textAlign:"left"}}>Exit</button>
                                    </div>
                                </PopoverBody>
                            </UncontrolledPopover>
                        </div>
                    </div>
                </div>
            )
        }else if(!props.room.group){
            console.log(props.room.member)
            // const member="";
            console.log(props.user.user._id)
            const member = props.room.members.filter(mem => mem._id !== props.user.user._id)[0]
            console.log("Member:-")
            console.log(member)
            return (
                <div className="row componentHeader">
                    <div className="h-100 row m-auto">
                        <div className="col-1 m-auto p-0 m-0">
                            <Avatar src={config.dpBaseUrl + member.profilePic} className={classes.large}  style={{margin:"0px" , backgroundColor:"white"}} />
                        </div>
                        <div className= {info ? "offset-2 col-8" : "col-10"} style={{margin:"auto" , padding:"0px"}}>
                            <h3 className="m-0 p-0">{member.name}</h3>
                            <p className="m-0 p-0 w-100" style={{height:"24px" , overflow:"hidden" ,textOverflow: "ellipsis" , whiteSpace: "nowrap"}}>online or last seen a 16.30</p>
                        </div>
                        <div className="col-1 m-auto p-0 m-0" style={{textAlign: "right"}} >
                            <button className="p-0 m-0" id="chatRoomPopover" style={{backgroundColor: "inherit" , border:"0px" , color:"white"}}>
                                <MoreVertIcon fontSize="large" />
                            </button>
                            <UncontrolledPopover trigger="legacy" placement="bottom-end" target="chatRoomPopover">
                                <PopoverBody className="p-0" style={{width:"180px" , boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                                    <div className="container p-2">
                                        <button className="w-100 btn btn-lg popover-btn" style={{textAlign:"left"}}>Select Msg</button>
                                        <button onClick={() => {setInfo(true)}} className="w-100 btn btn-lg popover-btn" style={{textAlign:"left"}}>Contact Info</button>
                                        <button className="w-100 btn btn-lg popover-btn" style={{textAlign:"left"}}>Clear Chat</button>
                                        <button className="w-100 btn btn-lg popover-btn" style={{textAlign:"left"}}>Exit</button>
                                    </div>
                                </PopoverBody>
                            </UncontrolledPopover>
                        </div>
                    </div>
                </div>
            )
        }
    }

    const renderSenderChat = (chat) => {
        return(
            <div className="row">
                <div className="offset-7 col-5 mb-2 p-0" >
                    <div className="fromMeChat p-2">
                        {props.room.group && <p className="m-0" style={{textAlign:"left" , paddingLeft: "2%" , height: "14px"}}><sup>You</sup></p>}
                        <p className="m-auto">{chat.msg}</p>
                        <p className="w-100 m-0" style={{textAlign: "right",height:"12px"}}>
                            <sup>{new Date(chat.createdAt).toLocaleTimeString([] ,{timeStyle: 'short' , hour12: true})}</sup>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const renderRecieverChat = (chat) => {
        return(
            <div className="row">
                <div className="col-5 mb-2 p-0" >
                    <div className="fromOtherChat p-2">
                        {props.room.group && <p className="m-0" style={{textAlign:"left" , paddingLeft: "2%" , height: "14px"}}><sup>{chat.from.name}</sup></p>}
                        <p className="m-auto">{chat.msg}</p>
                        <p className="w-100 m-0" style={{textAlign: "right",height:"12px"}}>
                            <sup>{new Date(chat.createdAt).toLocaleTimeString([] ,{timeStyle: 'short' , hour12: true})}</sup>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const renderAdminChat = (chat) => {
        return(
            <div className="row mb-2 p-0">
                <div className="offset-3 col-6 offset-3" >
                    <div className="adminMsg rounded-pill p-2 m-auto" style={{width: "max-content"}}>
                        {chat.msg}
                    </div>
                </div>
            </div>
        );
    }

    const renderChats = () => chats.map(chat => {
        if(chat.from.name === "Admin"){
            return renderAdminChat(chat);
        }
        return( chat.from._id === props.user.user._id ? renderSenderChat(chat) : renderRecieverChat(chat) );
      })

    return (
        <div className="container p-0 h-100">
            {/* Header */}
            {console.log(props.room)}
            {!props.room && <div  className="row h-100" style={{position:"relative" , backgroundColor:"#FFFFFF"}}>
                <div id="chatContainer" className="p-0 h-100 w-100" style={{position:"relative"}}></div>
                <Avatar src="./images/chatcomponentback.jpg" className={classes.xxlarge} 
                    style={{opacity:"0.8" ,position:"absolute" , left:"0" , top: "0" , right:"0" , bottom:"0"  , margin:"auto" , boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" , padding:"0px"}}>
                </Avatar>
            </div>}
            {props.room && <div className="row h-100">
                <div className={info ? "col-7 h-100" : "col-12 h-100"} style={{borderRight:"1px solid #128C7E"}}>
                    {renderHeaderComponenet()}
                    <div className="row chatComponent overflow-auto my-custom-scrollbar my-custom-scrollbar-primary" >
                        <div className="container p-4 scrollbar scrollbar-default" >
                            {renderChats()}
                        </div>
                    </div>
                    <div className="chatForm row p-2" >
                        <div className="container p-0 m-auto">
                            <Form className="row" onSubmit={handleSubmitChat}>
                                <FormGroup className="col-11" style={{paddingRight: "0px"}}>
                                    <Input value={msg} onChange={handleChange} type="text" placeholder="Type a message" className="border rounded-pill" />
                                </FormGroup>
                                <FormGroup className="col-1 m-auto " style={{paddingLeft: "0px"}}>
                                    <button type="submit" disabled={msg==="" ? true : false} className="text-center p-0 text-center w-100 h-100" style={{border: "0px"}}>
                                        <i class="fa fa-lg fa-angle-double-right" style={{fontSize:"2.2rem" , color:"#075e54"}}></i>
                                    </button>
                                </FormGroup>
                            </Form>
                        </div>
                    </div>
                </div>
                {info && props.room.group && <GroupInfo setInfo={setInfo} room={props.room} user={props.user} setRoom={props.setRoom} handleRoomClick={props.handleRoomClick} />}
                {info && !props.room.group && <ContactInfo setInfo={setInfo} room={props.room} user={props.user} setRoom={props.setRoom} handleRoomClick={props.handleRoomClick} />}
            </div>
            } 
        </div>
    )
}

export default ChatComponent;