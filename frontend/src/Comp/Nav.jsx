import React from 'react'
import { useContext } from 'react'
import "./Nav.css"
import { Link } from "react-router-dom"
import Ct from './Ct'
const Nav = () => {
    const { token }=useContext(Ct);
  return (
    <nav className='info-nav'>
        <div className='info'>
            <div className='title'>
                My Blog
            </div>
        </div>
        {
            token && 
            <div className='nav-links'>
                <Link to="/home"><i className="fa-solid fa-house"></i> Home</Link>

                <Link to="/allposts"><i className="fa-solid fa-newspaper"></i> All Posts</Link>

                <Link to="/myposts"><i className="fa-solid fa-file-lines"></i> My Posts</Link>

                <Link to="/createpost"><i className="fa-solid fa-plus"></i> Create Post</Link>

                <Link to="/about"><i className="fa-solid fa-circle-info"></i> About</Link>

                <Link to="/logout"><i className="fa-solid fa-right-from-bracket"></i> Logout</Link>
            </div>
        }
    </nav>
  )
}
export default Nav