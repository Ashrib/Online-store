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
import {MdOutlineKeyboardBackspace} from "react-icons/md"
import {AiOutlineCheck} from "react-icons/ai"
import {IoArrowBack} from "react-icons/io"
import {CgProfile} from "react-icons/cg"
import Dropdown from 'react-bootstrap/Dropdown';
import { set } from 'mongoose';



let baseUrl = ""
if (window.location.href.split(":")[0] === "http") {
  baseUrl = "http://localhost:3000";
}
else{
  baseUrl = "https://modern-clam-helmet.cyclic.app/"
}



function Account() {
    let { state, dispatch } = useContext(GlobalContext);
  const [nameUpdate,setNameUpdate] =useState ("") 
  const [imgUpdate,setImgUpdate] =useState ("") 
  const [allCategories,setAllCategories] =useState ([]) 
  const [addCategory,setAddCategory] =useState ("") 
  const [isSpinner, setIsSpinner] = useState(null)
  const [show2, setShow2] = useState(false);
  const updateProfilePhotoHandler= (e) =>{
    
    let imageRef = ref(storage,`profileImages/${imgUpdate?.name + v4()}`);
e.preventDefault();
    uploadBytes(imageRef, imgUpdate).then((snapshot) =>{
      console.log("Firebase Storage",snapshot)

      getDownloadURL(snapshot.ref)
      .then((url) =>{
        console.log("ImageURL", url)
            axios.post(`${baseUrl}/api/v1/updateProfileImg`, {
                profileImage:url
            })

            .then((response) => {
                console.log(response);
                setIsSpinner(true)
                setTimeout(() => {
                  setIsSpinner(false);
                  setShow2(false)
                  window.location.reload()
              }, 2000);
                
                
            }, (error) => {
                console.log(error.message);
            });

        })
        .catch((e) =>{
            console.log("Image Url Error", e)
    
        })
    
    })
    .catch((e) =>{
      console.log("Storage Error", e)

    })

  }

  const cagetorgyAddHandler = async(e)=>{
    e.preventDefault();
    try {
        const response = await axios.post(`${baseUrl}/api/v1/category`, {
            category:addCategory
        })
        console.log("all categories", response.data);

        setAddCategory(response.data.data)
    } catch (error) {
        console.log("error in getting all categories", error);
    }
  }
  const getCategories = async()=>{
    try {
        const response = await axios.get(`${baseUrl}/api/v1/categories`)
        console.log("all categories", response.data);

    setAllCategories(response.data.data)
    } catch (error) {
        console.log("error in getting all categories", error);
    }
  }
  const updateFullNameHandler = (event) =>{
    event.preventDefault();
    // let update = nameUpdate;
    // update = update.replace(/\s\s+/g, " ")
    // update = update.toLowerCase()
  // setNameUpdate(update) ;
    console.log(nameUpdate)
//     let Updatetweet = event?.target?.updateTweetText?.value
//       axios.put(`${baseUrl}/api/v1/tweet/${editId}`,{
//       text:Updatetweet ,
//       
//     },{withCredentials: true})
//     .then((response) => {
//       console.log(response);
//       setIsSpinner(true)
//       setLoadTweet(!loadTweet)
// 
//       setTimeout(() => {
//         setIsSpinner(false);
// 
//     }, 1500);
//      
//     }, (error) => {
//       console.log(error);
//     });

    
  }
  
  const logoutHandler = () =>{
    axios.get(`${baseUrl}/api/v1/logout`,{
      withCredentials: true
    })

    .then((response) => {
      console.log(response);
      setIsSpinner(true)
      setTimeout(() => {
        setIsSpinner(false);
        dispatch({
          type: 'ADMIN_LOGOUT',
          payload: null
      })
    }, 2500);
      
    }, (error) => {
      console.log(error);
    });

    
  }



  useEffect(() => {
    getCategories()
  },[setAddCategory])

    return (
<div className='main'>
        <div className='spinner-div'>
            <div className='spinner'>
            <Spinner animation="grow" variant="danger" />
            </div>
        </div>
    <div className='body-div'>
        <span style={{fontSize:"1.7em"}}>
            <Link to="/"><MdOutlineKeyboardBackspace title='home'/></Link>
        </span>
        <div className="head">
            Settings
        </div>
        <div className="body">
            <div className="user-image">
             <img src={(state?.user?.profileImage !== null)?state.user.profileImage:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGgoEPXteULdfH-flSZKFT5YpRRew1nLDZRja9ItjRVkzIokVa0hPX&usqp=CAE&s"} alt="ww" />
            </div>
            <div id='name-update'>
                <form onSubmit={updateFullNameHandler}>
                <input required type="text" placeholder='Update Full Name'
                onChange={(e)=>{
                  let val = e.target.value;
                  val = val.replace(/\s\s+/g, " ");
                  val = val.toLowerCase();
                  setNameUpdate(val);
                  console.log(nameUpdate)
                }}
                />
                <button type='submit'><AiOutlineCheck  style={{cursor:"pointer"}}/></button>
                </form>
            </div>
            <div id="center-div">
                <div id='img-update'>
                    <form onSubmit={updateProfilePhotoHandler}>
                    <label htmlFor="pro-img-inp">
                    <div id='img-inp' >
                    <input required type='file'style={{display:"none"}}
                    name='item-img' accept='image/png,image/jpg'  id='pro-img-inp'
                    onChange={(e) =>setImgUpdate(e.target.files[0])}
                /><BsFillCameraFill /></div>
                </label>
                <button style={{fontSize:"1em",padding:'2px 5px',fontWeight:"normal"}} type='submit'>update</button>
                    </form>
                </div>
                <div className="add-cate">
                    <form onSubmit={cagetorgyAddHandler}>
                    <input required type="text" placeholder='Add Category'
                    onChange={(e)=>setAddCategory(e.target.value)} />
                    <Button style={{padding:'2px 5px',backgroundColor:"#5cdb35",border:'none'}}
                     type='submit'>Add</Button>
                    </form>
                </div>
                <div className="category-add">
                    <span className='head'>All Categories</span>
                    <div className="category-box">
                    {(allCategories.length !== 0)?
                    allCategories.map((category,i)=>(
                        <div className='categ' key={i}>{category.name}</div>
                    ))
                    :null}
                    </div>
                </div>
                <div style={{width:'100%',textAlign:'center'}}>
                    <Button onClick={logoutHandler} variant="outline-success">Logout</Button>
                </div>
            </div>
        </div>
    </div>
</div>
    );
}
export default Account;
