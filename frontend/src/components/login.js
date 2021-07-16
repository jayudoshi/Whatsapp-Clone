import React , {useEffect, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { baseUrl } from '../config';

import {Form , FormGroup , Button , Label , Input, FormFeedback} from 'reactstrap';

import { makeStyles } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

function Login(props){

  const [credentials,setCredentials] = useState({username:"",password:""});
  const [username , setUsername] = useState({
    focus: false,
    err: "",
    valid: null
  });
  const [password , setPassword] = useState({
    focus: false,
    err: "",
    valid: null
  });
  const [passwordType , setPasswordType] = useState("password");
  const classes = useStyles();
  const [openSnackBar , setOpenSnackBar] = useState(false);
  const[severity , setSeverity] = useState("");
  const [alert, setAlert] = useState("");
  // const [status , setStatus] = useState(localStorage.getItem('status') || false)

  // useEffect(() => {
  //   localStorage.setItem('status' , status);
  // } , [])

  function handleChange(event){
    setCredentials(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))
  }

  function handleFocus(event){
    if(event.target.name === "username"){
      setUsername(prevState => ({
        ...prevState,
        focus: true
      }))
    }else if(event.target.name === "password"){
      setPassword(prevState => ({
        ...prevState,
        focus: true
      }))
    }
  }

  function validate(event){
    if(event.target.name === "username"){
      if(username.focus){
        if(credentials.username === "" ){
          setUsername(prevState => ({
            ...prevState,
            err: "Username can't be empty!!",
            valid: false
          }))
        }else{
          setUsername(prevState => ({
            ...prevState,
            err:"",
            valid: true
          }))
        }
      }
    }else if(event.target.name === "password"){
      if(password.focus){
        if(credentials.password === "" ){
          setPassword(prevState => ({
            ...prevState,
            err: "Password can't be empty!!",
            valid: false
          }))
        }else{
          setPassword(prevState => ({
            ...prevState,
            err:"",
            valid: true
          }))
        }
      }
    }
  }

  function toggle(event){
    if(passwordType === "password"){
      setPasswordType("text")
    }if(passwordType === "text"){
      setPasswordType("password")
    }
  }

  function handleSuccess(resp){
    setTimeout(() => {
      props.setUser(prevState => ({
          ...prevState,
          user: resp.user,
          authenticated: true
      }))
      setCredentials({ username:"", password:""});
      setUsername({ focus: false, err: "", valid: null });
      setPassword({ focus: false, err: "", valid: null });
  } , 1000)
    setOpenSnackBar(true);
    setSeverity("success");
    setAlert(resp.status);
    localStorage.setItem('token',resp.token);
  }

  function handleErr(resp){
    if(resp.err.name === "IncorrectUsernameError"){
      setUsername(prevState => ({
        ...prevState,
        focus: true,
        err: "Incorrect Username!!",
        valid: false
      }))
      setPassword({ focus: false, err: "", valid: null });
      setCredentials(prevState => ({
        ...prevState,
        password:""
      }))
      setOpenSnackBar(true);
      setSeverity("error")
      setAlert(resp.status);
    }else if(resp.err.name === "IncorrectPasswordError"){
      setCredentials(prevState => ({
        ...prevState,
        password:""
      }))
      setUsername(prevState => ({
        ...prevState,
        focus: true,
        err: "",
        valid: true
      }))
      setPassword(prevState => ({
        ...prevState,
        focus: true,
        err: "Incorrect Password!!",
        valid: false
      }))
      setOpenSnackBar(true);
      setSeverity("error")
      setAlert(resp.status);
    }else{
      setOpenSnackBar(true);
      setSeverity("error")
      setAlert(resp.err.message);
    }
  }

  function handleSubmit(event){
    event.preventDefault();
    // setStatus(true);
    fetch(baseUrl + "/users/login" , {
      method: "POST",
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(credentials)
    })
    .then(resp => resp.json())
    .then(resp=>{
      if(resp.err){
        handleErr(resp)
      }else{
        handleSuccess(resp)
      }
    })
    .catch(err => console.log(err))
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

    return(<div className="App container-fluid h-100" >
    {props.user && props.user.authenticated && !props.user.profileSetup && <Redirect to="/overviewProfile" />}
    {props.user && props.user.authenticated && props.user.profileSetup && <Redirect to="/chat" />}
    <div className="container chatWindow form-container" >
      <div className="row h-100">
        <div className="col-5 form-container p-5 m-auto">
          <div className="">
            <h1>Login Page</h1>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label className="col" size="lg">Username</Label>
                  <Input invalid={username.focus ? username.valid === false : false} 
                    onChange={handleChange} onFocus={handleFocus} onBlur={validate} 
                    className="col" bsSize="lg" type="text" 
                    name="username" placeholder="Enter Username" 
                    value={credentials.username}
                  />
                  <FormFeedback>{username.err}</FormFeedback>
                </FormGroup>
                <FormGroup style={{position:"relative"}}>
                  <Label className="col" size="lg">Password</Label>
                  <Input invalid={password.focus ? password.valid === false : false}
                  onChange={handleChange} onFocus={handleFocus} onBlur={validate} 
                  className="col" bsSize="lg" type={passwordType} 
                  name="password" placeholder="Enter Password" 
                  value={credentials.password}
                  />
                  <a href="#" type="button" style={{position:"absolute" , bottom:"10%" , right:"3%" , border:'0px' , margin:'0px' , padding:"0px" , backgroundColor:"transparent" , color:"inherit"}}>
                    {passwordType === "password" ? <i onClick={toggle} style={{fontSize:"1.8rem"}} class="fa fa-eye"></i> : <i onClick={toggle} style={{fontSize:"1.8rem"}} class="fa fa-eye-slash"></i>}
                  </a>
                  <FormFeedback invalid>{password.err}</FormFeedback>
                </FormGroup>
                  <Button className="mt-3 w-100 rounded-pill" type="submit" size="lg block"
                    disabled={!username.valid || !password.valid}
                  >
                    Login
                  </Button>
                  <div className="text-center">
                    <Label className="" size="lg">Not a User? <Link className="nav-link d-inline navLink" to='/register'> Register Now!</Link> </Label>
                  </div>
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
  </div>)
}

export default Login;