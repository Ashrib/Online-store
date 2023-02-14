import './App.css';
import {Route,Routes,Link,Navigate} from "react-router-dom"
import Admin from "./components/admin/admin"
import Home from "./components/home/home"
import Account from "./components/account/account"
import Login from "./components/login/login"
import Signup from "./components/signup/signup"
import {useState,useEffect,useContext} from "react"
import axios from 'axios';
import { GlobalContext } from './context/context';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import Profile from './components/profile/profile';
import UpdatePassword from './components/update-pass/update';
import ForgetPass from './components/forget-pass/forget';
import ForgetPassWithSms from './components/forget-pass-with-sms/sms';


axios.defaults.withCredentials = true

function App() {
  let { state, dispatch } = useContext(GlobalContext);
  console.log(state)

  useEffect(() => {
    let baseUrl = ""
    if (window.location.href.split(":")[0] === "http") {
      baseUrl = "http://localhost:3000";
      
    }
    else{
      baseUrl = "https://modern-clam-helmet.cyclic.app/"
    }
  

    const getProfile = async () => {

      try {
        let response = await axios.get(`${baseUrl}/api/v1/profile`, {
          withCredentials: true
        })
        console.log("Profile: ", response);
       
        if(response.data.email === "admin@gmail.com"){

          dispatch({
            type: 'ADMIN_LOGIN',
            payload: response.data
          })
        }
        else{
          dispatch({
            type: 'USER_LOGIN',
            payload:response.data
          })
          dispatch({
            type: 'ADMIN_LOGIN',
            payload:response.data
          })
        }
      } catch (error) {

        console.log("axios error: ", error);
        dispatch({
          type: 'USER_LOGOUT'
        })
      }



    }
    getProfile();

  }, [])

  useEffect(() => {

    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
      // Do something before request is sent
      config.withCredentials = true;
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    });

    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    }, function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      if (error.response.status === 401) {
        dispatch({
          type: 'USER_LOGOUT'
        })
        dispatch({
          type: 'ADMIN_LOGOUT'
        })
      }
      return Promise.reject(error);
    });
  }, [])

  

  return (
    <div>

         {
         ( state?.isAdmin === true &&state?.isLogin === null) ?
            <Routes>
              <Route path="/" element={<Admin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Account" element={<Account />} />
              <Route path="/update-password" element={<UpdatePassword />} />

            </Routes>   
          :
            null
        } 
        {
         (state?.isLogin === true && state?.isAdmin === null) ?
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/update-password" element={<UpdatePassword />} />

            </Routes>   
          :
            null
        } 


        {    
         (state.isLogin === false && state?.isAdmin === false) ?

            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forget-password" element={<ForgetPass />} />
              <Route path="*" element={<Login/>}/>
              <Route path="/forget-pass-with-sms" element={<ForgetPassWithSms />} />

            </Routes>   
          :
            null
        }  
         

         { 

         (state.isLogin === null && state.isAdmin === null) ?
          <div className='loadingScreen'>
              <Spinner animation="border" variant="danger" />
                <p>Loading...</p>
          
          </div>
           
          :
            null
         } 


    </div>
      
  );
}

export default App;