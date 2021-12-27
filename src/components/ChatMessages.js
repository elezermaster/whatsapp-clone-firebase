import React,{useRef,useEffect} from "react";
import { CircularProgress } from "@material-ui/core"
import AudioPlayer from './AudioPlayer'
//import ScrollableFeed from 'react-scrollable-feed'
//import { css } from '@emotion/css';
//import ScrollToBottom from 'react-scroll-to-bottom';

export default function ChatMessages({
  messages,
  user,
  roomId,
  page,
  audioId,
  setAudioId,
}) {
  //console.log('page', page.width)
  const scrollToBottomRef = useRef();

  useEffect(() => {
    if (scrollToBottomRef.current) {
      scrollToBottomRef.current.scrollIntoView(
        {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        })
    }
  })

  // const ROOT_CSS = css({
  //   height: page.height,
  //   width: page.width
  // });

  return ( messages ?
    messages.map(message => {
      const isSender = message.uid === user.uid
      //const margin = isSender ? page.isMobile ? page.width - 400 :  page.width*0.10 : 0
      return (
        
        <div
          
          className="chat__message--container">
        {/* <ScrollableFeed> */}
        {/* <ScrollToBottom className={ROOT_CSS}> */}
        <div
          key={message.id}
          style={{
          //  marginLeft: margin
          }}
          className={`chat__message ${isSender ? 'chat__message--sender' : 'chat__message--receiver'}`}>
          {/* <div className={``}> */}
          <span className="chat__name">
            {message.name}
          </span>
          {message.imageUrl === "uploading" ? (
              <div className="image-container">
                <div className="image__container--loader">
                  <CircularProgress
                    style={{
                      width: 40,
                      height: 40
                    }}
                  />
                </div>
              </div>
            ) : message.imageUrl ? (
              <div className="image__container">
                <img src={message.imageUrl} alt={message.name} />
              </div>
            ) : null
          }

          {message.audioName ? (
            <AudioPlayer
              sender={isSender}
              roomId={roomId}
              id={message.id}
              audioUrl={message.audioUrl}
              audioId={audioId} 
              setAudioId={setAudioId}
            />
          ): (
            <span className="chat__message--message">
              {message.message}
            </span>
          )}

            <span className="chat__timestamp">
              {message.time}
            </span>
            {/* </div> */}
        {/* </ScrollToBottom> */}
        <div ref={scrollToBottomRef}/>
        {/* </ScrollableFeed> */}
        </div>
        </div> 
        
      )
    })
  : "loading...")
}

