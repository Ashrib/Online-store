import './account.css';
import { useState,useEffect } from 'react';
import axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import {useRef,useContext} from 'react';
import {useNavigate,Link} from "react-router-dom"
import { GlobalContext } from '../../context/context';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {v4} from "uuid"
import {BsFillCameraFill} from "react-icons/bs"
import {FaUserAlt} from "react-icons/fa"
import {FaHome} from "react-icons/fa"
import {FaCartPlus} from "react-icons/fa"
import {AiOutlineCheck} from "react-icons/ai"
import {CgProfile} from "react-icons/cg"
import Dropdown from 'react-bootstrap/Dropdown';



let baseUrl = ""
if (window.location.href.split(":")[0] === "http") {
  baseUrl = "http://localhost:3000";
}
else{
  baseUrl = "https://sore-teal-chinchilla-sock.cyclic.app/"
}



function Account() {
    let { state, dispatch } = useContext(GlobalContext);
  const [nameUpdate,setNameUpdate] =useState ("") 
  const [imgUpdate,setImgUpdate] =useState ("") 


    return (
<div className='main'>
        <div className='spinner-div'>
            <div className='spinner'>
            <Spinner animation="grow" variant="danger" />
            </div>
        </div>
    <div className='body-div'>
        <div className="head">
            Settings{state.user.firstName}
        </div>
        <div className="body">
            <div className="user-image">
             <img src={(state?.user?.profileImage !== "")?state.user.profileImage:'https://www.pngitem.com/middle/mmhwxw_transparent-user-png-default-user-image-png-png/'} alt="ww" />
            </div>
            <div id='name-update'>
                <input type="text" placeholder='Update Full Name'
                onChange={(e)=>setNameUpdate(e.target.value)}
                />
                <AiOutlineCheck style={{cursor:"pointer"}}/>
            </div>
            <div className="center-div">
                <div id='img-update'>
                    <form >
                    <label htmlFor="pro-img-inp">
                    <div id='img-inp' >
                    <input required type='file'style={{display:"none"}}
                    name='item-img' accept='image/png'  id='pro-img-inp'
                    onChange={(e) =>setImgUpdate(e.target.files[0])}
                /><BsFillCameraFill/></div>
                </label>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
    );
}
export default Account;
