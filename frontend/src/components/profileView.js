import React, { useEffect, useState } from 'react';
import config from '../config'

import { Form, FormGroup, Label , Input } from 'reactstrap';

import {Avatar, makeStyles} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DoneIcon from '@material-ui/icons/Done'; 
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


function ProfileView(props){

    //Required
    const [updatedName , setUpdatedName] = useState("");
    const [updatedAbout , setUpdatedAbout] = useState("");

    const [previewDP , setPreviewDP] = useState("");

    const [openSnackBar , setOpenSnackBar] = useState(false);
    const[severity , setSeverity] = useState("");
    const [alert, setAlert] = useState("");

    const [disabledName , setDiasbledName] = useState(true);
    const [disabledAbout , setDiasbledAbout] = useState(true);
    const classes = makeStyles((theme) => ({
        xlarge: {
            width: theme.spacing(27),
            height: theme.spacing(27)
        },
      }))();
    
    useEffect(() => {
        setDiasbledName(true)
        setDiasbledAbout(true)
    } ,[])

    function fetchRequest(fieldName , fieldValue){
        const formData = new FormData();
        formData.append(fieldName , fieldValue)
        fetch(config.baseUrl + "/users/updateProfile" , {
            method:"PUT",
            headers:{
                'Authorization' : 'Bearer ' + localStorage.getItem('token')
            },
            body: formData
        })
        .then(resp => resp.json())
        .then(resp => {
            console.log(resp)
            if(resp.err){
                setOpenSnackBar(true);
                setSeverity("error");
                setAlert(resp.status);
            }else{
                setOpenSnackBar(true);
                setSeverity("success");
                setAlert(resp.status);
                setTimeout(() => {
                    props.setUser(prevState => ({
                        ...prevState,
                        user: resp.user,
                        authenticated: true
                    }))
                    setUpdatedAbout("");
                    setUpdatedAbout("");
                } , 1000)
            }
        })
    }

    function handleClick(event){
        console.log("OGt called")
        if(event.currentTarget.getAttribute('name') === "nameProfilebtn"){
            setDiasbledName(true);
            if(updatedName !== props.user.user.name){
                fetchRequest("name" , updatedName)
            }
        }
        if(event.currentTarget.getAttribute('name') === "aboutProfilebtn"){
            setDiasbledAbout(!disabledAbout)
            if(updatedAbout !== props.user.user.about){
                fetchRequest("about" , updatedAbout)    
            }
        }
    }

    function handleFileUpload(event){
        if(event.target.files[0]){
            
            const reader = new FileReader();
            reader.onload = () =>{
                if(reader.readyState === 2){
                    setPreviewDP(reader.result)
                }
            }
            reader.readAsDataURL(event.target.files[0])

            const formData = new FormData();
            formData.append('profilePic',event.target.files[0]);
            fetch(config.baseUrl + "/users/updateProfile" , {
                method:"PUT",
                headers:{
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                },
                body: formData
            })
            .then(resp => resp.json())
            .then(resp =>{
                console.log(resp);
                if(resp.err){
                    setOpenSnackBar(true);
                    setSeverity("error");
                    setAlert(resp.status);
                }else{
                    setTimeout(() => {
                        props.setUser(prevState => ({
                            ...prevState,
                            user: resp.user,
                            authenticated: true
                        }))
                        setUpdatedAbout("");
                        setUpdatedAbout("");
                    } , 1000)
                    setPreviewDP("")
                    setOpenSnackBar(true);
                    setSeverity("success");
                    setAlert(resp.status);
                }
            })
            .catch(err => console.log(err));
        }
    }
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
                    <h2 className="col-11 m-auto"> Profile </h2>
                </div>
            </div>
            <div className="row" style={{height:"88%" , backgroundColor:"#F0F0F0" , color:"#075E54"}}>
                <div className="container-fluid w-100 h-100 m-0 p-0">
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <FormGroup className="text-center mt-4">
                            <Label htmlFor="file-Input">
                                <div className="row w-100 h-50 m-0 p-0 overlayContainer">
                                    <div className="col m-auto p-0" style={{position:"relative"}}>
                                        <Avatar 
                                            src={ previewDP !== "" ? previewDP : config.dpBaseUrl + props.user.user.profilePic} 
                                            className={classes.xlarge} 
                                            style={{margin:"auto",boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                                        </Avatar>
                                        <div class="overlay" style={{width:"216px" , height:"216px"}}>
                                            <div style={{marginTop:"35px" , marginBottom:"35px" , textAlign:"center"}}>
                                                <p className="" style={{fontSize:"2rem" , padding:"0px"}}>
                                                    <i class="fa fa-camera"></i>
                                                </p>
                                                Change Profile Picture
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Label>
                            <input name="profilePic" id="file-Input" type="file" onChange={handleFileUpload} style={{display:"none"}} />
                        </FormGroup>
                        <FormGroup className="mt-4">
                            <div className="row w-100 h-25 p-2 m-0">
                                <div className="col-12 m-auto">
                                    <p><small>Your Name</small></p>
                                    <div className="row m-auto">
                                        <div className="col-11 p-0" style={{border:"0px" , backgroundColor:"transparent"}}>
                                            <input disabled={disabledName} id="nameProfileView" 
                                                onChange={(e) => {setUpdatedName(e.target.value)}}
                                                className="p-0" type="text" bsSize="lg" 
                                                placeholder={props.user.user.name} autoComplete="off"
                                                value={updatedName}
                                                style={{border:'0px', width:"90%" , backgroundColor:"transparent" }}
                                                />
                                            {!disabledName && <hr style={{margin:"1px 0px 0px 0px"}}></hr>}
                                        </div>
                                        <button type="submit" id="nameProfileBtn" className="p-0 col-1 m-auto text-center btn-lg"
                                            style={{backgroundColor:"transparent" , border:"0px" , outlineColor:'none' , color:"#075E54"}}
                                        >
                                            {disabledName ? 
                                                <p className="p-0 m-0" onClick={() => {setDiasbledName(false)}}>
                                                    <CreateIcon />
                                                </p>  
                                                : 
                                                <p className="p-0 m-0" name="nameProfilebtn" onClick={handleClick}>
                                                    <DoneIcon />
                                                </p>
                                            }
                                        </button>
                                    </div>
                                </div>
                                <hr style={{width:"10%" , margin:"auto" , height:"0px" , borderTop:"10px dotted #075E54" , backgroundColor:"transparent"}}></hr>
                            </div>
                        </FormGroup>
                        <FormGroup className="mt-4">
                            <div className="row w-100 h-25 p-2 m-0">
                                <div className="col-12 m-auto">
                                    <p><small>About</small></p>
                                    <div className="row m-auto">
                                        <div className="col-11 p-0" style={{border:"0px" , backgroundColor:"transparent"}}>
                                            <input disabled={disabledAbout} id="aboutProfileView"
                                                onChange={(e) => {setUpdatedAbout(e.target.value)}}
                                                className="p-0" type="text" bsSize="lg" 
                                                placeholder={props.user.user.about} autoComplete="off"
                                                value={updatedAbout}
                                                style={{border:'0px', width:"90%" , backgroundColor:"transparent" }}
                                                />
                                            {!disabledAbout && <hr style={{margin:"1px 0px 0px 0px"}}></hr>}
                                        </div>
                                        <button type="button" id="aboutProfileBtn" className="p-0 col-1 m-auto text-center btn-lg"
                                            style={{backgroundColor:"transparent" , border:"0px" , outlineColor:'none' , color:"#075E54"}}
                                        >
                                            {disabledAbout ? 
                                                <p className="p-0 m-0" onClick={() => {setDiasbledAbout(false)}}>
                                                    <CreateIcon />
                                                </p>  
                                                : 
                                                <p className="p-0 m-0" name="aboutProfilebtn" onClick={handleClick}>
                                                    <DoneIcon />
                                                </p>
                                            }
                                        </button>
                                    </div>
                                </div>
                                <hr className="p-2 m-auto" style={{width:"10%" , margin:"auto" , height:"0px" , borderTop:"10px dotted #075E54" , backgroundColor:"transparent"}}></hr>
                            </div>
                        </FormGroup>
                    </Form>
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
    )
}

export default ProfileView;