import { Avatar, IconButton } from "@material-ui/core";
import React, {useState,useEffect} from "react";
import "./Sidebar.css";
import {ExitToApp} from '@material-ui/icons'
//import IconButton from 
import {auth, db, createTimestamp} from '../firebase'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import QuestionAnswerOutlinedIcon from '@material-ui/icons/QuestionAnswerOutlined';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import {NavLink, Switch, Route} from 'react-router-dom'
import SidebarList from './SidebarList'
import useRooms from "../hooks/useRooms";
import useUsers from "../hooks/useUsers";
import useChats from "../hooks/useChats"

export default function Sidebar({user, page}) {
  const [menu, setMenu] = useState(2)
  const [searchResults, setSearchResults] =useState()
  //console.log('user avatar',user?.photoURL)
  const rooms = useRooms()
  //console.log('rooms',rooms)
  const users = useUsers(user)
  const chats = useChats(user)

  const handleCreateRoom = () => {
    const roomName = prompt("Type the name of your room")
    if(roomName?.trim()){
      db.collection("rooms").add({
        name: roomName,
        timestamp: createTimestamp()
      })
    }
  }
  const handleSignOut = () => {
    auth.signOut()
  }
  const [currentUser, setCurrentUser] = useState(user)
  useEffect(() => {
    setCurrentUser(user)
  }, [user])

  let Nav;
  if(page.isMobile){
    Nav = NavLink
  }else{
    Nav = props => (
      <div  
        className={`${props.activeClass ? "sidebar__menu--selected" : ""}`}
        onClick={props.onClick}
        >
        {props.children}
      </div>
    )
  }
  const handleSearchUsersOrChats = async (event) => {
    event.preventDefault()
    const query = event.target.elements.search.value
    const userSnapshot = await db.collection('users')
            .where('name','==',query )
            .get()
    const roomSnapshot = await db.collection('rooms')
            .where('name','==',query )
            .get()     
    const userResults = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
    const roomResults = roomSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))  
    const mySearchResults = [
      ...roomResults,
      ...userResults
    ]      
    setMenu(4)
    setSearchResults(mySearchResults)
  }

  return (
    <div 
      className="sidebar"
      style={{
        minHeight: page?.isMobile ? page.height : "auto"
      }}
      >
      <div className="sidebar__header">
        <div className="sidebar__header--left">
          <Avatar src={currentUser?.photoURL} alt={currentUser?.displayName}/>
          <h4>{currentUser?.displayName}</h4>
        </div>
        <div className="sidebar__header--right">
          <IconButton onClick={handleSignOut}>
            <ExitToApp/>
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <form 
          onSubmit={handleSearchUsersOrChats}
          className="sidebar__search--container">
          <SearchOutlinedIcon/>
          <input
            placeholder="Search for users or rooms"
            type="text"
            id="search"
            />
        </form>
      </div>
      <div className="sidebar__menu">
        <Nav
          to="/chats"
          activeClassName="sidebar__menu--selected"
          onClick={()=>setMenu(1)}
          activeClass={menu === 1}
        >
          <div className="sidebar__menu--home">
            <HomeOutlinedIcon/>
            <div className="sidebar__menu--line"></div>
          </div>
        </Nav>
        <Nav
          to="/rooms"
          activeClassName="sidebar__menu--selected"
          onClick={()=>setMenu(2)}
          activeClass={menu === 2}
        >
          <div className="sidebar__menu--rooms">
            <QuestionAnswerOutlinedIcon/>
            <div className="sidebar__menu--line"></div>
          </div>
        </Nav>
        <Nav
          to="/users"
          activeClassName="sidebar__menu--selected"
          onClick={()=>setMenu(3)}
          activeClass={menu === 3}
        >
          <div className="sidebar__menu--users">
            <PeopleAltOutlinedIcon />
            <div className="sidebar__menu--line"></div>
          </div>
        </Nav>
      </div>

      {page.isMobile ? (
        <Switch>
          <Route path="/chats">
            <SidebarList title="Chats" data={chats}/>
          </Route>
          <Route path="/rooms">
            <SidebarList title="Rooms" data={rooms}/>
          </Route>
          <Route path="/users">
            <SidebarList title="Users" data={users}/>
          </Route>
          <Route path="/search">
            <SidebarList title="Search results" data={searchResults}/>
          </Route>
        </Switch>
      ) : menu === 1 ? (
        <SidebarList title="Chats" data={chats}/>
      ) : menu === 2 ? (
        <SidebarList title="Rooms" data={rooms}/>
      ) : menu === 3 ? (
        <SidebarList title="Users" data={users}/>
      ) : menu === 4 ? (
        <SidebarList title="Search results" data={searchResults}/>
      ) : null}

      <div className="sidebar__chat--addRoom">
        <IconButton 
          onClick={handleCreateRoom}
          >
          <AddCircleIcon
            sx={{ 
              color: "white", 
              backgroundColor: "#06d755", 
              borderRadius: "50%" 
            }}
            style={{
              //fill: 'green',
              //backgroundColor: 'white',
              //color: 'action',
              //color: "secondary",
              fontSize: 50,
              display: 'flex',
              justifyContent: 'flex-end'
            }}
            //style={{ color: 'green[500]' }}
            //style={{ color: green[500] }}
            //className="MuiIcon-colorAction colorAction"
          />
        </IconButton>
      </div>
    </div>);
}
