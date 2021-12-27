import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase'

export default function useUsers(user) {
    const [snapshot, loading, error] = useCollection(
        db.collection('users').orderBy('timestamp','desc')
      )

      const users = []
      if(user){
        snapshot?.docs.forEach(doc => {
            const id = doc.id > user.uid ?
                    `${doc.id}${user.uid}` : 
                    `${user.uid}${doc.id}`
            if(doc.id !== user.uid){
                users.push({
                    id,
                    userID: doc.id,
                    ...doc.data()
                })
            }
        })
      }

    //   const rooms = snapshot?.docs.map(doc => ({
    //       id: doc.id,
    //       userID: doc.id,
    //       ...doc.data()
    //   }))
      return users
}
