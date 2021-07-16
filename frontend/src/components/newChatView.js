import React, { useEffect, useState } from 'react';
import config from '../config'

import {Avatar, makeStyles} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

function NewChatView(props){
    
    const [contacts , setContacts] = useState([]);
    const [searchText , setSearchText] = useState("");
    const [loadMore , setLoadMore] = useState(true);
    const classes = makeStyles((theme) => ({
        large: {
            width: theme.spacing(7),
            height: theme.spacing(7),
        }
    }))();

    const [openSnackBar , setOpenSnackBar] = useState(false);
    const[severity , setSeverity] = useState("");
    const [alert, setAlert] = useState("");

    useEffect(() => {
        fetchContact()
    } , [searchText])

    const fetchContact =() => {
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
                    setLoadMore(true)
                }
                setContacts(resp.users)
            }
        })
    }

    const handleErr = (resp) => {
        setOpenSnackBar(true);
        setSeverity("error")
        setAlert(resp.status);
        setTimeout(() => {
            if(resp.success){
                props.setView("DEFAULT");
                //setChatView
            }
        },500)
    }

    const handleSuccess = (resp) => {
        setTimeout(() => {
            props.setRooms(prevState => [resp.room , ...prevState])
            props.setView("DEFAULT");
            setSearchText("")
        } , 500)
  
        setOpenSnackBar(true);
        setSeverity("success");
        setAlert(resp.status);
    }

    const handleContactClick = (contact) => {
        console.log(contact)
        console.log(contact.about)
        const doc = {
            group: false,
            members:[props.user.user._id , contact._id]
        }
        console.log(doc)
        fetch(config.baseUrl + "/rooms/createChat" , {
            method:"POST",
            headers:{
                'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                'Content-type' : 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(doc)
        })
        .then(resp => resp.json())
        .then(resp =>{
            console.log(resp);
            if(resp.err){
                handleErr(resp)
            }else{
                handleSuccess(resp)
            }
        })
        .catch(err => console.log(err));
    }

    const handleChange =(event) => {
        if(event.target.name === "searchInput"){
            setSearchText(event.target.value)
        }
    }

    const handleLoadMore = (event) => {
        let url = "";
        if(searchText === "")
            url = config.baseUrl + "/users?contactLength=" + contacts.length
        else
            url = config.baseUrl + "/users?searchText=" + searchText + "&contactLength=" + contacts.length
        fetch(url , {
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
                console.log(resp.users)
                console.log(resp.users.length)
                if(resp.users.length === 0){
                    setLoadMore(false)
                }
                if(resp.users){
                    setContacts(prevState => (
                        [...prevState , ...resp.users]
                    ))
                }
            }
        })
    }

    const renderContacts = () => contacts.filter(contact => contact._id !== props.user.user._id).map(contact =>(
        <div key={contact._id} onClick={() => handleContactClick(contact) } name={contact._id} className="row middle-align user-contact-room" style={{height:"90px"}}>
            <div className="col-2 m-auto">
                <Avatar className={classes.large}  style={{margin:"auto"}}
                src={config.dpBaseUrl + contact.profilePic}></Avatar>
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

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    return (
        <React.Fragment>
            <div className="row componentHeader">
                <div className="h-100 row m-auto ">
                    <button className="btn btn-lg col-1 m-auto p-0 b-0" onClick={props.handleBackClick}>
                        <i class="fa fa-lg fa-arrow-left" style={{color:"white"}}></i>
                    </button>
                    <h2 className="col-11 m-auto"> New Chat </h2>
                </div>
            </div>
            <div className="row roomContainer overflow-auto" >
                <div className="container">
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
                    <div  onClick={() => {props.setView("NEW_GROUP")}} name="createGroup" className="row middle-align newGroupBtn" style={{height:"90px"}}>
                        <div className="col-2 m-auto">
                            <Avatar className={classes.large}  style={{margin:"auto" , backgroundColor:"#075e54"}}>
                                <GroupAddIcon />
                            </Avatar>
                        </div>
                        <div className="col-10 m-auto  ">
                            <h4 className="m-0">New Group</h4>
                        </div>
                        <hr className=" mt-2 mb-2 offset-2 col-10 h-0" style={{border: "1px solid #128C7E" , opacity:"0.1"}}/>
                    </div>
                    {renderContacts()}
                    <div className="w-100 text-center">
                        {loadMore && <button className="p-0 m-auto" onClick={handleLoadMore} 
                            style={{color:"#128C7E" , textDecoration:"underline" , border:"0px" , textDecorationColor:"#128C7E"}}>
                            load more
                        </button>}
                        {!loadMore && <p className="p-0 m-auto" style={{color:"#128C7E" , textDecoration:"underline" , textDecorationColor:"#128C7E"}}>No More Users Exists</p>}
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
            </div>
        </React.Fragment>
    );
}

export default NewChatView;