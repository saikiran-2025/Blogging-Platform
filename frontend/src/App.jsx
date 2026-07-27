import React from 'react'
import { BrowserRouter,Route,Routes } from "react-router-dom"
import Register from './Comp/Register'
import Login from './Comp/Login'
import Reset_pwd from './Comp/Reset_pwd'
import Home from './Comp/Home'
import Carousal from './Comp/Carousal'
import All_posts from './Comp/All_posts'
import View_post from './Comp/View_post'
import Create_post from './Comp/Create_post'
import Edit_post from './Comp/Edit_post'
import About from './Comp/About'
import Myposts from './Comp/Myposts'
import Logout from './Comp/Logout'
import Nav from './Comp/Nav'
import Footer from './Comp/Footer'
import Ct from './Comp/Ct'
import "./App.css"
import { useState } from 'react'
const App = () => {
  const [token,setToken]=useState("");
  const [user,setUser]=useState(null);

  const obj={token,setToken,user,setUser};

  return (
    <BrowserRouter>
    <Ct.Provider value={obj}>
      <Nav />
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/resetpwd" element={<Reset_pwd />}/>
        <Route path="/home" element={<Home />}/>
        <Route path="/allposts" element={<All_posts />}/>
        <Route path="/viewpost/:id" element={<View_post />}/>
        <Route path="/createpost" element={<Create_post />}/>
        <Route path="/editpost/:id" element={<Edit_post />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/myposts" element={<Myposts />}/>
        <Route path="/logout" element={<Logout />}/>
      </Routes>
      {token && <Footer />}
    </Ct.Provider>
    </BrowserRouter>
  )
}
export default App