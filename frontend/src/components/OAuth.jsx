import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import { app } from '../firebase';
import {useDispatch} from 'react-redux'
import {signInSuccess} from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom';
const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const handleGoogleClick =async()=>{
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth,provider);
            console.log(result)
            const res = await fetch('/api/auth/google',{
              method:'POST',
              headers:{
                'Content-Type':'application/json',
              },
              body: JSON.stringify({//name,email,photo are sent to backend i.e authcontroller.js google line no 61,62,64
                name:result.user.displayName,
                email:result.user.email,
                photo:result.user.photoURL
              })
            })
            const data = await res.json();
            console.log(data)
            dispatch(signInSuccess(data));
            navigate("/");

        } catch (error) {
            console.log('could not sign in with google',error);
        }
    }
  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue with google</button>
  )
}

export default OAuth
