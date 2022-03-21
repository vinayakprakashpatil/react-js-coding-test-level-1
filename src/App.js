import "./App.css";
import Radium from "radium"
import Home from "./Home";
import { Route, HashRouter } from "react-router-dom";
import PokeDex from "./PokeDex";

function App() {
  return (
    <HashRouter>
      <div>
        <Route exact path="/" component={Home}/>
        <Route path="/pokedex" component={PokeDex}/>
      </div>
      
    </HashRouter>
  );
}

export default Radium(App);
