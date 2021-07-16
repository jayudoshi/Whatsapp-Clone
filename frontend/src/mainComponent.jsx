import React, { useEffect, useState } from 'react';

import { Switch , Route , Redirect } from 'react-router-dom'

import ChatWindow from './components/chatWindow';
import Login from './components/login';
import Register from './components/register';
import OverViewProfile from './components/overViewProfile';

function Main(props){

    const [user , setUser] = useState(JSON.parse(localStorage.getItem('user')) || {
        user:{},
        authenticated: false
    });

    useEffect(() => {
        console.log("Use Effect get Called !! and add user to localstorage")
        // console.log(JSON.stringify(user))
        localStorage.setItem('user',JSON.stringify(user))

        return () => {
            console.log("Calling Clean Up")
            // localStorage.removeItem('user',user)
        }
    } , [user])

    const renderRegister = () => {
        return <Register user={user} />
    }

    const renderLogin = () => {
        return <Login user={user} setUser={setUser}/>
    }

    const renderOverviewProfile = () => {
        return <OverViewProfile user={user} setUser={setUser} />
    }

    const renderChat = () => {
        return <ChatWindow user={user} setUser={setUser} />
    }

    return (
        <Switch>
              <Route path="/register" component={renderRegister} />
              <Route path="/login" component={renderLogin} />
              <Route path="/chat" component={renderChat} />
              <Route path="/overviewProfile" component={renderOverviewProfile} />
              <Redirect to="/register" />
        </Switch>
    )
}

export default Main