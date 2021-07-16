import React, { useEffect, useState } from 'react';
import config from '../config'

import {Avatar, makeStyles} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

function ContactInfo(props){

    const [contact,setContact] = useState(props.room.members.filter(mem => mem._id !== props.user.user._id)[0]);
    const [commonGroup , setCommonGroup] = useState([]);
    
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

    useEffect(() => {
        fetch(config.baseUrl + "/rooms?user=" + contact._id + "&contact=" + true , {
            method: "GET",
            headers:{
                'Authorization' : 'Bearer ' + localStorage.getItem('token')
            },
        })
        .then(resp => resp.json())
        .then(resp => {
            console.log(resp)
            if(resp.err){
                console.log(resp.err)
            }else{
                if(resp.rooms){
                    setCommonGroup(resp.rooms)
                }
            }
        })
    } , [contact])

    const renderRoom = () => {
        return commonGroup.map(room => (
            <div className="col-12 p-0">
                <div className="row middle-align" style={{height:"80px",position:"relative"}}>
                    <div className="col-3 m-auto p-0">
                        <Avatar src={room.groupDP} className={classes.large}  style={{margin:"auto"}} />
                    </div>
                    <div className="col-9 m-auto p-0">
                        <h4 className="m-0" style={{fontSize:"1.2rem"}}>{room.name}</h4>
                        <div className="m-0" >
                            <p className="m-0" style={{overflow:"hidden" ,textOverflow: "ellipsis" , whiteSpace: "nowrap" , fontSize:"0.9rem"}}>
                                {room.members.map(mem => mem.name + ", ")}
                            </p>
                        </div>
                    </div>
                    <hr className=" mt-2 mb-2 offset-2 col-10 h-0" style={{border: "1px solid #128C7E" , opacity:"0.1"}}/>
                </div>
            </div>
        ));
    }

    return (
        <div className="col-5 h-100">
            <div className="row componentHeader">
                <div className="h-100 row m-auto">
                    <div className="col-2 m-auto p-0 m-0">
                        <button id="close-button-info-view" onClick={() => props.setInfo(false)}><CloseIcon /></button>
                    </div>
                    <div className="offset-1 col-10" style={{margin:"auto" , padding:"0px"}}>
                        <h3 className="m-0 p-0">Contact info</h3>
                    </div>
                </div>
            </div>
            <div className="row infoComponent" >
                <div className="container overflow-auto scrollbar scrollbar-default h-100" >
                    <div className="row w-100 p-3" style={{height:"300px" , margin:"15px 0px 15px 0px" , boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                        <div className="col m-auto">
                            <Avatar src={config.dpBaseUrl + contact.profilePic} className={classes.xlarge} 
                            style={{margin:"auto",boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                            </Avatar>
                        </div>
                        <div className="col-12 " style={{margin:"15px 0px 15px 0px"}}>
                            <div className="row m-auto">
                                <div className="col-12 p-0" style={{border:"0px" , backgroundColor:"transparent"}}>
                                    <h5 className="p-0" style={{color:"#128C7E"}}>{contact.name}</h5>
                                </div>
                                <small className="p-0">{contact.about}</small>
                            </div>
                        </div>
                    </div>
                    <div className="row w-100 p-2" style={{ margin:"25px 0px 25px 0px" , boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                        <div className="col-12 m-auto">
                            <div className="row m-auto">
                                <p className="p-0"><small>{commonGroup.length} Groups in common</small></p>
                                {renderRoom()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactInfo;