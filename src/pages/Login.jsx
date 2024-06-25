import React, { useState } from "react";
import { Avatar, Button, Container, IconButton, Stack, TextField, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import {CameraAlt} from "@mui/icons-material"
import { VisuallyHiddenInput } from "../components/styles/StyledComponent";
import axios from "axios";
import { server } from "../constants/config";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";
import toast from "react-hot-toast";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [name, setName] = useState('');
  const [isValidU, setIsValidU] = useState(true);
  const [isValidP, setIsValidP] = useState(true);
  const [isValidN, setIsValidN] = useState(true);
  const [isValidB, setIsValidB] = useState(true);
  const [isLoading,setIsLoading] = useState(false)

  const [avatarImage, setAvatarImage] = useState(null);

  const dispatch=useDispatch()
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarImage(file);    }
  };

  const toggleLogin = () => setIsLogin((prev)=>!prev);

  const Validator = () => {
    let isValid = true; // Variable to track overall validation status
  
    setIsValidU(true);
    setIsValidN(true);
    setIsValidB(true);
    setIsValidP(true);
  
    if (username.length < 3) {
      setIsValidU(false);
      isValid = false; 
    }
  
    if (name.length < 3) {
      setIsValidN(false);
      isValid = false; 
    }
  
    if (bio.length < 3) {
      setIsValidB(false);
      isValid = false; 
    }
  
    if (password.length < 3) {
      setIsValidP(false);
      isValid = false; 
    }
  
    return isValid;
  };


  const handleLogin = async(e) =>{
    e.preventDefault()
    
   const toastId=  toast.loading("Logging In...")

    setIsLoading(true)
      const config= {
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }
      }

      try {
        const {data}=await axios.post(`${server}/api/v1/user/login`,{
          username:username,
          password:password
        },config)

        dispatch(userExists(data?.user))
        toast.success(data.message,{id:toastId})
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went Wrong",{id:toastId})
      } finally{
        setIsLoading(false)
      }
    

  }

  const handleSignup = async(e) =>{
    e.preventDefault()

    const toastId=  toast.loading("Signing Up...")

    setIsLoading(false)
    if(Validator()){
      //proceed
      const formData = new FormData()
      formData.append("avatar",avatarImage)
      formData.append("name",name)
      formData.append("bio",bio)
      formData.append("username",username)
      formData.append("password",password)
      const config= {
        withCredentials:true,
        headers:{
          "Content-Type":"multipart/form-data"
        }
      }
      try {
        const {data}= await axios.post(`${server}/api/v1/user/new`,formData,config)
        dispatch(userExists(data?.user))
        toast.success(data.message,{id:toastId})
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went Wrong",{id:toastId})

      }finally{
        setIsLoading(false)
      }
    }
  }

  return (
    <div style={{
      background: ' linear-gradient(135deg, #BFDFFF, #A0C9FF)',
    }}>
     <Container
      component={"main"}
      maxWidth={"xs"}
      sx={{
        
        height: "100vh",
        display: "flex",
       justifyContent:"center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
            
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isLogin ? (
          <>
            <Typography variant="h5">Login</Typography>
            <form style={{ width: "100%", marginTop: "1rem" }}  onSubmit={handleLogin}>
              <TextField
              onChange={(e)=>setUsername(e.target.value)}
              value={username}
                required
                fullWidth
                label="USERNAME"
                margin="normal"
                variant="outlined"
                error={!isValidU}
                helperText={!isValidU && "Username must be at least 3 characters long"}
              />
              
              <TextField
              onChange={(e)=>setPassword(e.target.value)}
              value={password}
                required
                fullWidth
                label="PASSWORD"
                type="password"
                margin="normal"
                variant="outlined"
                error={!isValidP}
                helperText={!isValidP && "must be at least 3 characters long"}
              />
              <Button
                sx={{
                  marginTop: "1rem,",
                }}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={isLoading}
              >
                LOGIN
              </Button>

              <Typography sx={{ textAlign: "center", margin: "1rem" }}>
                OR
              </Typography>

              <Button
                sx={{ marginTop: "1rem" }}
                fullWidth
                variant="text"
                onClick={toggleLogin}
                disabled={isLoading}
              >
                Sign Up
              </Button>
            </form>
          </>
        ) : (
            <>
            <Typography variant="h5">Sign Up</Typography>
            <form style={{ width: "100%", marginTop: "1rem" }} onSubmit={handleSignup}>
            <Stack position={"relative"} width={"10rem"} margin={"auto"}>
            <Avatar
  src={avatarImage ? URL.createObjectURL(avatarImage) : undefined}
  sx={{
    width: "10rem",
    height: "10rem",
    objectFit: "cover",
  }}
/>

                <IconButton sx={{
                    position:"absolute",
                    bottom:"0",
                    right:"0",
                    bgcolor:"rgba(255,255,255,0.5)",
                    ":hover":{
                        bgcolor:"rgba(255,255,255,0.7)",
                    }
                }} component="label">
                    <>
                        <CameraAlt />
                        <VisuallyHiddenInput type="file"  onChange={handleFileSelect}/> 
                    </>
                </IconButton>
            </Stack>
              <TextField
               onChange={(e)=>setName(e.target.value)}
              value={name}
                required
                fullWidth
                label="NAME"
                margin="normal"
                variant="outlined"
                error={!isValidN}
                helperText={!isValidN && "must be at least 3 characters long"}
              />
               <TextField
               onChange={(e)=>setUsername(e.target.value)}
              value={username}
                required
                fullWidth
                label="USERNAME"
                margin="normal"
                variant="outlined"
                error={!isValidU}
                helperText={!isValidU && "Username must be at least 3 characters long"}
              />
              <TextField
                required
                fullWidth
                label="Bio"
                onChange={(e)=>setBio(e.target.value)}
              value={bio}
                margin="normal"
                variant="outlined"
                error={!isValidB}
                helperText={!isValidB && "must be at least 3 characters long"}
                 />
              <TextField
               onChange={(e)=>setPassword(e.target.value)}
              value={password}
                required
                fullWidth
                label="PASSWORD"
                type="password"
                margin="normal"
                variant="outlined"
                error={!isValidP}
                helperText={!isValidP && "must be at least 3 characters long"}
              />
              <Button
                sx={{
                  marginTop: "1rem,",
                }}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={isLoading}
              >
                SIGN UP
              </Button>

              <Typography sx={{ textAlign: "center", margin: "1rem" }}>
                OR
              </Typography>

              <Button
                sx={{ marginTop: "1rem" }}
                fullWidth
                variant="text"
                onClick={toggleLogin}
                disabled={isLoading}
              >
                LOGIN
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Container>
    </div>
   );
};

export default Login;
