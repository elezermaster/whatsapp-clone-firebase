import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase'

export default function useChats(user) {
    // /users/user.id/chats
    const [snapshot] = useCollection(
        user ? db.collection('users')
        .doc(user.uid)
        .collection('chats')
        .orderBy('timestamp','desc')
        : null
      )

    //   const users = []
    //   if(user){
    //     snapshot?.docs.forEach(doc => {
    //         const id = doc.id > user.uid ?
    //                 `${doc.id}${user.uid}` : 
    //                 `${user.uid}${doc.id}`
    //         if(doc.id !== user.uid){
    //             users.push({
    //                 id,
    //                 userID: doc.id,
    //                 ...doc.data()
    //             })
    //         }
    //     })
    //   }

      const chats = snapshot?.docs.map(doc => ({
          id: doc.id,
          //userID: doc.id,
          ...doc.data()
      }))
      return chats
}
