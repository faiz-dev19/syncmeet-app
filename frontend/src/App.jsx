import './App.css'
import LandingPage from "./pages/landing.jsx";
import {BrowserRouter as Router,Routes,Route  } from "react-router-dom";
import Authentication from './pages/authentication.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
 import VideoMeetComponent from './pages/videoMeet.jsx';
import Home from './pages/home.jsx'
import History from './pages/history.jsx';
// import Page  from "./pages/prac.jsx";
function App() {

  return (
    <div className='App'>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/auth' element={<Authentication />} />
            <Route path='/home' element={<Home />} />
            <Route path='/history' element={<History />} />
            <Route path='/:url' element={<VideoMeetComponent />} />
          </Routes>  
        </AuthProvider>   
      </Router>
    </div>
  );
}

export default App
