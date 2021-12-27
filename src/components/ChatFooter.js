import React,{useState,useRef,useEffect} from "react";
import "./ChatFooter.css";
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import MicNoneOutlinedIcon from '@material-ui/icons/MicNoneOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import recordAudio from './recordAudio'
import {db,createTimestamp,audioStorage} from '../firebase'
import {v4} from 'uuid'
import { Avatar, IconButton } from "@material-ui/core";

export default function ChatFooter({
  input,
  onChange,
  sendMessage,
  image,
  user,
  room,
  roomId,
  setAudioId,
  isIconSend,
  ref
}) {
  const [isWritingText, setWritingText] = useState(false)
  const [isRecording, setRecording] = useState(false)
  const [duration, setDuration] = useState("00:00")
  const inputRef = useRef()
  const record = useRef()
  const recordingElement = useRef()
  const timerInterval = useRef()
  const btnSend = useRef()

  useEffect(() => {
    if(ref){
      setWritingText(true)
    }
  }, [ref])

  const handleStartRecording = async(event) => {
    event.preventDefault()
    record.current = await recordAudio()
    inputRef.current.focus()
    //inputRef.current.style.width = 'calc(100% - 50px)'
    setRecording(true)
    setAudioId(null)
    btnSend.current.disabled = true;
    btnSend.current.style.background = '#a9a9a9' 
    btnSend.current.style.cursor = 'not-allowed'
    
  }

  const handleStopRecording = async() => {
    inputRef.current.focus()
    clearInterval(timerInterval.current)
    const audio = record.current.stop()
    recordingElement.current.style.opacity = "0"
    setRecording(false)
    btnSend.current.disabled = false;
    btnSend.current.style.background = '#06d755'
    btnSend.current.style.cursor = 'pointer'
    
    //inputRef.current.style.width = 'calc(100% + 150px)'
    setDuration('00:00')
    return audio
  }

  const handleFinishRecording = async() => {
    const audio = await handleStopRecording()
    const {audioFile, audioUrl, play, audioName} = await audio
    sendAudio(audioFile, audioName)
  }

  const handleAudioInputChange = (event) => {
    const audioFile = event.target.files[0]
    if(audioFile){
      setAudioId('')
      sendAudio(audioFile, v4())
    }
  }

  async function sendAudio(audioFile, audioName){
    db.collection('users')
    .doc(user.uid)
    .collection('chats')
    .doc(roomId)
    .set({
        name: room.name,
        photoURL: room.photoURL || null,
        timestamp: createTimestamp()
    })
    // name: user.displayName,
    // message: input,
    // uid: user.uid,
    // timestamp: createTimestamp(),
    // time: new Date().toUTCString(),
    // imageUrl: "uploading",
    // imageName: imageName
    const date = new Date().toUTCString().split(" ")
    //const datetime = date[4].substr(0, 5) +" "+ date[1] +"-"+ date[2]
    const datetime = date[1] +"-"+ date[2] +" "+ date[4].substr(0, 5) 
    const doc = await db.collection('rooms')
            .doc(roomId)
            .collection('messages')
            .add({
              name: user.displayName,
              uid: user.uid,
              timestamp: createTimestamp(),
              time: datetime,
              audioUrl: "uploading",
              audioName: audioName
            })

        await audioStorage.child(audioName)
                     .put(audioFile)
        const url = await audioStorage.child(audioName)
                     .getDownloadURL()
        db.collection('rooms')
          .doc(roomId)
          .collection('messages')
          .doc(doc.id)
          .update({
            audioUrl: url
          })
  
  }



  useEffect(() => {
    if(isRecording){
      recordingElement.current.style.opacity = "1"
      handleStartTimer()
      record.current.start()
    }

    function handleStartTimer(){
      const startTime = Date.now()
      timerInterval.current = setInterval(setTime, 50)
  
      function setTime(){
        const timeElapsed = Date.now() - startTime
        const totalSeconds = Math.floor(timeElapsed / 1000)
        const minutes = setPad(parseInt(totalSeconds / 60))
        const seconds = setPad(parseInt(totalSeconds % 60))
        const duration = `${minutes}:${seconds}`
        setDuration(duration)
      }
    } 

  }, [isRecording])



  function setPad(value){
    return String(value).length < 2 ? `0${value}` : value
  }

  // useEffect(() => {
  //   console.log('ref',inputRef.current)
  //   // if(typeof inputRef.current === 'string' && inputRef?.current?.trim() !== ""){
  //   //   setWritingText(true)
  //   // }else{
  //   //   setWritingText(false)
  //   // }
  //   //if(!isRecording){
  //     // if(inputRef.current)
  //     //   setWritingText(false)
  //   //}
  // }, [inputRef.current])

  const handleOnChange = (event) => {
    console.log('val',event.target.value)
     if(event.target.value.length>0 && event.target.value.trim() !==""){
      setWritingText(true)
     }else if(event.target.value.length ===0 || event.target.value.trim() ===""){
      setWritingText(false)
     }

  }

  const btnIconSend = (
    <SendOutlinedIcon
      styel={{
        width: 20,
        height: 20,
        color: 'white',
        zIndex: 10
      }}
    />)

  const btnIconMic = (
    <MicNoneOutlinedIcon
        styel={{
          width: 24,
          height: 24,
          color: 'white',
          zIndex: 10
        }}        
      />
      )
    
  
  // (
  //   <>
  //     <SendOutlinedIcon
  //       styel={{
  //         width: 20,
  //         height: 20,
  //         color: 'white'
  //       }}
  //     />
  //     <MicNoneOutlinedIcon
  //       styel={{
  //         width: 24,
  //         height: 24,
  //         color: 'white'
  //       }}        
  //     />
  //   </>
  // )

  const canRecord = navigator.mediaDevices.getUserMedia && 
                    window.MediaRecorder

  const handleButtonClick = () => {
    setWritingText(false)
    if(input?.trim() || (input === "" && image)){
      return sendMessage
    } else{
      return handleStartRecording
    }
  }

  return (
    <div className="chat__footer">
      <form 
      
        >
          <input
            ref={inputRef}
            value={input}
            onChange={!isRecording ? onChange: null}
            placeholder="type a message" 
            onKeyDown={handleOnChange}
            />
          {canRecord ? (
            <button 
              ///disabled={isRecording === true ?"true":"false"}
              disabled={isRecording}
              ref={btnSend}
              onClick={
                input?.trim() || (input === "" && image) 
                ? sendMessage
                : handleStartRecording
              }
              type="submit" 
              className="send__btn">
              {isWritingText && input ? 
                <IconButton >
                  <SendOutlinedIcon
                  styel={{
                    width: 20,
                    height: 20,
                    color: 'white',
                    zIndex: 10
                  }}
                />
                </IconButton>
               :  
               <IconButton 
                  disabled={isRecording}
                //disabled={isRecording?"true":"false"}
               >
                <MicNoneOutlinedIcon
                      styel={{
                        width: 24,
                        height: 24,
                        color: 'white',
                        zIndex: 10
                      }}        
                    />
                </IconButton>}
            </button>
          ) : (
            <>
              <label htmlFor="capture" className="send__btn">
              <MicNoneOutlinedIcon
                      styel={{
                        width: 24,
                        height: 24,
                        color: 'white',
                        zIndex: 10
                      }}        
                    />
              </label>
              <input 
                style={{
                  display: 'none'
                }}
                type="file"
                id="capture" 
                accept="audio/*"
                capture
                onChange={handleAudioInputChange}
                />
            </>
          )}
      </form>
      {isRecording && (
        <div className="record" ref={recordingElement}>
          <CancelOutlinedIcon
            style={{
              width: 30,
              height: 30,
              color: '#f20519'
            }}
            onClick={handleStopRecording}
          />
          <div>
            <div className="record__redcircle"/>
            <div className="record__duration">{duration}</div>
          </div>
          <CheckCircleOutlineOutlinedIcon
            style={{
              width: 30,
              height: 30,
              color: '#41bf44'
            }}
            onClick={handleFinishRecording}
          />
        </div>
      )}
    </div>
  )
}
