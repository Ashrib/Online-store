import './admin.css';
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
import {FaHome} from "react-icons/fa"
import {FaCartPlus} from "react-icons/fa"
import {AiOutlineProfile,AiOutlinePlusCircle} from "react-icons/ai"
import {CgProfile} from "react-icons/cg"
import Dropdown from 'react-bootstrap/Dropdown';



let baseUrl = ""
if (window.location.href.split(":")[0] === "http") {
  baseUrl = "http://localhost:3000";
}
else{
  baseUrl = "https://sore-teal-chinchilla-sock.cyclic.app/"
}


function Admin() {
  axios.defaults.withCredentials = true


  const [data,setData] =useState ("") 
  const [allData,setAllData] =useState ([]) 
  const [show, setShow] = useState(false);
  const [editId,setEditId] =useState (null) 
  const [searchId,setSearchId] =useState (null) 
  
  const [searchData,setSearchData] =useState ("") 
  const [show1, setShow1] = useState(false);

  // const handleClose = () => setShow1(false);
  const [loadTweet, setLoadTweet] = useState(false)
  const [isSpinner, setIsSpinner] = useState(null)
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const lastRef = useRef(null);
  let navigate = useNavigate();
  let { state, dispatch } = useContext(GlobalContext);
  const [imageUpload,setImageUpload] =useState (null) 
  const [itemName,setItemName] =useState ("") 
  const [unitName,setUnitName] =useState ("") 
  const [itemDescription,setItemDescription] =useState ("") 
  const [unitPrice,setUnitPrice] =useState (null) 
  const [eof, setEof] = useState(false)


  // add modal
  // const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true)
  // ===
  if (isSpinner === true) {
    document.querySelector(".spinner-div").style.display = "block"
    
  }
  if (isSpinner === false) {
    document.querySelector(".spinner-div").style.display = "none"
  }



  const submitHandler =(event) =>{
    event.preventDefault()
    // let tweetText = event.target.tweetText.value
    // if (imageUpload !== null) {
      let imageRef = ref(storage,`productImages/${imageUpload?.name + v4()}`);

      uploadBytes(imageRef, imageUpload).then((snapshot) =>{
        console.log("Firebase Storage",snapshot)
  
        getDownloadURL(snapshot.ref)
        .then((url) =>{
          console.log("ImageURL", url)
          axios.post(`${baseUrl}/api/v1/product`, {
            name: itemName,
            price: unitPrice,
            unit: unitName,
            image: url,
            description: itemDescription,
            category: "vegetable",
          },{withCredentials: true})
  
            .then((response) => {
              console.log(response);
              setData(response.data.data)
              setIsSpinner(true)
              setTimeout(() => {
                setIsSpinner(false);
                setLoadTweet(!loadTweet)
            }, 2000);
              event.target.reset();
  
            }, (error) => {
              console.log("Item adding Error",error);
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
    
    
  // }

  const allTweetsHandler= async ()=>{
    if (eof) return;
        try {
            const response = await axios.get(`${baseUrl}/api/v1/productFeed?page=${allData.length}`)

           


setAllData(response.data.data)
        } catch (error) {
            console.log("error in getting all products", error);
        }
  }

  
  useEffect(() => {
    allTweetsHandler()
  },[loadTweet])

  const getProductHandlerOnId = () =>{
    setShow1(true)
    axios.get(`${baseUrl}/api/v1/product/${searchId}`,{withCredentials: true})
    .then((response) => {
      console.log(response);
      setSearchData(response.data.data)

    }, (error) => {
      console.log(error);
    });
  }

  let descEmptyError = document.querySelector(".descEmptyError")
  let descError = document.querySelector(".descLengthError")

  const descHandler = (e) =>{
    if (e.target.value == "") {
      descEmptyError.style.display = "block"
      descError.style.display = "none"

    }

    else{
      descEmptyError.style.display = "none"
      descError.style.display = "none"
    }
  }

  const descLengthError = (e) =>{
    if (e?.target?.value?.length < 3) {
      descError.style.display = "block"
      descEmptyError.style.display = "none"
    }

    else{
      descEmptyError.style.display = "none"
      descError.style.display = "none"
    }

  }

  const logoutHandler =  () =>{
    axios.get(`${baseUrl}/api/v1/logout`,{
      withCredentials: true
    })

    .then((response) => {
      console.log(response);
      setIsSpinner(true)
     setTimeout(() => {
        setIsSpinner(false);
        setLoadTweet(!loadTweet)
        dispatch({
          type: 'USER_LOGOUT',
          payload: null
      })
    }, 2500);
     
    }, (error) => {
      console.log(error);
    });

  }


  return (
<div class="main">
  <div className='spinner-div'>
    <div className='spinner'>
    <Spinner animation="grow" variant="danger" />
    </div>
  </div>
  <div className="nav-bar">
    <div className="user-info">
      <div className="prf-img">
      <img className="p-img" src={(state?.user?.profileImage !== null)? state?.user?.profileImage : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGgoEPXteULdfH-flSZKFT5YpRRew1nLDZRja9ItjRVkzIokVa0hPX&usqp=CAE&s"}/>
      </div>
      <div className="user-data">
         <span className='cap-text'>{state?.user?.firstName} {state?.user?.lastName}</span>
         <span>{state?.user?.email}</span>
      </div>
    </div>
    <div className="options">
      Add <AiOutlineProfile title='add product' onClick={handleShow}/>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>Add New Item.</span>
          <div className="structure">
            <form onSubmit={submitHandler}>
              <label htmlFor="pro-img-inp">
              <AiOutlinePlusCircle/>
              </label>
              <input required type='file'style={{display:"none"}}
               name='item-img' accept='image/png, image/jpg, image.jpeg'  id='pro-img-inp'
               onChange={(e) =>setImageUpload(e.target.files[0])}
               />
               <input type="text" placeholder='Enter item name' required
               onChange={(e) =>setItemName(e.target.value)} 
               />
               <select name="" id=""></select>
               <textarea style={{resize:"none"}} 
                rows={3} placeholder="describe the new item"
                 required maxLength={500} 
                  onBlur={descHandler} onChange={(e) =>setItemDescription(e.target.value)}/>
                  <span className='descEmptyError error'>Field can't be empty!</span>
                  <span className='descLengthError error'>Your Value should be greater than two characters</span>
                  <div className='form-inp'>
                    Unit Name: 
                    <input type="text" placeholder='Pcs/kg/dozen' 
                    onChange={(e) =>setUnitName(e.target.value)}
                    />
                  </div>
                  <div className='form-inp'>
                    Unit Price: 
                    <input type="number" placeholder='Rs.100' 
                    onChange={(e) =>setUnitPrice(e.target.value)}
                    />
                  </div>
                  <Button type='submit' variant="outline-success">Add Item</Button>
            </form>
          </div>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Understood</Button>
        </Modal.Footer>
      </Modal>
    </div>
  </div>
</div>
    
  );
}

export default Admin;