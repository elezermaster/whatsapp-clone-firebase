import React, { useEffect, useRef } from 'react';
import lottie from "lottie-web";
import animationData from '../assets/lottie/86582-chat.json';

const LogoLottie = () => {
    const anime = useRef(null);
    useEffect(() => {
        lottie.loadAnimation({
          container: anime.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: animationData,
        });
        //Now we have to cleanup the useEffect() hook, 
        //this is because we want to stop the animation 
        //as soon as the component unmounts.
        return () => lottie.stop();
      }, []);
    return (
        <div 
            style={{ 
                height: 250, 
                width: 300,
                margin: 'auto',
                marginBottom: 20,
            }} 
            ref={anime}>
            
        </div>
    );
};

export default LogoLottie;
