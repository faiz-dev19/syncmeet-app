import React from 'react'
import "../App.css"
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
export default function LandingPage() {

  let router = useNavigate();

  return (
    // <div>faiz malik</div>
    <div className='landingPageContainer'>
      <nav>
        <div className="navHeader">
          <h2>Apna Zoom</h2>
        </div>
        <div className="navList">
          <p onClick={() => {
            router("/dhkjae")
          }
          } >Join as Guest</p>
          <p onClick={() => { router("/auth") }} >Register</p>
          <div role='button'>
            <p onClick={() => { router("/auth") }}>Login</p>
          </div>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div>
          <h1>because <span style={{ color: 'orange' }}>Distance</span> shouldn't seperate <span style={{ color: '#ff7f7f' }}>Hearts</span>.</h1>
          <p>Bridge the distance with Apna Zoom Call </p>
          <div className='getStart'>
            <Link to="/auth">Get Started</Link>
          </div>
        </div>
        <div className='png'>
          <img src="/phone2-removebg-preview.png" alt="image" />
        </div>
      </div>

    </div>
  )
}
