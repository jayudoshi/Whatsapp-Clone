import React, { useEffect, useState } from 'react';
import config from '../config';

import { PopoverBody, UncontrolledPopover } from 'reactstrap';

import {Avatar, makeStyles} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CreateIcon from '@material-ui/icons/Create';
import DoneIcon from '@material-ui/icons/Done';

function GroupInfo(props) {

    const rooms={
        name: "Room Name",
        member: [{name:"Timir" , about:"Its life enjoy every moment of it indeed !!"},{name:"Reena" , about:"Its life"},{name:"Jay" , about:"Its life"},{name:"Noni" , about:"Its life"}],
        admin: ["Timir" , "Jay"],
        group: true
    }

    const user = {
        _id: "1",
        username: "jay",
        name:"Jay",
        about:"about",
    }

    
    const [searchText , setSearchText] = useState("");
    const [disabledName , setDiasbledName] = useState(true);
    const [disabledDescription , setDiasbledDescription] = useState(true);

    const classes = makeStyles((theme) => ({
        large: {
            width: theme.spacing(7),
            height: theme.spacing(7)
        },
        xlarge: {
            width: theme.spacing(23),
            height: theme.spacing(23)
        },
    }))();
    
    const handleChange = (event) => {
        setSearchText(event.target.value)
    }

    const renderContacts = (contacts) => {
        const renderContact = (contacts) => contacts.map(contact => (
            <React.Fragment>
                <div className="row middle-align" style={{height:"80px",position:"relative"}}>
                    <div className="col-3 m-auto p-0">
                        <Avatar src={config.dpBaseUrl + contact.profilePic} className={classes.large}  style={{margin:"auto"}} />
                    </div>
                    <div className="col-9 m-auto p-0">
                        <h5 className="m-0" style={{fontSize:"1.2rem"}}>{contact.name}</h5>
                        <div className="m-0" >
                            <p className="m-0" style={{overflow:"hidden" ,textOverflow: "ellipsis" , whiteSpace: "nowrap" , fontSize:"0.9rem"}}>{contact.about}</p>
                        </div>
                    </div>
                    <hr className=" mt-3 mb-3 offset-2 col-10 h-0" style={{border: "1px solid #128C7E" , opacity:"0.1"}}/>
                    {props.room.admin.includes(contact.name) && <p class="p-0 badge badge-pill badge-info" style={{position:"absolute" , top:"0px" , right:"0px" , color:"#128C7E" , width:"120px" , height:"25px" , margin:"auto" , textAlign:"right"}}><span class="" style={{margin:"auto"}}>Group Admin</span></p>}
                    {props.room.admin.includes(props.user.user.name) && <React.Fragment>
                        <button id={contact.name} style={{width:"15px" , height:"18px" , border:"0px" , padding:"0px" , position:"absolute" , right:"10px" , bottom:"15px"}}><i class="fa fa-lg fa-angle-down"></i></button>
                        <UncontrolledPopover trigger="legacy" placement="bottom-end" target={contact.name}>
                            <PopoverBody className="p-0" style={{width:"250px" , boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                                <div className="container p-2">
                                    {props.room.admin.includes(contact.name) ?
                                        <button className="w-100 btn btn-lg popover-btn" style={{textAlign:"left"}}>Dissmiss As Admin</button>
                                     : 
                                        <button className="w-100 btn btn-lg popover-btn" style={{textAlign:"left"}}>Make Group Admin</button>
                                    }
                                    <button className="w-100 btn btn-lg popover-btn" style={{textAlign:"left"}}>Remove</button>
                                </div>
                            </PopoverBody>
                        </UncontrolledPopover>
                    </React.Fragment>}
                </div>
            </React.Fragment>
        ))
        
        contacts = contacts.sort((a, b) => {
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
        return searchText === "" ? renderContact(contacts) : renderContact(contacts.filter(contact => contact.name.includes(searchText)))
    }

    return (
        <div className="col-5 h-100">
            <div className="row componentHeader">
                <div className="h-100 row m-auto">
                    <div className="col-2 m-auto p-0 m-0">
                        <button id="close-button-info-view" onClick={() => props.setInfo(false)}><CloseIcon /></button>
                    </div>
                    <div className="offset-1 col-10" style={{margin:"auto" , padding:"0px"}}>
                        <h3 className="m-0 p-0">Group info</h3>
                    </div>
                </div>
            </div>
            <div className="row infoComponent" >
                <div className="container overflow-auto scrollbar scrollbar-default h-100" >
                    <div className="row w-100 p-3" style={{height:"300px" , margin:"15px 0px 15px 0px" , boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                        <div className="col m-auto">
                            <Avatar src={config.dpBaseUrl + props.room.groupDP} className={classes.xlarge} 
                            style={{margin:"auto",boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                            </Avatar>
                        </div>
                        <div className="col-12 " style={{margin:"15px 0px 15px 0px"}}>
                            <div className="row m-auto">
                                <div className="col-11 p-0" style={{border:"0px" , backgroundColor:"transparent"}}>
                                    <input disabled={disabledName} id="nameProfileView" 
                                        className="p-0" type="text" bsSize="lg" 
                                        placeholder={rooms.name} autoComplete="off"
                                        style={{border:'0px', width:"90%" , fontSize:"1.4rem" , backgroundColor:"transparent" }}
                                        />
                                    {!disabledName && <hr style={{margin:"1px 0px 0px 0px"}}></hr>}
                                </div>
                                <button id="nameProfileBtn" className="p-0 col-1 m-auto text-center btn-lg"
                                    style={{backgroundColor:"transparent" , border:"0px" , outlineColor:'none' , color:"#075E54"}}
                                    onClick={() => setDiasbledName(!disabledName)}>
                                    {disabledName ? <CreateIcon /> : <DoneIcon />}
                                </button>
                                <small className="p-0">Created {new Date(props.room.createdAt).toLocaleDateString()} at {new Date(props.room.createdAt).toLocaleTimeString([] ,{timeStyle: 'short' , hour12: true})}</small>
                            </div>
                        </div>
                    </div>
                    <div className="row w-100 p-2 m-0" style={{ margin:"25px 0px 25px 0px" , boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                        <div className="col-12 m-auto">
                            <div className="row m-auto">
                                <p className="m-0 p-0"><small>Description</small></p>
                                <div className="col-11 p-0" style={{border:"0px" , backgroundColor:"transparent"}}>
                                    <input disabled={disabledDescription} id="nameProfileView" 
                                        className="p-0" type="text" bsSize="lg" 
                                        placeholder={props.room.description ? props.room.description : "Add Group Descrption" } autoComplete="off"
                                        style={{border:'0px', width:"90%" , fontSize:"1.2rem" , backgroundColor:"transparent" }}
                                        />
                                    {!disabledDescription && <hr style={{margin:"1px 0px 0px 0px"}}></hr>}
                                </div>
                                <button id="nameProfileBtn" className="p-0 col-1 m-auto text-center btn-lg"
                                    style={{backgroundColor:"transparent" , border:"0px" , outlineColor:'none' , color:"#075E54"}}
                                    onClick={() => setDiasbledDescription(!disabledDescription)}>
                                    {disabledName ? <CreateIcon /> : <DoneIcon />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="row w-100 p-2" style={{ margin:"25px 0px 25px 0px" , boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                        <div className="col-12 m-auto">
                            <div className="row m-auto">
                                <p className="m-0 p-0"><small>{props.room.members.length} participants</small></p>
                                <div className="col-12 p-0">
                                    <div className="row p-2" style={{ height:"80px" , paddingBottom:"0px"}}>
                                        <div className="col m-auto w-80 p-2 m-0" style={{backgroundColor: "transparent"}}>
                                            <label htmlFor="conatactSerachInput" className="" style={{width:"6%" , marginRight:"1%"}}><i class="fa fa-search icon"></i></label>
                                            <input onChange={handleChange} autoComplete="off" 
                                                id="contactSerachInput" type="text" name="searchInput" 
                                                value={searchText} placeholder="Type Contact Name"  >
                                            </input>
                                        </div>
                                        <hr></hr>
                                    </div>
                                    <div className="row middle-align" style={{height:"80px",position:"relative"}}>
                                        <div className="col-3 m-auto p-0">
                                            <Avatar src={config.dpBaseUrl + props.user.user.profilePic} className={classes.large}  style={{margin:"auto"}} />
                                        </div>
                                        <div className="col-9 m-auto p-0">
                                            <h5 className="m-0" style={{fontSize:"1.2rem"}}>You</h5>
                                            <div className="m-0" >
                                                <p className="m-0" style={{overflow:"hidden" ,textOverflow: "ellipsis" , whiteSpace: "nowrap" , fontSize:"0.9rem"}}>{props.user.user.about}</p>
                                            </div>
                                        </div>
                                        <hr className=" mt-2 mb-2 offset-2 col-10 h-0" style={{border: "1px solid #128C7E" , opacity:"0.1"}}/>
                                        {props.room.admin.includes(props.user.user.name) && <p class="p-0 badge badge-pill badge-info" style={{position:"absolute" , top:"0px" , right:"0px" , color:"#128C7E" , width:"120px" , height:"25px" , margin:"auto" , textAlign:"right"}}><span class="" style={{margin:"auto"}}>Group Admin</span></p>}
                                    </div>
                                    {renderContacts(props.room.members.filter(mem => mem.name !== props.user.user.name))}
                                </div>
                            </div>
                        </div>
                    </div>                     
                </div>
            </div>
        </div>
    );
}

export default GroupInfo;