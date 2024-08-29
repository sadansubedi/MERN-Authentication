import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import About from './pages/About.jsx'
import Signin from './pages/Signin.jsx'
import Signup from './pages/Signup.jsx'
import Header from "./components/Header.jsx"
import PrivateRoute from "./components/PrivateRoute.jsx"
function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/signin" element={<Signin/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route element={<PrivateRoute/>}>
        <Route path="/profile" element={<Profile/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App