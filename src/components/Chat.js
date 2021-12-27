import React,{ useState,useRef} from "react";
import { Avatar, IconButton, Menu, MenuItem } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import useRoom from "../hooks/useRoom";
import useChatMessages from '../hooks/useChatMessages'
import "./Chat.css";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatMessages from "./ChatMessages"
import ChatFooter from "./ChatFooter"
import MediaPreview from "./MediaPreview"
import {createTimestamp, db, storage, audioStorage} from '../firebase'
import {v4} from 'uuid'
import Compressor from "compressorjs"; 
import { CircularProgress } from "@mui/material";

export default function Chat({user, page}) {
  const [input, setInput] = useState('')
  const [image, setImage] = useState(null)
  const [src, setSrc] = useState("")
  const [audioId, setAudioId] = useState("")
  const [openMenu, setOpenMenu] = useState(null)
  const [isDeleting, setDeleting] = useState(false)
  const refIconSend = useRef(image)

  const {roomId} = useParams()
  const messages = useChatMessages(roomId)
  //console.log('messages',messages)
  const room = useRoom(roomId, user.uid)
  //console.log('rooom',room)
  const history = useHistory()
  const handleBackHistory = () => {
    history.goBack()
  }

  const handleShowPreview = (event) => {
    console.log('event show',event)
    const file = event.target.files[0]
    if(file){
      setImage(file)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        setSrc(reader.result)
      }
    }
  }
  const handleClosePreview = () => {
    setSrc("")
    setImage(null)
  }
  const handleChangeInput = (event) => {
    setInput(event?.target?.value)
  }
  const handleSendMessage = async (event) => {
    event.preventDefault()
    if(input.trim() || (input === "" && image) ){
      setInput("")
      if(image){
        handleClosePreview()
      }
      const imageName = v4()
      const date = new Date().toUTCString().split(" ")
      // 23-Dec 12:34
      const datetime = date[1] +"-"+ date[2] +" "+ date[4].substr(0, 5) 
      const newMessage = image ? {
        name: user.displayName,
        message: input,
        uid: user.uid,
        timestamp: createTimestamp(),
        time: datetime,
        imageUrl: "uploading",
        imageName: imageName
      } : {
        name: user.displayName,
        message: input,
        uid: user.uid,
        timestamp: createTimestamp(),
        time: datetime,   
      }
      db.collection('users')
        .doc(user.uid)
        .collection('chats')
        .doc(roomId)
        .set({
            name: room.name,
            photoURL: room.photoURL || null,
            timestamp: createTimestamp()
        })
      const doc = await db.collection('rooms')
              .doc(roomId)
              .collection('messages')
              .add(newMessage)
      if(image){
        new Compressor(image, {
          quality: 0.8,
          maxWidth: 800,
          async success(result){
            setSrc("")
            setImage(null)
            await storage.child(imageName)
                         .put(result)
            const url = await storage.child(imageName)
                         .getDownloadURL()
            db.collection('rooms')
              .doc(roomId)
              .collection('messages')
              .doc(doc.id)
              .update({
                imageUrl: url
              })
          }
        })
      }
    }
  }

  const handleCreateRoom = () => {
    const roomName = prompt("Type the name of your room")
    if(roomName?.trim()){
      db.collection("rooms").add({
        name: roomName,
        timestamp: createTimestamp()
      })
    }
    setOpenMenu(null)
  }

  const handleDeleteRoom = async() => {
    setOpenMenu(null)
    setDeleting(true)
    try {
      const roomRef = db.collection('rooms').doc(roomId)
      const roomMessages = await roomRef.collection('messages').get()
      const audioFiles = []
      const imageFiles = []
      roomMessages.docs.forEach(doc => {
        if(doc.data().audioName){
          audioFiles.push(doc.data().audioName)
        }else if(doc.data().imageName){
          imageFiles.push(doc.data().imageName)
        }
      })
      await Promise.all([
        ...roomMessages.docs.map(doc=> doc.ref.delete()),
        ...imageFiles.map(image=> storage.child(image).delete()),
        ...audioFiles.map(audio=> audioStorage.child(audio).delete())
      ])
      db.collection('users').doc(user.uid).collection('chats').doc(roomId).delete()
      roomRef.delete()
    } catch (error) {
      console.log('Error deleting room', error.message)
    } finally {
      setDeleting(false)
      page.isMobile ? history.goBack() : history.replace('/chats')
    }
  }

  return (
    <div className="chat">
      <div 
        className="chat__background"
        style={{
          height: page.height
        }}
        />
        <div className="chat__header">
          {page.isMobile && (
            <IconButton onClick={handleBackHistory}>
              <ArrowBackIcon
                          sx={{ 
                            color: "white", 
                            backgroundColor: "#06d755", 
                            borderRadius: "50%" 
                          }}
                          style={{
                            fontSize: 40,
                            color:"#06d755", 
                            // display: 'flex',
                            // justifyContent: 'flex-end'
                          }}
              />
            </IconButton>
          )}
          <div className="avatar__container">
            <Avatar src={room?.photoURL}/>
          </div>
          <div className="chat__header--info">
            <h3
              style={{width:page.isMobile && page.width -165}}
            >{room?.name}</h3>
          </div>
          <div className="chat__header--right"
            style={{marginRight: 15,}}
          >
            <input 
              id="image"
              style={{
                display: 'none',
                
              }} 
              accept="image/*"
              type="file"
              onChange={handleShowPreview}//handleShowPreview
            />
            <IconButton>
              <label 
                htmlFor="image"
                style={{
                  cursor: 'pointer',
                  height: 24
                }}
                >
                  <AddPhotoAlternateIcon/>
              </label>
            </IconButton>
            <IconButton
              onClick={event=>setOpenMenu(event.currentTarget)}
            >
              <MoreVertIcon/>
            </IconButton>
            <Menu
              id="menu"
              keepMounted
              open={Boolean(openMenu)}
              anchorEl={openMenu}
              onClose={()=>setOpenMenu(null)}
            >
              <MenuItem
                onClick={handleDeleteRoom}
              >
                Delete room
              </MenuItem>
              <MenuItem
                onClick={handleCreateRoom}
              >
                Create room
              </MenuItem>
              <MenuItem
                onClick={handleCreateRoom}
              >
                Change avatar
              </MenuItem>
            </Menu>
          </div>
        </div>

      {/* </div> */}

      {/* <div ><div ></div>className="chat__header"> */}
            <div className="chat__body">
                <div 
                  className="chat__body--container"
                  style={{
                    height: page.height - 68
                  }}
                  >
                    <ChatMessages
                      messages={messages}
                      user={user}
                      roomId={roomId}
                      page={page}
                      audioId={audioId} 
                      setAudioId={setAudioId}
                    />
                </div>
            </div>
            <MediaPreview 
              src={src} 
              closePreview={handleClosePreview}//handleClosePreview
              />
            <ChatFooter
              input={input}
              onChange={handleChangeInput}
              sendMessage={handleSendMessage}
              image={image}
              user={user}
              room={room}
              roomId={roomId}
              setAudioId={setAudioId}
              ref={refIconSend}// || input.trim() !==""}
            />

            {isDeleting && (
              <div className="chat__deleting">
                <CircularProgress/>
              </div>
            )}
      {/* </div> */}
   </div>
    );
}
