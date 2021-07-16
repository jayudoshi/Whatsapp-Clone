import React, { useRef, useState } from 'react'
import { Redirect } from 'react-router-dom';
import { baseUrl } from '../config';

import { Button, Form, FormFeedback, FormGroup, FormText, Input, Label } from 'reactstrap';

import {Avatar, makeStyles} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function OverViewProfile(props){

    const [credentials,setCredentials] = useState({
        about:"",
        file: __dirname + "/public/images/chatBackground.png"
    });
    const [about , setAbout] = useState({
        focus: false,
        err: "",
        valid: null
    });
    const [profilePicture , setProfilePicture] = useState("./images/chatBackground.png");
    
    const [openSnackBar , setOpenSnackBar] = useState(false);
    const[severity , setSeverity] = useState("");
    const [alert, setAlert] = useState("");

    const classes = makeStyles((theme) => ({
        root: {
            width: '100%',
            '& > * + *': {
              marginTop: theme.spacing(2),
            },
        },
        xlarge: {
            width: theme.spacing(27),
            height: theme.spacing(27)
        },
      }))();

    function handleChange(event){
        const str = credentials.about + ""
        if(str.length >= 100){
            setCredentials(str.substring(0,100))
        }else{
            setCredentials( prevState => ({
                ...prevState,
                about:event.target.value
            }))
        }
    }
    
    function handleFocus(event){
        setAbout(prevState => ({
        ...prevState,
        focus: true
        }))
    }

    function validate(event){
        if(about.focus){
            if(credentials.about === "" ){
                setAbout(prevState => ({
                    ...prevState,
                    err: "Required!",
                    valid: false
                }))
            }else{
                setAbout(prevState => ({
                    ...prevState,
                    err: "",
                    valid: true
                }))
            }
        }
    }

    function handleFileUpload(e){
        if(e.target.files[0]){
            setCredentials(prevState => ({
                ...prevState,
                file: e.target.files[0]
            }))
            const reader = new FileReader();
            reader.onload = () =>{
                if(reader.readyState === 2){
                    setProfilePicture(reader.result)
                }
            }
            reader.readAsDataURL(e.target.files[0])
        }
    }

    function handleErr(resp){
        setOpenSnackBar(true);
        setSeverity("error")
        setAlert(resp.status);
    }

    function handleSuccess(resp){
        setTimeout(() => {
            props.setUser(prevState => ({
                ...prevState,
                user: resp.user,
                authenticated: true
            }))
            setCredentials({
                about:"",
                file: __dirname + "/public/images/chatBackground.png"
            });
        } , 1000)
        setOpenSnackBar(true);
        setSeverity("success");
        setAlert(resp.status);
    }

    function handleSubmit(event){
        event.preventDefault();
        const formData = new FormData();
        formData.append('about',credentials.about);
        formData.append('profilePic',credentials.file);
        fetch(baseUrl + "/users/updateProfile" , {
            method:"POST",
            headers:{
                'Authorization' : 'Bearer ' + localStorage.getItem('token')
            },
            body: formData
        })
        .then(resp => resp.json())
        .then(resp =>{
            console.log(resp);
            if(resp.err){
                handleErr(resp)
                console.log(resp.err)
            }else{
                handleSuccess(resp)
            }
        })
        .catch(err => console.log(err));

    }

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    return (
    <div className="App container-fluid h-100" >
        {props.user && !props.user.authenticated && <Redirect to="/login" />}
        {props.user && props.user.authenticated && props.user.user.profileSetup && <Redirect to="/chat" />}
        <div className="container chatWindow form-container" >
            <div className="row h-100">
                <div className="col-5 form-container m-auto" style={{padding:"3% 5%"}}>
                    <div className="h-100 w-100">
                        {console.log(props.user)}
                        <h1 style={{marginBottom:"5%"}}>Hello, {props.user.user.name}</h1>
                        
                        <Form onSubmit={handleSubmit} encType="multipart/form-data">
                            <FormGroup className="w-100 text-center">
                                <Label htmlFor="file-input" className="col" size="lg">
                                    <div style={{marginBottom:"5%"}} className="col overlayContainer">
                                        <div style={{margin:"auto" , width:"max-content" , position:"relative"}}>
                                            <Avatar src={profilePicture} className={classes.xlarge} 
                                                style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                                            </Avatar>
                                            <div class="overlay" style={{width:"216px" , height:"216px" , textAlign:"center"}}>
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
                                <input name="profilePic" id="file-input" type="file" onChange={handleFileUpload} style={{display:"none"}}></input>
                            </FormGroup>
                            <FormGroup>
                                <Label className="col" size="lg">Tell us something About You</Label>
                                <Input valid={about.focus && about.valid} 
                                    invalid={about.focus ? about.valid === false : false} 
                                    onChange={handleChange} onFocus={handleFocus} onBlur={validate} 
                                    className="col" bsSize="lg" type="text" 
                                    name="about" placeholder="About You" 
                                    value={credentials.about}
                                />
                                {credentials.about.length > 0 && <FormText >{100-credentials.about.length} characters left!</FormText>}
                                <FormFeedback>{about.err}</FormFeedback>
                            </FormGroup>
                            <Button className="mt-3 w-100 rounded-pill" type="submit" size="lg block"
                                disabled={!about.valid}
                            >
                                Save Profile
                            </Button>
                        </Form>
                    </div>
                </div>
                <div className="col-7 logo-container text-center m-auto">
                    <img width="60%" alt="Logo" src='/images/Logo.png' className="img-fluid floating align-middle" />
                </div>
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
    );
}

export default OverViewProfile;