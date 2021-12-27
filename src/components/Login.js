import "./Login.css";
import {Button} from '@material-ui/core'
import {auth,provider} from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import LogoLottie from './LogoLottie'
import { FcGoogle } from "react-icons/fc";

console.log('auth',auth)

export default function Login() {
  const [user, loading, error] = useAuthState(auth);
  
  function handelGoogleLogIn(){
      auth && auth.signInWithRedirect(provider)
  }


  return (
  <div className="app">
    <div className="login">
      <div className="login__container">
      <div className="login__text">
        {/* <img src="../../public/login-logo.png" alt="Logo" /> */}
          <LogoLottie 
            height={100}
            width={100}
          />
        
          <h1>Sign in to whatsapp clone</h1>
        </div>
        <Button 
          style={{
            fontSize: 25,
          }}
          onClick={handelGoogleLogIn}>
          Sign in with {'  '}  
          <FcGoogle
            style={{
              fontSize: 50,
            }}
          />
        </Button>
      </div>
    </div>
  </div>);
}
