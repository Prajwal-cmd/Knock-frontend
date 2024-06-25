import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div style={{
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "100vh", 
      textAlign: "center"
    }}>
      <h1>404</h1>
      <div>Page Not Found</div>
      <Link to="/" style={{ 
        marginTop: "1rem", 
        padding: "0.5rem 1rem", 
        backgroundColor: "#007bff", 
        color: "white", 
        textDecoration: "none", 
        borderRadius: "4px" 
      }}>
        Home
      </Link>
    </div>
  )
}

export default NotFound
