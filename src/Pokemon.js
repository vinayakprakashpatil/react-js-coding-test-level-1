import "./App.css";

const Pokemon = (props) =>{

     return (
     <>
     <h4 className="th_Pokemon" onClick={props.click}>
          {props.name}
     </h4></>)   
}

export default Pokemon;
