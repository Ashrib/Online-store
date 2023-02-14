import './admin.css';
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
  baseUrl = "https://modern-clam-helmet.cyclic.app/"
}


function Admin() {
  axios.defaults.withCredentials = true


  const [data,setData] =useState ("") 
  const [allData,setAllData] =useState ([]) 
  const [allCategories,setAllCategories] =useState ([]) 
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
// getting all products
  const allProductsHandler = async ()=>{
        try {
            const response = await axios.get(`${baseUrl}/api/v1/products`)
            console.log("all products", response.data);

        setAllData(response.data.data)
        } catch (error) {
            console.log("error in getting all products", error);
        }
  }
  // getting all categories
  const allCategoriesHandler = async ()=>{
    try {
        const response = await axios.get(`${baseUrl}/api/v1/categories`)
        console.log("all categories", response.data);

        setAllCategories(response.data.data)
    } catch (error) {
        console.log("error in getting all categories", error);
    }
}
  
  useEffect(() => {
    allProductsHandler();
    allCategoriesHandler();
  },[loadTweet])

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
         <span style={{fontSize:"0.9em"}}>{state?.user?.email}</span>
      </div>
    </div>
    <div className="options">
      <div className="opt">
        <Link to="/Account">
          <CgProfile className='icon' title='account'/>
        </Link>
      </div>
      <div className="opt">
       <AiOutlineProfile className='icon' title='add product' onClick={handleShow}/>
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
              <div id='img-inp' >
              Upload <AiOutlinePlusCircle/>
              <input required type='file'style={{display:"none"}}
               name='item-img' accept='image/png'  id='pro-img-inp'
               onChange={(e) =>setImageUpload(e.target.files[0])}
               /></div>
              </label>
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
        </Modal.Footer>
      </Modal>
      </div>
    </div>
  </div>
  <div className="body-div">
    <div className="get-products">
      <span style={{fontSize:'1.3em',fontWeight:'bold'}}>All Products</span>
      <div className="products-box">
        {(allData.length !== 0)?

          allData.map((eachProduct,i) =>(
            <div className='product' key={i}>

              <img className='item-img' src={eachProduct.image} alt="product img" />
              <div>
              <span style={{fontSize:'1em',color:"#5cdb35", textTransform:"capitalize"}}
              >{eachProduct.name}</span>
              <br />
              <span style={{fontSize:'0.8em',color:"#444444", textTransform:"capitalize"}}
              >{eachProduct.unit}</span>

              </div>
              <p style={{fontSize:'0.9em',color:"#444444",marginLeft:"auto",paddingRight:'5px'}}
              >Rs.{eachProduct.price}</p>
            </div>
          ))
         
        :null}
      </div>
        
    </div>
  </div>
</div>
    
  );
}

export default Admin;