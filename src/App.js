import React from "react";
import "./App.css";
import useWindowSize from "./hooks/useWindowSize";
import Login from './components/Login'
//import {auth} from './firebase'
//import { useAuthState } from 'react-firebase-hooks/auth';
import useAuthUser from './hooks/useAuthUser'
import Sidebar from './components/Sidebar'
import {Route,Redirect} from 'react-router-dom'
import Chat from "./components/Chat";

export default function App() {
  //const [user, loading, error] = useAuthState(auth);
  const page = useWindowSize();

  const user = useAuthUser()
  if(!user){
    return(
      <Login/>
    )
  }

  console.log({user})

  return (
    <div className="app" style={{ ...page }}>
      <Redirect to={page.isMobile ? "/chats" : "/rooms"}/>
      <div className="app__body">
        <Sidebar
          user={user}
          page={page}
        />
        <Route path="/room/:roomId">
          <Chat
            user={user}
            page={page}          
          />
        </Route>
      </div>
    </div>
  );
}
