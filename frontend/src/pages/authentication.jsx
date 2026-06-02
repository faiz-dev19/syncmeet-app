// import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
// import Paper from '@mui/material/Paper';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { AuthContext } from '../contexts/AuthContext';
// import { Snackbar, Alert } from '@mui/material';
// // TODO remove, this demo shouldn't need to reset the theme.

// const defaultTheme = createTheme();

// export default function Authentication() {

//   const [username,setUsername] = React.useState();
//   const [password,setPassword] = React.useState();
//   const [name,setName]         = React.useState();
//   const [formState,setFormState]= React.useState(0);
//   const [open,setOpen]          = React.useState(false);
//   const [error,setError] = React.useState();
//   const [ message,setMessage] = React.useState()
// const {handleRegister,handleLogin} = React.useContext(AuthContext);


//    let handleAuth =  async () => {
//     try { 
//       if (formState === 0 ){

//       }

//       if (formState ===1) {
//         let result = await handleRegister(name,username,password);
//         console.log(result);
//         setMessage(result);
//         setOpen(true);
//       }
//     } catch (err) {
//       // console.log(err)
//       // return 
//         let message = (err.response.data.message);
//         setError(message);
//    } 
//   }

//   return (
//     // <h1>authentication</h1>
//     <ThemeProvider theme={defaultTheme}>
//       <Grid container component="main" sx={{ height: '100vh' }}>
//         <CssBaseline />
//         <Grid
//           item
//           xs={false}
//           sm={4}
//           md={7}
//           sx={{
//             backgroundImage:
//             // 'url("https://images.unsplash.com/1600x900/?travel&sig=1")',
//               'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e")',
//               backgroundRepeat:'no-repeat',
//             backgroundColor: (t) =>
//               t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
//             backgroundSize: 'cover',
//             backgroundPosition: 'left',
//           }}
//         />
//         <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
//           <Box
//             sx={{
//               my: 8,
//               mx: 4,
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//             }}
//           >
//             <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//               <LockOutlinedIcon />
//             </Avatar>
            
            
//             <div>
//               <Button variant={formState == 0 ? 'contained': ""} onClick={() => {
//                 setFormState(0)
//               }}>
//                 sign In
//               </Button>
//               <Button variant={formState == 1 ? 'contained': ""} onClick={() => {
//                 setFormState(1)
//               }}>
//                 sign Up
//               </Button>
//             </div>
//             <Box component="form" noValidate  sx={{ mt: 1 }}>
//             {formState == 1 ? <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="fullname"
//                 label="Full Name"
//                 name="username"
//                 onChange={(e)=>setName(e.target.value)}
//                 autoFocus
//               /> : <></>}
             
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="username"
//                 label="Username"
//                 name="username"
//                 onChange={(e)=>setUsername(e.target.value)}
//                 autoFocus
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="password"
//                 label="Password"
//                 type="password"
//                 id="password"
//                 onChange={(e)=>setPassword(e.target.value)}
//               />
//               {/* <FormControlLabel
//                 control={<Checkbox value="remember" color="primary" />}
//                 label="Remember me"
//               /> */}

//               <p style={{color:"red"}}>{error}</p>
//               <Button
//                 type="button"
//                 fullWidth
//                 variant="contained"
//                 sx={{ mt: 3, mb: 2 }}
//                 onClick={handleAuth}
//               >
//                {formState === 0? "Login" : "Register"}
//               </Button>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//             {/* <Snackbar 
//                open={open}
//                autoHideDuration={4000}      
//                message={message} 
//             /> */}
//       <Snackbar
//         open={open}
//         autoHideDuration={4000}
//         onClose={() => setOpen(false)}
//       >
//         <Alert
//           onClose={() => setOpen(false)}
//           severity="success"
//           sx={{ width: "100%" }}
//         >
//           {message}
//         </Alert>
//       </Snackbar>
//     </ThemeProvider>
//   );
// }

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function Authentication() {

  const [username,setUsername] = React.useState("");
  const [password,setPassword] = React.useState("");
  const [name,setName] = React.useState("");
  const [formState,setFormState]= React.useState(0);

  const [open,setOpen] = React.useState(false);
  const [message,setMessage] = React.useState("");
  const [severity,setSeverity] = React.useState("success");
  const [error,setError] = React.useState("");

  const {handleRegister,handleLogin} = React.useContext(AuthContext);
  
  const navigate = useNavigate();

  let handleAuth = async () => {
    try { 
      if (formState === 0) {
        // LOGIN 
        let result = await handleLogin(username,password);
          console.log(result)
        if(result){
          setSeverity("success");
          setMessage("Login Successful ✅");
          setOpen(true);
          navigate("/home")
        }
      }

      if (formState === 1) {
        // REGISTER
        let result = await handleRegister(name,username,password);

        if(result){
          setSeverity("success");
          setMessage(result?.message || "Registered Successfully ✅");
          setOpen(true);
          setError("")
          setFormState(0)
          setPassword("")
        }
      }

    } catch (err) {
      let msg = err.response?.data?.message || "Something went wrong ❌";

      setSeverity("error");
      setMessage(msg);
      setOpen(true);
      setError(msg);
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />

        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e")',
            backgroundRepeat:'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'left',
          }}
        />

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>

            <div>
              <Button 
                variant={formState === 0 ? 'contained': "text"} 
                onClick={() => setFormState(0)}
              >
                Sign In
              </Button>

              <Button 
                variant={formState === 1 ? 'contained': "text"} 
                onClick={() => setFormState(1)}
              >
                Sign Up
              </Button>
            </div>

            <Box component="form" noValidate sx={{ mt: 1 }}>
              
              {formState === 1 && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id='username'
                  label="Full Name"
                  name='username'
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                />
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                type="password"
                id="password"
                label="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />

              <p style={{color:"red"}}>{error}</p>

              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleAuth}
              >
                {formState === 0 ? "Login" : "Register"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* ✅ Snackbar */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>

    </ThemeProvider>
  );
}