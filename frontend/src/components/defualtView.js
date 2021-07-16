import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import config from '../config'

import { PopoverBody, UncontrolledPopover } from 'reactstrap';

import {Avatar, makeStyles} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { deepPurple } from '@material-ui/core/colors';
import MessageIcon from '@material-ui/icons/Message';
import MoreVertIcon from '@material-ui/icons/MoreVert';


function DefaultView(props){

    //Required
    const [searchText , setSearchText] = useState("");
    const classes = makeStyles((theme) => ({
        root: {
            width: '100%',
            '& > * + *': {
              marginTop: theme.spacing(2),
            },
        },
        large: {
          width: theme.spacing(7),
          height: theme.spacing(7),
        },
        purple: {
          color: theme.palette.getContrastText(deepPurple[500]),
          backgroundColor: deepPurple[500],
        }
      }))();

    const [openSnackBar , setOpenSnackBar] = useState(false);
    const[severity , setSeverity] = useState("");
    const [alert, setAlert] = useState("");

    const handleChange =(event) => {
        if(event.target.name === "searchInput"){
            setSearchText(event.target.value)
        }
    }

    const handleLogout = (event) => {
        setOpenSnackBar(true);
        setSeverity("success");
        setAlert("Logging Out!!");
        setTimeout(() => {
            props.setUser({
                user:{},
                authenticated: false
            })
            localStorage.clear();
            <Redirect to="/login" />
        } , 1000)
    }

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const renderRooms = () => {
        const renderRoom = (rooms) => rooms.map(room => {
            if(room.group){
                return (
                    <React.Fragment>
                        {/* <div onClick={() => props.handleRoomClick(room._id)} className="row middle-align room-pointer" style={{height:"90px"}}> */}
                        <div onClick={() => props.setRoom(room)} className="row middle-align room-pointer" style={{height:"90px"}}>
                            <div className="col-2 m-auto">
                                <Avatar src={config.dpBaseUrl + room.groupDP} className={classes.large}  style={{margin:"auto"}} />
                            </div>
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
                        </div>
                        <hr className="h-0" style={{width:"85%" , margin:"0px 0px 0px auto"  , border: "1px solid #128C7E" , opacity:"0.1"}}/>
                    </React.Fragment>
                )
            }else if(!room.group){
                const member =room.members.filter(mem => mem._id !== props.user.user._id)[0];
                return (
                    <React.Fragment>
                        {/* <div onClick={() => props.handleRoomClick(room._id)} className="row middle-align room-pointer" style={{height:"90px"}}> */}
                        <div onClick={() => props.setRoom(room)} className="row middle-align room-pointer" style={{height:"90px"}}>
                            <div className="col-2 m-auto">
                                <Avatar src={config.dpBaseUrl + member.profilePic} className={classes.large}  style={{margin:"auto"}} />
                            </div>
                            <div className="col-7 m-auto  ">
                                <h4 className="m-0">{member.name}</h4>
                                <div className="m-0" >
                                    <p className="m-0">User: Message</p>
                                </div>
                            </div>
                            <div className="col-3 m-auto" >
                                <p className="m-0 p-0" style={{margin:"auto"}}>26/12/2021</p>
                                <Avatar className={classes.purple} style={{margin:"auto"}}>2</Avatar>
                            </div>
                        </div>
                        <hr className="h-0" style={{width:"85%" , margin:"0px 0px 0px auto"  , border: "1px solid #128C7E" ,opacity:"0.1"}}/>
                    </React.Fragment>
                )
            }else{
                return (<React.Fragment></React.Fragment>)
            }
        }
        )
        return searchText === "" ? renderRoom(props.rooms) : renderRoom(props.rooms.filter(room => room.name.includes(searchText)));
    }


    return (
        <React.Fragment>
            <div className="row componentHeader">
                <div className="h-100 row m-auto ">
                    <div className="col-2 m-auto p-0 m-0">
                        <Avatar id="userProfilePic" onClick={() => props.setView('PROFILE')} src={config.dpBaseUrl + props.user.user.profilePic} className={classes.large}  style={{margin:"0px",backgroundColor:"white"}} />
                    </div>
                    <div className="col-7 m-auto">
                        <h2>{props.user.user.name}</h2>
                    </div>
                    <div className="col-3 m-auto">
                        <div className="row">
                            <div className="col-5"> 
                                <button onClick={() => props.setView("NEW_CHAT")} className="p-0 m-0" style={{backgroundColor: "inherit" , border:"0px" , color:"white"}}>
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
                                            <button className="w-100 btn btn-lg popover-btn" name="NEW_CHAT" onClick={props.handleClick} style={{textAlign:"left"}}>New Chat</button>
                                            <button className="w-100 btn btn-lg popover-btn" name="NEW_GROUP" onClick={props.handleClick} style={{textAlign:"left"}}>New Group</button>
                                            <button className="w-100 btn btn-lg popover-btn" name="PROFILE" onClick={props.handleClick} style={{textAlign:"left"}}>Profile</button>
                                            <button className="w-100 btn btn-lg popover-btn" name="LOGOUT" onClick={handleLogout} style={{textAlign:"left"}}>Logout</button>
                                        </div>
                                    </PopoverBody>
                                </UncontrolledPopover>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row roomContainer overflow-auto" style={{backgroundColor:"white"}}>
                <div className="container">
                    <div className="row p-2" style={{ height:"80px" ,backgroundColor: "#E2DAD2"}}>
                        <div className="col m-auto w-80 p-2 m-0 rounded-pill" style={{backgroundColor: "white"}}>
                            <label htmlFor="serachInput" className="w-10" style={{width:"5%"}}><i class="fa fa-search icon"></i></label>
                            <input onChange={handleChange} id="serachInput" type="text" name="searchInput" value={searchText} placeholder="Search" autoComplete="off" ></input>
                        </div>
                    </div>
                    {renderRooms()}
                </div>
            </div>

            <div className={classes.root}>
                <Snackbar anchorOrigin={{ vertical:'top' , horizontal:'center'}} 
                    open={openSnackBar} autoHideDuration={3000} 
                    onClose={() => setOpenSnackBar(false)}
                >
                    <Alert onClose={() => setOpenSnackBar(false)} severity={severity}>
                    {alert}
                    </Alert>
                </Snackbar>
            </div>
        </React.Fragment>
    );
}

export default DefaultView;