import "./App.css";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Home() {
  const [isReady, setIsReady] = useState(false);
  const [isHidden, setSpan] = useState(true);


  const handleChange = (e) =>{
    if(e.target.value === "Ready!")
    {
      setIsReady(true);
      setSpan(false);
    }
    else{
      setIsReady(false);
      setSpan(true);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <NavLink to="/pokedex">
        <img
          hidden={!isReady}
          src="https://www.freeiconspng.com/uploads/file-pokeball-png-0.png"
          className="App-logo"
          alt="logo"
          style={{ padding: "10px" }}          
        />
        </NavLink>
        <b>
          Requirement: Try to show the hidden image and make it clickable that
          goes to /pokedex when the input below is "Ready!" remember to hide the
          red text away when "Ready!" is in the textbox.
        </b>
        <p>Are you ready to be a pokemon master?</p>
        <input type="text" name="name" onChange={handleChange} />
        <span style={{ color: "red",visibility: isHidden ? "visible" : "hidden"}}>I am not ready yet!</span>
      </header>
    </div>
  );
}

export default Home;
