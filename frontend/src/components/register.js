import React , {useState} from 'react';
import { Redirect , Link } from 'react-router-dom';
import { baseUrl } from '../config';

import {Form , FormGroup , Button , Label , Input, FormFeedback} from 'reactstrap'

import { makeStyles } from '@material-ui/core/styles';
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

function Register(props){

  const [credentials,setCredentials] = useState({username:"",password:"",name:""});
  const [username , setUsername] = useState({
    focus: false,
    err: "",
    valid: null
  });
  const [name , setName] = useState({
    focus: false,
    err: "",
    valid: null
  })
  const [password , setPassword] = useState({
    focus: false,
    err: "",
    valid: null
  });
  const classes = useStyles();
  const [openSnackBar , setOpenSnackBar] = useState(false);
  const[severity , setSeverity] = useState("");
  const [alert, setAlert] = useState("");
  const [status , setStatus] = useState(false)

  
  function handleChange(event){
    setCredentials(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))
  }

  function handleFocus(event){
    // console.log(event.target.name)
    if(event.target.name === "username"){
      setUsername(prevState => ({
        ...prevState,
        focus: true
      }))
    }else if(event.target.name === "name"){
      setName(prevState => ({
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
        }else if(credentials.username.length < 2){
          setUsername(prevState => ({
            ...prevState,
            err: "Username should be minimumm of 2 characters long!!",
            valid: false
          }))
        }else if(credentials.username.length >= 48){
          setUsername(prevState => ({
            ...prevState,
            err: "Username can be maximum of 48 characters long!!",
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
    }else if(event.target.name === "name"){
      if(name.focus){
        if(credentials.name === "" ){
          setName(prevState => ({
            ...prevState,
            err: "Name can't be empty!!",
            valid: false
          }))
        }else if(credentials.name.length < 2){
          setName(prevState => ({
            ...prevState,
            err: "Name should be minimumm of 2 characters long!!",
            valid: false
          }))
        }else if(credentials.name.length >= 22){
          setName(prevState => ({
            ...prevState,
            err: "Name can be maximum of 22 characters long!!",
            valid: false
          }))
        }else{
          setName(prevState => ({
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
        }else if(credentials.password.length < 8){
          setPassword(prevState => ({
            ...prevState,
            err: "Password should be minimumm of 8 characters long!!",
            valid: false
          }))
        }else if(credentials.password.length >= 22){
          setPassword(prevState => ({
            ...prevState,
            err: "Password can be maximum of 22 characters long!!",
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

  function handleErr(resp){
    if(resp.err.name === "UserExistsError"){
      setUsername(prevState => ({
        ...prevState,
        focus: true,
        err: "Username already exists!!",
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
    }
  }

  function handleSuccess(resp){
    setTimeout(() => {
      setStatus(true);
    } , 1000)
    setOpenSnackBar(true);
    setSeverity("success");
    setAlert(resp.status);
    // return  <Redirect  to="/login/" />
    setCredentials({ username:"", password:"", name:"" });
    setUsername({ focus: false, err: "", valid: null });
    setPassword({ focus: false, err: "", valid: null });
    setName({focus: false, err: "", valid: null});
  }

  function handleSubmit(event){
    event.preventDefault();
    fetch(baseUrl + '/users/register' , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username:credentials.username,
        name: credentials.name,
        password:credentials.password
      })
    })
    .then(resp => {
      return resp.json()
    })
    .then(resp => {
      if(!resp.success){
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
    {props.user.authenticated && !props.user.profileSetup && <Redirect to="/overviewProfile" />}
    {props.user.authenticated && props.user.profileSetup && <Redirect to="/chat" />}
    {status && <Redirect to="/login" />}
    <div className="container chatWindow form-container" >
      <div className="row h-100">
        <div className="col-5 form-container p-5 m-auto">
          <div className="">
            <h1>Register Page</h1>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label className="col" size="lg">Username</Label>
                  <Input valid={username.focus && username.valid} 
                    invalid={username.focus ? username.valid === false : false} 
                    onChange={handleChange} onFocus={handleFocus} onBlur={validate} 
                    className="col" bsSize="lg" type="text" 
                    name="username" placeholder="Enter Username" 
                    value={credentials.username}
                  />
                  <FormFeedback>{username.err}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label className="col" size="lg">Name</Label>
                  <Input valid={name.focus && name.valid} 
                  invalid={name.focus ? name.valid === false : false}
                  onChange={handleChange} onFocus={handleFocus} onBlur={validate} 
                  className="col" bsSize="lg" type="text" 
                  name="name" placeholder="Enter Name" 
                  value={credentials.name}
                  />
                  <FormFeedback invalid>{name.err}</FormFeedback>
                </FormGroup>
                <FormGroup style={{position:"relative"}}>
                  <Label className="col" size="lg">Password</Label>
                  <Input valid={password.focus && password.valid} 
                  invalid={password.focus ? password.valid === false : false}
                  onChange={handleChange} onFocus={handleFocus} onBlur={validate} 
                  className="col" bsSize="lg" type="password" 
                  name="password" placeholder="Enter Password" 
                  value={credentials.password}
                  />
                  <FormFeedback invalid>{password.err}</FormFeedback>
                </FormGroup>
                  <Button className="mt-3 w-100 rounded-pill" type="submit" size="lg block"
                    disabled={!username.valid || !name.valid || !password.valid}
                  >
                    Register
                  </Button>
                  <div className="text-center">
                    <Label className="" size="lg">Already a User? <Link className="nav-link d-inline navLink" to='/login'> Login Now!</Link> </Label>
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

export default Register;