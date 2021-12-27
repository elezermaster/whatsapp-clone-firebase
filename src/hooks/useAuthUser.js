import React, {useEffect} from 'react'

import {auth, db, createTimestamp} from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth';

export default function useAuthUser() {
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if(user){
            const ref = db.collection('users').doc(user?.uid)
            ref.get().then(doc => {
                console.log('doc',doc)
                if(!doc.exists){
                    ref.set({
                        name: user.displayName,
                        photoURL: user.photoURL,
                        timestamp: createTimestamp()
                    })
                }
            })
        }
        return () => {}
    }, [user])
    return user;
}
