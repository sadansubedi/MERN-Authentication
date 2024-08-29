import { useSelector } from "react-redux"
import { useRef, useState,useEffect } from "react"
import { app } from "../firebase"
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import {updateUserStart,updateUserSucess,updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess} from '../redux/user/userSlice.js'
import { useDispatch } from "react-redux"
const Profile = () => {


  const fileRef = useRef(null);
  const {currentUser,loading ,error} = useSelector((state)=>state.user);
  const [File,setFile] = useState(undefined);
  // console.log(File);
  const[filePercent,setFilePercent] =useState(0);
  // console.log(filePercent)
const[fileUploadError,setFileloadError] = useState(false);
// console.log(fileUploadError)
const [formData,setFormData] = useState({});
// console.log(formData)
const[updatesucess , setupdatesucess] =useState(false);
const dispatch = useDispatch()

  useEffect(()=>{
    if(File){
      handleFileUpload(File);
    }
  },[File])
  const handleFileUpload = (file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);
    uploadTask.on('state_changed',
      (snapshot)=>{
        const progress =(snapshot.bytesTransferred/snapshot.totalBytes)*100;
        setFilePercent(Math.round(progress));
      },
      (error)=>{
        setFileloadError(true);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          setFormData({...formData,avatar:downloadURL})
        })
      },
    )
  }
  const handleChange =(e)=>{
      setFormData({...formData ,[e.target.id]: e.target.value})
  }
  const handleSubmit =async(e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSucess(data));
      setupdatesucess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  };

 const handleDeleteUser=async(e)=>{
   try {
     dispatch(deleteUserStart());
     const res = await fetch(`/api/user/delete/${currentUser._id}`,{
      method :"DELETE",
     });
     const data = await res.json();
     if(data.success === false){
      dispatch(deleteUserFailure(data.message))
      return;
    }
    dispatch(deleteUserSuccess(data))
   } catch (error) {
     dispatch(deleteUserFailure(error.message))
   }
 }

 const handleSignout =async()=>{
  try {
    dispatch(signOutUserStart());
    const res = await fetch('/api/auth/signout');
    const data = await res.json();
    if(data.success === false){
      dispatch(signOutUserFailure(data.message))
      return;
    }
    dispatch(signOutUserSuccess(data))
  } catch (error) {
    dispatch(signOutUserFailure(error.message))
  }
 }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" ref={fileRef} onChange={(e)=>setFile(e.target.files[0])} hidden accept="image/*"/>
        <img src={formData.avatar || currentUser.avatar} alt="profile" onClick={()=>fileRef.current.click()} className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
        <p className="text-sm self-center">
        {
          fileUploadError ? (
            <span className="text-red-700">Error: Image upload failed(image must be less than 2mb)</span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePercent}%`}</span>
          ) : filePercent === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )
        }

        </p>
        <input type="text" placeholder="username"  id="username" onChange={handleChange} defaultValue={currentUser.username} className="border p-3 rounded-lg"/>
        <input type="email" placeholder="email"  id="email" onChange={handleChange} defaultValue={currentUser.email} className="border p-3 rounded-lg"/>
        <input type="password" placeholder="password"  onChange={handleChange} id="password" className="border p-3 rounded-lg"/>
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'Loading...' : 'update'}</button>
      </form>
      <div className="flex justify-between mt-5">
      <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
      <span onClick={handleSignout} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updatesucess ? 'User is updated Successfully' : ''}</p>
    </div>
  )
}

export default Profile

