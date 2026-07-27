import React, { useEffect, useState } from 'react'
import "./Carousal.css"
import banner1 from "../assets/banner1.jpeg"
import banner2 from "../assets/banner2.jpeg"
import banner3 from "../assets/banner3.jpeg"
import banner4 from "../assets/banner4.jpeg"
import banner5 from "../assets/banner5.jpeg"
import banner6 from "../assets/banner6.jpeg"


let arr=[
  banner1,banner2,banner3,banner4,banner5,banner6
]
const Carousal = () => {
  let [i,setI]=useState(0);

  useEffect(()=>{
    let interval=setInterval(()=>{
      setI((prev)=>(prev+1)%arr.length);
    },2000)
    return ()=> clearInterval(interval);
  },[])

  let fwd=()=>{
    setI((i+1) % arr.length);
  };

  let bkw=()=>{
    if(i == 0){
      setI(arr.length-1)
    }
    else{
      setI(i-1)
    }
  }

  return (
    <div className="bnr">
      <img src={arr[i]} alt="post-bnr" />
      <i className="fa-solid fa-less-than" onClick={bkw}></i>
      <i className="fa-solid fa-greater-than" onClick={fwd}></i>
      <div className="circles">
        {arr.map((img, ind) => (
          <i
            key={ind}
            className={
              i === ind ? "fa-solid fa-circle" : "fa-regular fa-circle"
            }
            onClick={() => setI(ind)}
          ></i>
        ))}
      </div>
    </div>
  )
}
export default Carousal