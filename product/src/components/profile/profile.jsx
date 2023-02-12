import './profile.css';
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
import {AiOutlinePlus,AiFillDelete} from "react-icons/ai"
import {BiUpload,BiLogOut} from "react-icons/bi"
import {BsFillCameraFill} from "react-icons/bs"
import Dropdown from 'react-bootstrap/Dropdown';
import {GrUpdate} from "react-icons/gr"
import {FaUserAlt} from "react-icons/fa"
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';


let baseUrl = ""
if (window.location.href.split(":")[0] === "http") {
  baseUrl = "http://localhost:3000";
}
else{
  baseUrl = "https://sore-teal-chinchilla-sock.cyclic.app/"
}

function Profile() {
  axios.defaults.withCredentials = true

  const [data,setData] =useState ("") 
  const [allData,setAllData] =useState ([]) 
  const [show, setShow] = useState(false);
  const [editTweet,setEditTweet] =useState ("") 
  const [editId,setEditId] =useState (null) 
  const [searchId,setSearchId] =useState (null) 
  
  const [searchData,setSearchData] =useState ("") 
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [showToast, setShowToast] = useState(false);



  const handleClose = () => setShow1(false);
  const handleClose1 = () => setShow2(false);
  const handleShow = () => setShow2(true);
  const handleShow4 = () => setShow4(true);

  const handleClose2 = () => setShow2(false);
  const handleClose3 = () => setShow3(false);
  const handleClose4 = () => setShow4(false);


  const [loadTweet, setLoadTweet] = useState(false)

  const [isSpinner, setIsSpinner] = useState(null)
  

  let navigate = useNavigate();
  let { state, dispatch } = useContext(GlobalContext);
  const [imageUpload,setImageUpload] =useState (null) 
  const [imageCoverUpload,setImageCoverUpload] =useState (null) 
  const [showDrpItems,setShowDrpItems] =useState (false) 
  const [deleteAccountEmail, setDeleteAccountEmail] = useState(null)
  

  if (isSpinner === true) {
    document.querySelector(".spinner-div").style.display = "block"
    
  }
  if (isSpinner === false) {
    document.querySelector(".spinner-div").style.display = "none"
    
  }

  const handleShow1 = () => {
    if(showDrpItems == true){
      document.querySelector(".drp-items").style.display = "block"
    }
    
    if(showDrpItems == false){
      document.querySelector(".drp-items").style.display = "none"
    } 
  
    setShowDrpItems(false)
    setShow3(true)
  };

  
  const allTweetsHandler=()=>{
    axios.get(`${baseUrl}/api/v1/tweets`,{withCredentials: true})
    .then((response) => {
      console.log(response);
      setAllData(response.data.data)
 
    }, (error) => {
      console.log(error);
    });

  }
  
  useEffect(() => {
    allTweetsHandler()
  },[loadTweet])


  const deleteTweetHandler = (ids) =>{
    console.log(ids)
    axios.delete(`${baseUrl}/api/v1/tweet/${ids}`,{withCredentials: true})
    .then(response => {
      console.log("response: ", response);
      setIsSpinner(true)
      setTimeout(() => {
        setIsSpinner(false);
        setLoadTweet(!loadTweet)

    }, 1000);
    })

    .catch(err => {
        console.log("error: ", err);
    })

  }

  const handleData = async (id,names,price,desc) =>{
    setShow(true)
    setLoadTweet(!loadTweet)

  }
  const updateTweetHandler = (event) =>{
    setShow(false)
    event.preventDefault()
    let Updatetweet = event?.target?.updateTweetText?.value
      axios.put(`${baseUrl}/api/v1/tweet/${editId}`,{
      text:Updatetweet ,
      
    },{withCredentials: true})
    .then((response) => {
      console.log(response);
      setIsSpinner(true)
      setLoadTweet(!loadTweet)

      setTimeout(() => {
        setIsSpinner(false);

    }, 1500);
     
    }, (error) => {
      console.log(error);
    });

    
  }

  const getProductHandlerOnId = () =>{
    setShow1(true)
    axios.get(`${baseUrl}/api/v1/tweet/${searchId}`,{withCredentials: true})
    .then((response) => {
      console.log(response);
      setSearchData(response.data.data)
     
    }, (error) => {
      console.log(error);
    });
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
          type: 'USER_LOGOUT',
          payload: null
      })
    }, 2500);
      
    }, (error) => {
      console.log(error);
    });

    
  }

  const updateProfilePhotoHandler= () =>{
    let imageRef = ref(storage,`profileImages/${imageUpload?.name + v4()}`);

    uploadBytes(imageRef, imageUpload).then((snapshot) =>{
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


  const uploadCoverImageHandler = () =>{
  
    if (imageCoverUpload != null) {}
      let imageRef = ref(storage,`profileImages/${imageCoverUpload?.name + v4()}`);

      uploadBytes(imageRef, imageCoverUpload).then((snapshot) =>{
        console.log("Firebase Storage",snapshot)
  
        getDownloadURL(snapshot.ref)
        .then((url) =>{
          console.log("ImageURL", url)
        
              axios.post(`${baseUrl}/api/v1/uploadCoverPhoto`, {
                coverPhoto:url
              })
  
              .then((response) => {
                  console.log(response);
                  setIsSpinner(true)
                  setTimeout(() => {
                    setIsSpinner(false);
                    window.location.reload()
                }, 1500);
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

  const removeCover = () =>{
      if(state.user.coverPhoto != null){

        axios.put(`${baseUrl}/api/v1/deleteCoverPhoto`)
        .then(response => {
          console.log("response: ", response);
          setIsSpinner(true)
          setTimeout(() => {
            setIsSpinner(false);
            window.location.reload()
        }, 2500);
        })
    
        .catch(err => {
            console.log("error: ", err);
        })
      }
  }

  const accountSuspensionHandler = (e) =>{
    e.preventDefault()
    console.log(deleteAccountEmail)
    if (state.user.email == deleteAccountEmail){
      axios.delete(`${baseUrl}/api/v1/deleteAccount/${deleteAccountEmail}`)
      .then(response => {
        console.log("response: ", response);
        setIsSpinner(true)
        setTimeout(() => {
          setIsSpinner(false);
          navigate("/signup")
          
      }, 2500);
      })
  
      .catch(err => {
          console.log("error: ", err);
      })

    }

    else{
      setShowToast(true)
      
    }

  }


  return (
    <div className='container-fluid'>
      <div className='spinner-div'>
      <div className='spinner'>
        <Spinner animation="grow" variant="danger" />
      </div>
      </div>
      <div className="side-nav">
        <div className="home"><a href="/"><img src="https://img.icons8.com/fluency/512/twitter.png" alt="twitter logo" height="40" width="40"  /></a> </div>
        <div className="profile"><a href="/profile"><FaUserAlt style={{fontSize:"35px",cursor:"pointer",color:"#3f3f3f"}} title='Profile'></FaUserAlt></a></div>
        <Dropdown>
          <Dropdown.Toggle style={{backgroundColor:'white',color:'black',borderColor:'white'}} 
          className='menuBtn' id="dropdown-button-dark-example1" variant="secondary">

            <img src={state?.user?.profileImage} style={{borderRadius:'50%'}} alt='account' height="40" width="40" title = "logout"/>
          </Dropdown.Toggle>

          <Dropdown.Menu >
            <Dropdown.Item onClick={logoutHandler} >
              <BiLogOut/> Log Out
            </Dropdown.Item>
            <Dropdown.Item>
              <GrUpdate /> Update Password
            </Dropdown.Item>
            <Dropdown.Item onClick={handleShow4}  href="#/action-4">
              <AiFillDelete /> Delete Account
            </Dropdown.Item>
              <Modal show={show4} onHide={handleClose4}>
                <Modal.Header closeButton>
                  <Modal.Title> Delete My Acconut</Modal.Title>
                </Modal.Header>
                  <div>
                    <form onSubmit={accountSuspensionHandler}>
                      <input type="email" required placeholder='Enter your Acconut Email' onChange={(e) =>{
                        setDeleteAccountEmail(e.target.value)

                      }} />
                      <button type='submit' >
                        Delete
                      </button>
                    </form>
                  </div>
              </Modal>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="center-box">
        <div className="inner-box">
          <nav className='navv'>
            <h4 style={{textTransform:'capitalize'}}>{state.user.firstName} {state.user.lastName}</h4>
            <span>{allData.length} Tweets</span>
          </nav>
          <div className="profile-content">
            <div className="images-box">
              <div className="profile-image-box" src={{backgroundImage:`url(${state?.user?.profileImage})`}}>
                <img className='p-img' src={state?.user?.profileImage} alt="profile Image" />
                <BsFillCameraFill title='Change picture' style={{color:"white"}} className='camera-icon'  onClick={handleShow} />
                <Modal show={show2} onHide={handleClose2} animation={false}>
                  <Modal.Header closeButton>
                    <Modal.Title>Upload Profile Picture</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className='modal-body'>
                    <label htmlFor="imgInput">
                      <p style={{cursor:"pointer"}}  className='upload-btn'>
                        <AiOutlinePlus className='plus-icon'/> Upload Photo
                      </p>
                    </label>
                    <input style={{display:"none"}} type="file" name='profilePic' accept='image/png, image/jpg, image.jpeg'  id='imgInput' 
                    onChange={(e) => setImageUpload(e.target.files[0])}/>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="primary" onClick={updateProfilePhotoHandler}>
                      Update Changes
                    </Button>
                  </Modal.Footer>
                </Modal>


              </div>
              <div className="cover-image-box" style={{backgroundImage:`url(${state?.user?.coverPhoto})`}}>
              <Dropdown className='drp'>
                  <Dropdown.Toggle className='cover-btn' id="dropdown-button-dark-example1" variant="secondary">
                      <BsFillCameraFill className='camera-icon'/><span className="btn-text"> Edit Cover Photo</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu variant="dark" className='menu'>
                    <p onClick={handleShow1}><BiUpload className='upload-icon'/>Upload Photo</p>
                      <Modal show={show3} onHide={handleClose3} animation={false}>
                        <Modal.Header closeButton>
                          <Modal.Title>Update Cover Photo</Modal.Title>
                        </Modal.Header>

                        <Modal.Body className='modal-body'>
                          <label htmlFor="coverInput">
                            <p className='upload-btn'> <AiOutlinePlus className='plus-icon'/>Upload Photo</p>
                          </label>

                          <input style={{display:"none"}}  type="file" name='coverPic' accept='image/jpg, image.jpeg'  id='coverInput' 
                          onChange={(e) => setImageCoverUpload(e.target.files[0])}/>
                        </Modal.Body>

                        <Modal.Footer>
                          <Button variant="primary" onClick={uploadCoverImageHandler} >
                            Save Changes
                          </Button>
                        </Modal.Footer>

                      </Modal>
                      {(state.user.coverPhoto == "")?
                          null
                      :
                      <p onClick={removeCover}><AiFillDelete className='upload-icon' />Remove</p>
                      }
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>{/* images end */}
            <div className="profile-details">
              <span style={{fontWeight:'bold',textTransform:'capitalize'}}>{state?.user?.firstName} {state?.user?.lastName}</span><br />
              <span style={{fontSize:'0.9em'}}>@{state?.user?.email}</span><br />
              <span>
                <img src="https://img.icons8.com/material-sharp/2x/calendar--v2.png" alt="calender logo" height="20" width="20"/>
                <span style={{fontSize:'0.9em'}} className='userDate'> Joined {state?.user?.createdOn.split('T')[0]}</span>
              </span>
            </div>{/* details end */}
            <div className="tweets-container">
            {(allData && allData?.length !== 0)?
            <div className="display-tweets">
              { allData.map((eachData,i) => (  
                <div className='tweet' key={i}>
                  <div className="tweet-info">
                  <img src={eachData?.profilePhoto} alt="profilePic" width="50" height = "50" />
                  <div>
                    <span className='username'>{eachData?.userFirstName} {eachData.userLastName}</span><br />
                    <span className='date'>.{eachData?.createdOn.split('T')[0]}</span>
                  </div>
                  <div className='tweet-options'>
                  <img src="https://img.icons8.com/material-sharp/2x/edit--v3.png" title="Edit"  width="20" height="20" 
                  onClick={()=>{
                    handleData(setEditId(eachData?._id),setEditTweet(eachData?.text))
                       }}/>
                  </div>
              </div>
              <div className="tweet-content">
                <p className="tweet-txt">{eachData?.text}</p>
                  {(eachData?.image !== undefined)?
                    <img src={eachData.image} />
                    :
                    null
                  }
              </div>
                </div>
                )
              )}
            </div>
            :
            null}
            </div>
          </div>
        </div>
      </div>
      <Modal
            show={show}
            backdrop="static"
            keyboard={false}   
          >
          <Modal.Header>
            <Modal.Title>Update Your Tweet</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={updateTweetHandler} className = "updateForm" >
              
                <label>Tweet Text:</label>
                <textarea name="updateTweetText" id="update-textarea" rows="5" 
                defaultValue={editTweet} required></textarea>
              <Button variant="primary" type='submit' className='updateBtn'>Save Changes</Button>

            </form>

          </Modal.Body>

          <Modal.Footer>

          </Modal.Footer>
        </Modal>

    </div>
    
  );
}

export default Profile;