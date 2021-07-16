import React, { useState } from 'react';
import config from '../config'

import { Form, FormGroup, FormText} from 'reactstrap';

import {Avatar, makeStyles} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function CreateGroupView(props){
    
    const [groupInfo , setGroupInfo] = useState({
        groupName: "",
        groupDescription: "",
        groupDP: ""
    });
    const [groupDP , setGroupDP] = useState("./images/chatBackground.png");
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

    const [openSnackBar , setOpenSnackBar] = useState(false);
    const[severity , setSeverity] = useState("");
    const [alert, setAlert] = useState("");

    const handleChange = (event) => {
        if(event.target.name === "groupName"){
            const str = groupInfo.groupName + "";
            if(str.length > 21){
                setGroupInfo(prevState => ({
                    ...prevState,
                    groupName: str.substring(0,22)
                }))
            }else{
                setGroupInfo(prevState => ({
                    ...prevState,
                    groupName: event.target.value
                }))
            }
        }else if(event.target.name === "groupDescription"){
            const str = groupInfo.groupDescription + "";
            console.log(groupInfo.groupDescription.length)
            if(str.length > 199){
                const string = str.substring(0,200)
                console.log(string)
                setGroupInfo(prevState => {
                    console.log(string)
                    return ({
                        ...prevState,
                        groupDescription: string
                    })
                })
            }else{
                setGroupInfo(prevState => ({
                    ...prevState,
                    groupDescription: event.target.value
                }))
            }
        }
    }

    const handleFileUpload = (event) => {
        if(event.target.files[0]){
            setGroupInfo(prevState => ({
                ...prevState,
                groupDP: event.target.files[0]
            }))
            const reader = new FileReader();
            reader.onload = () =>{
                if(reader.readyState === 2){
                    setGroupDP(reader.result)
                }
            }
            reader.readAsDataURL(event.target.files[0])
        }
    }

    const handleErr = (resp) => {
        setOpenSnackBar(true);
        setSeverity("error")
        setAlert(resp.status);
    }

    const handleSuccess = (resp) => {
        
        setTimeout(() => {
            props.setRooms(prevState => [resp.room , ...prevState])
            props.setView("DEFAULT");
            props.setGroupParticipants([]);
            setGroupInfo({
                groupName: "",
                groupDescription: "",
                groupDP: ""
            })
        } , 500)
  
        setOpenSnackBar(true);
        setSeverity("success");
        setAlert(resp.status);
    }

    const handleSubmit = (event) => {
        
        event.preventDefault();
        
        const arr =[props.user.user._id]
        props.groupParticipants.map(mem => arr.push(mem._id));
        const formData = new FormData();
        formData.append('name',groupInfo.groupName);
        formData.append('description',groupInfo.groupDescription);
        formData.append('groupDP',groupInfo.groupDP);
        formData.append('members', arr);

        fetch(config.baseUrl + "/rooms" , {
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
        <React.Fragment>
            <div className="row componentHeader">
                <div className="h-100 row m-auto ">
                    <button className="btn btn-lg col-1 m-auto p-0 b-0" onClick={() => props.setView("NEW_GROUP")}>
                        <i class="fa fa-lg fa-arrow-left" style={{color:"white"}}></i>
                    </button>
                    <h2 className="col-11 m-auto"> New Group </h2>
                </div>
            </div>
            <div className="row" style={{height:"88%" , backgroundColor:"#F0F0F0" , color:"#075E54"}}>
                <div className="container-fluid w-100 h-100 m-0 p-0">
                    <Form className="containerw-100 h-100 p-4" onSubmit={handleSubmit}>
                        <FormGroup className="row m-auto overlayContainer" style={{height:"50%"}}>
                            <label htmlFor="groupDP" style={{textAlign:"center" , margin:"auto"}}>
                                <div className=" h-100 text-center m-auto" style={{position:"relative" , width:"max-content"}}>
                                    <Avatar src={groupDP} className={classes.xlarge} 
                                    style={{boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                                    </Avatar>
                                    <div class="overlay" style={{width:"216px" , height:"216px" , textAlign:"center"}}>
                                        <div style={{marginTop:"35px" , marginBottom:"35px" , textAlign:"center"}}>
                                            <p className="" style={{fontSize:"2rem" , padding:"0px"}}>
                                                <i class="fa fa-camera"></i>
                                            </p>
                                            Change Profile Picture
                                        </div>
                                    </div>
                                    <input name="groupDP" id="groupDP" type="file" onChange={handleFileUpload} style={{display:"none"}} />
                                </div>
                            </label>
                        </FormGroup>
                        <FormGroup className="row m-auto" style={{height:"16%"}}>
                            <div className="p-2 m-auto">
                                <div className="col-12 m-auto">
                                    <div className="col-12 p-0" style={{border:"0px" , backgroundColor:"transparent" , fontSize:"1.8rem"}}>
                                        <input name="groupName" onChange={handleChange}
                                            className="p-0 nameGroupView" type="text" bsSize="lg" 
                                            placeholder="Group Name" value={groupInfo.groupName}
                                            style={{border:'0px', width:"90%" , backgroundColor:"transparent"}}
                                            />
                                        <hr className="m-0"></hr>
                                        {groupInfo.groupName.length > 0 && <FormText className="m-0" style={{fontSize:"1rem"}}>{23-groupInfo.groupName.length} characters left!</FormText>}
                                    </div>
                                </div>
                            </div>
                        </FormGroup>
                        <FormGroup className="row m-auto" style={{height:"16%"}}>
                            <div className="p-2 m-auto">
                                <div className="col-12 m-auto">
                                    <div className="col-12 p-0" style={{border:"0px" , backgroundColor:"transparent" , fontSize:"1.8rem"}}>
                                        <input name="groupDescription" onChange={handleChange}
                                            className="p-0 nameGroupView" type="text" bsSize="lg" 
                                            placeholder="Group Description" value={groupInfo.groupDescription}
                                            style={{border:'0px', width:"90%" , backgroundColor:"transparent"}}
                                            />
                                        <hr className="m-0"></hr>
                                        {groupInfo.groupDescription.length > 150 && <FormText >{200-groupInfo.groupDescription.length} characters left!</FormText>}
                                    </div>
                                </div>
                            </div>
                        </FormGroup>
                        <FormGroup className="row m-auto" style={{height:"18%"}}>
                            {groupInfo.groupName.length > 0 && groupInfo.groupDescription && <div className="w-100 h-25 p-2 m-0">
                                <div className="text-center">
                                    <button id="next-btn" type="submit" className=" p-0 btn btn-lg"
                                        name="CREATE_GROUP"
                                        onClick={handleSubmit}
                                        style={{
                                            width:"52px",
                                            height:"52px",
                                            border:"0px",
                                            borderRadius:"100%",
                                            backgroundColor:"#09E85E",
                                            color:'white',
                                            textAlign:"center",
                                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                                        }}>
                                            <i class="fa fa-lg fa-check"></i>
                                    </button>
                                </div>
                            </div>}
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
    );

}

export default CreateGroupView;