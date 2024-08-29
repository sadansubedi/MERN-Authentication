import { useState } from "react"
import { Link,useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { signInStart,signInSuccess,signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
const Signin = () => {
  const [FormData,setFormData] = useState({});
  const {loading,error} = useSelector((state)=>state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange =(e)=>{
      setFormData(  
        {
          ...FormData,
          [e.target.id] : e.target.value
        }
      )
  }
  // console.log(FormData)

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(FormData), // Ensure FormData is correctly defined
      });
  
      // if (!response.ok) {
      //   const errorText = await response.text();
      //   throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      // }
  
      const data = await response.json();//here all data comes except password,its bcoz of authcontroller.js
      if(data.success === false){
       
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');
      console.log(data);

    } catch (error) {
      dispatch(signInFailure(error.message));
      console.error('Error:', error);
    }
  };

  

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
      <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
      <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
      <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85'>{loading ? 'Loading...' : 'Sign In'}</button>
      <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link to={"/signup"}>
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  )
}

export default Signin