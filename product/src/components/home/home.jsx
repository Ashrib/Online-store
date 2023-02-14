import './home.css';
import { useState,useEffect } from 'react';
import axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import {useRef,useContext} from 'react';
import {useNavigate} from "react-router-dom"
import { GlobalContext } from '../../context/context';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {v4} from "uuid"
import {BiLogOut} from "react-icons/bi"
import {FaUserAlt} from "react-icons/fa"
import Dropdown from 'react-bootstrap/Dropdown';



let baseUrl = ""
if (window.location.href.split(":")[0] === "http") {
  baseUrl = "http://localhost:3000";
  
}
else{
  baseUrl = "https://modern-clam-helmet.cyclic.app/"
}


function Home() {
 
  

  return (
<div class="main">
  home
  <div className='spinner-div'>
    <div className='spinner'>
    <Spinner animation="grow" variant="danger" />
    </div>
  </div>
  <div className="navbar">
    home
  </div>
</div>
    
  );
}

export default Home;