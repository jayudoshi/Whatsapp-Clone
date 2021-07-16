import React, { useEffect, useState } from 'react';
import config from '../config'

import $ from 'jquery'

import {Avatar, makeStyles} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

function NewGroupView(props){
    
    const [contacts , setContacts] = useState([]);
    const[users , setUsers] = useState([]);
    const [searchText , setSearchText] = useState("");
    // const [groupParticipants , setGroupParticipants] = useState([]);
    const classes = makeStyles((theme) => ({
        large: {
          width: theme.spacing(7),
          height: theme.spacing(7),
        },
        small: {
          width: theme.spacing(4),
          height: theme.spacing(4),
        },
        root: {
            display: 'flex',
            '& > *': {
              margin: theme.spacing(1),
            },
        },
    }))();

    useEffect(() => {
        fetchContact();
        fetchUser()
    } , [searchText])

    const fetchContact =() => {
        fetch(config.baseUrl + "/users/contacts" , {
            method:"GET",
            headers:{
                'Authorization' : 'Bearer ' + localStorage.getItem('token')
            },
        })
        .then(resp => resp.json())
        .then(resp => {
            console.log(resp)
            if(resp.err){
                console.log("err")
            }else{
                // if(resp.users.length !== 0){
                //     setLoadMore(true)
                // }
                console.log(resp.contacts)
                setContacts(resp.contacts)
            }
        })
    }

    const fetchUser =() => {
        fetch(config.baseUrl + "/users?searchText=" + searchText , {
            method:"GET",
            headers:{
                'Authorization' : 'Bearer ' + localStorage.getItem('token')
            },
        })
        .then(resp => resp.json())
        .then(resp => {
            console.log(resp)
            if(resp.err){
                console.log("err")
            }else{
                if(resp.users.length !== 0){
                    // setLoadMore(true)
                }
                console.log(resp.users)
                setUsers(resp.users)
            }
        })
    }

    const handleChange =(event) => {
        if(event.target.name === "searchInput"){
            setSearchText(event.target.value)
        }
    }

    // const handleContactClick = (event) => {
    //     const name = event.currentTarget.getAttribute("name");
    //     setGroupParticipants(prevState => {
    //         return [...prevState , name];
    //     })
    // }

    const handleNextClick = (event) => {
        const view = event.currentTarget.name;
        props.setView(view)
    }

    const renderGroupParticipants = () => props.groupParticipants.map(participant => (
        <div className="p-0 rounded-pill" style={{backgroundColor:"#E6E6E6" ,width:"max-content" , margin:"3px" , height:"32px"}}>
            <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap',}}>
                <Avatar className={classes.small} src={config.dpBaseUrl + participant.profilePic}></Avatar>
                <h5 className="d-inline" style={{margin:"auto 2px"}}>{participant.name}</h5>
                <button id="close-button" name={participant._id} 
                onClick={() => {props.setGroupParticipants(props.groupParticipants.filter(mem => mem !== participant))}}>
                    <CloseIcon />
                </button>
            </div>
        </div>
    ));

    const renderContacts = () => {
        const renderContact = (contacts) => contacts.map(contact => (
            <div key={contact._id + ""} onClick={() => {props.setGroupParticipants(prevState => {return [...prevState , contact];})}} name={contact._id} className="row middle-align user-contact-room" style={{height:"90px"}}>
                <div className="col-2 m-auto">
                    <Avatar className={classes.large}  style={{margin:"auto"}} 
                        src={config.dpBaseUrl + contact.profilePic}/>
                </div>
                <div className="col-10 m-auto  ">
                    <h4 className="m-0">{contact.name}</h4>
                    <div className="m-0" >
                        <p className="m-0">{contact.about}</p>
                    </div>
                </div>
                <hr className=" mt-2 mb-2 offset-2 col-10 h-0" style={{border: "1px solid #128C7E" , opacity:"0.1"}}/>
            </div>
        ))
        return searchText === "" ? renderContact(contacts.filter(contact => !props.groupParticipants.includes(contact))) : renderContact(contacts.filter(contact => compareString(contact.name) && !props.groupParticipants.includes(contact)));
    }

    const renderUsers = () => {
        const renderUser = (users) => users.map(user => (
            <div key={user._id + ""} onClick={() => {props.setGroupParticipants(prevState => {return [...prevState , user];})}} name={user._id} className="row middle-align user-contact-room" style={{height:"90px"}}>
                <div className="col-2 m-auto">
                    <Avatar className={classes.large}  style={{margin:"auto"}} 
                        src={config.dpBaseUrl + user.profilePic}/>
                </div>
                <div className="col-10 m-auto  ">
                    <h4 className="m-0">{user.name}</h4>
                    <div className="m-0" >
                        <p className="m-0">{user.about}</p>
                    </div>
                </div>
                <hr className=" mt-2 mb-2 offset-2 col-10 h-0" style={{border: "1px solid #128C7E" , opacity:"0.1"}}/>
            </div>
        ))
        
        const arr = users.filter(user => !props.groupParticipants.some(mem => mem._id === user._id) && !contacts.some(contact => contact._id === user._id) && props.user.user._id !== user._id);
        const arrSearchText = users.filter(user => compareString(user.name) && !props.groupParticipants.some(mem => mem._id === user._id) && !contacts.some(contact => contact._id === user._id)  && props.user.user._id !== user._id)
        return searchText === "" ? renderUser(arr) : renderUser(arrSearchText);
    }

    const compareString =(name) =>{
        return name.toLowerCase().includes(searchText.toLowerCase())
        // return true
    }

    useEffect(() => {
        if(!localStorage.getItem('scrollbar')){
            $("#newGrpSideBar").scroll(() => {
                const scrollTop = Math.floor($("#newGrpSideBar").scrollTop() + $("#newGrpSideBar").height());
                const totalHeight = $("#newGrpSideBarContent").height() - 2;
                if(scrollTop >= totalHeight){
                    console.log("event called")
                    let url = "";
                    if(searchText === "")
                        url = config.baseUrl + "/users?contactLength=" + users.length
                    else
                        url = config.baseUrl + "/users?searchText=" + searchText + "&contactLength=" + users.length
                    fetch(url , {
                        method:"GET",
                        headers:{
                            'Authorization' : 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                    .then(resp => resp.json())
                    .then(resp => {
                        console.log(resp)
                        if(resp.err){
                            console.log(resp.err)
                        }else{
                            console.log("Hello")
                            const arr = resp.users.filter(User => {
                                return users.map(user => {
                                    return user._id === User._id
                                }).length > 0
                            });
                            const Arr = arr.filter(element => !users.includes(element));
                            setUsers(prevState => {
                                if(resp.users.length === 0)
                                    localStorage.setItem('scrollbar','true')
                                return [...prevState , ...Arr]
                            })
                            
                            if(resp.users.length === 0){
                                localStorage.setItem('scrollbar',true)
                                $("#newGrpSideBar").off('scroll' , () => {
                                    alert("Removing Listener")
                                })
                            }
                        }
                    })
                }
            })
        }
        
        return () => {
            localStorage.removeItem('scrollbar')
            $("#newGrpSideBar").off('scroll')
        }
    })

    return (
        <React.Fragment>
            <div className="row componentHeader">
                <div className="h-100 row m-auto ">
                    <button className="btn btn-lg col-1 m-auto p-0 b-0" onClick={props.handleBackClick}>
                        <i class="fa fa-lg fa-arrow-left" style={{color:"white"}}></i>
                    </button>
                    <h2 className="col-11 m-auto"> Add Group Participants </h2>
                </div>
            </div>
            <div className="row roomContainer overflow-auto" id="newGrpSideBar" >
                <div className="container" id="newGrpSideBarContent">
                    <div className="row">
                        {renderGroupParticipants()}
                    </div>
                    <div className="row p-2" style={{ height:"80px" , paddingBottom:"0px"}}>
                        <div className="col m-auto w-80 p-2 m-0" style={{backgroundColor: "transparent"}}>
                            <label htmlFor="conatactSerachInput" className="w-10" style={{width:"5%"}}><i class="fa fa-search icon"></i></label>
                            <input onChange={handleChange} autoComplete="off" 
                                id="contactSerachInput" type="text" name="searchInput" 
                                value={searchText} placeholder="Type Contact Name"  >
                            </input>
                        </div>
                        <hr></hr>
                    </div>
                    {contacts.length > 0 && <div className="row">
                        <p>Your Contacts</p>
                        {renderContacts()}
                    </div>}
                    <div className="row">
                        <p>Other Users</p>
                        {renderUsers()}
                    </div>
                </div>
                {props.groupParticipants.length > 0 && <button id="next-btn" type="button" className="p-0 btn btn-lg"
                name="CREATE_GROUP"
                onClick={handleNextClick}
                style={{
                    width:"72px",
                    height:"72px",
                    border:"0px",
                    borderRadius:"100%",
                    backgroundColor:"#09E85E",
                    color:'white',
                    position: "absolute",
                    bottom: "20px",
                    right:"20px",
                    fontSize:"2rem",
                    textAlign:"center",
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                }}>
                    <i class="fa fa-lg fa-arrow-right"></i>
                </button>}
            </div>
        </React.Fragment>
    );

};

export default NewGroupView;