import "./App.css";
import { useState, useEffect,useRef } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import Modal from "react-modal";
import {BarChart,Bar,XAxis,YAxis,Tooltip,CartesianGrid} from "recharts"
import { PDFExport} from '@progress/kendo-react-pdf';
import Pokemon from "./Pokemon";


Modal.setAppElement(document.getElementById('root'));

function PokeDex() {
  const [pokemons, setPokemons] = useState([{}]);
  const [isPokemonDetailOpen, setPokemonDetailForOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [nextListURL, setNext] = useState("");
  const [previousListURL, setPrevious]= useState("");
  const [URL, setURL] = useState('https://pokeapi.co/api/v2/pokemon');
  const [sortKey,setSortKey] = useState("name");
  const [sortingDirection, setSortingDirection] = useState("ASCENDING");  
  const [arrow, setArrow] = useState(true);
  const [inputFieldValue, setInputFieldValue] = useState("");
  const [pokemonDetail, setPokemonDetail] = useState({});
  let barArray = [];
   
  const BarChartDetails = () =>{
    return(    
      <div>        
        <table id="customers">
          <thead>
            <tr>
              <th>Name</th>
              <th>Base stat</th>
            </tr>
          </thead>
            <tbody>
            {     
            barArray.map(
              (data, index) => 
              {
                return (
                  <tr key={index}>
                    <th>                    
                          {data.key}            
                    </th>
                    <th>                    
                          {data.value}            
                    </th>
                  </tr>
              )})       
          }
          </tbody>
        </table>

      <br></br>
      <br></br>
                 
      <BarChart width={830} height={250} data={barArray}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="key" />
        <YAxis />
        <Tooltip />          
        <Bar dataKey="value" fill="#8884d8" />          
      </BarChart>
      </div>
    );
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "black",
      color: "white",
    },
    overlay: { backgroundColor: "grey" },
  };

  const setBarchartData = (pokemonDetails) =>{
     //console.log(pokemonDetails);

     
     const data = {...pokemonDetails};
    // console.log(data);

     for(const d of Object.values(data))
     {
        // console.log(d.stat.name);
        // console.log(d.base_stat);

        barArray.push({
          key:d.stat.name,
          value:d.base_stat
        })

     }
     
    
    
      
      //console.log(JSON.stringify(barArray));
  }

  const getPokemonDetails = async(pokemonName) =>{

    const data = pokemons.pokemons.results.find((pokemon)=> pokemon.name === pokemonName);

    await axios.get(data.url)
    .then(response => {
    //console.log(response.data);
    setPokemonDetail({
        p_name : pokemonName.toUpperCase(),
        image : response.data.sprites.front_default,
        stats : response.data.stats
    });
    
    
    }).then(()=>setPokemonDetailForOpen(true)).catch((e)=>{});

  }

  const getFilteredRows = (rows, filterKey) => {
    rows =null;
    rows = pokemons.pokemons.results;
    return rows.filter((row) => {
      return Object.values(row).some((s) =>
        ("" + s).toLowerCase().includes(filterKey)
      );
    });
  };

  const sortDirection = () =>{
        if(sortingDirection === "ASCENDING")
        {
          setSortingDirection("DESCENDING");
          setArrow(false);
        }
        else{
          setSortingDirection("ASCENDING");
          setArrow(true);
        }
  }

  const sortPokemonList = (data) =>{
      const unsortedData = {
        ...data
      }

      unsortedData.pokemons.results.sort((a,b)=>{
        const nameA = a[sortKey];
        const nameB = b[sortKey];

        if(sortingDirection === "ASCENDING")
        {
          if(nameA < nameB) return -1;
          if(nameA > nameB) return 1;
        }
        else{     
          if(nameA > nameB) return -1;
          if(nameA < nameB) return 1;
        }
        return 0;
      });

      setSortingDirection(sortDirection);
      setPokemons(unsortedData);
  }

  const setNextURL = ()=>
  {
    
   
    setURL({URL : nextListURL});
    setInputFieldValue("");
   // alert(nextListURL)
    getPokenmons(nextListURL);
  }

  const setPreviousURL = ()=>
  {   
    setURL({URL : previousListURL});
    setInputFieldValue("");
   // alert(previousListURL)
    getPokenmons(previousListURL);
  }

  const getPokenmons = async(URL)=>
  {
    
      await axios.get(URL)
      .then(respose => {
      console.log(respose.data.next);
      setPokemons({pokemons:respose.data});
      setPrevious(respose.data.previous);
      setNext(respose.data.next);
      setIsLoading(false);
      }).catch((e)=>{});
    
    
  }

  // const setURLS = () =>{
  //   setNext(pokemons.pokemons.next);
  //   setPrevious(pokemons.pokemons.previous)
  // }

  useEffect(()=>{
    getPokenmons(URL);  
    
  },[]);

  useEffect(()=>{
    //console.log(JSON.stringify(pokemons));
    //getFilteredRows(pokemons.pokemons.results,inputFieldValue);
    
  },[pokemons]);

  useEffect(()=>{
    setBarchartData(pokemonDetail.stats);
  },[pokemonDetail,barArray])
  //setNext({nextListURL: pokemons.pokemons.next});
  //setPrevious({previousListURL: pokemons.pokemons.previous});
  
  const pdfExportComponent = useRef(null);
  const contentArea = useRef(null);
  
  const handleExportWithComponent = (event) => {
    pdfExportComponent.current.save();
  }

  if (!isLoading && pokemons.length === 0) {
    return (
      <div>
        <header className="App-header">
          <h1>Welcome to pokedex !</h1>
          <h2>Requirement:</h2>
          <ul>
            <li>
              Call this api:https://pokeapi.co/api/v2/pokemon to get pokedex, and show a list of pokemon name.
            </li>
            <li>Implement React Loading and show it during API call</li>
            <li>when hover on the list item , change the item color to yellow.</li>
            <li>when clicked the list item, show the modal below</li>
            <li>
              Add a search bar on top of the bar for searching, search will run
              on keyup event
            </li>
            <li>Implement sorting and pagingation</li>
            <li>Commit your codes after done</li>
            <li>If you do more than expected (E.g redesign the page / create a chat feature at the bottom right). it would be good.</li>
          </ul>
        </header>
      </div>
    );
  }

  return (    
    <div>
      <header className="App-header">
        
        {isLoading ? (
          <>
            <div className="App">
              <header className="App-header">
                <b>Implement loader here</b>
                <ReactLoading type="balls" color="#ffffff" height={'20%'} width={'20%'}></ReactLoading>
              </header>
            </div>
            
          </>
        ) : (
          <>
            <h1>Welcome to pokedex !</h1>
           
            <div className="inline">
              <button className="button button1" onClick={setPreviousURL}> &laquo; Previous</button>
              <button className="button button2" onClick={ setNextURL} >Next &raquo;</button>
            </div>
            <table id="pokemon">
              <thead>
                <tr>
                  <th>

                  <input type="text" name="name" onChange={(e) => {setInputFieldValue(e.target.value);}} />
                    {arrow ? (<>                    
                      <h5 onClick={()=>{sortPokemonList(pokemons)}}>Name &darr;</h5>                    
                    </>) :(<>
                      <h5 onClick={()=>{sortPokemonList(pokemons)}}>Name &uarr;</h5>
                    </>)}                  
                  </th>
                </tr>
              </thead>
              <tbody>
              {     
              getFilteredRows(pokemons.pokemons.results, inputFieldValue).map(
                (pokemonfilter, index) => 
                {
                  return (
                    <tr key={index}>
                      <th>                    
                      <Pokemon key={index} name={pokemonfilter.name} url={pokemonfilter.url} click={(event)=>{getPokemonDetails(event.target.innerText)}}  ></Pokemon>                  
                      </th>
                    </tr>
                )})       
            }
            </tbody>
            </table>            
          </>
        )}
      </header>
      
      {pokemonDetail && (
        
        <Modal
          isOpen={isPokemonDetailOpen}
          contentLabel={pokemonDetail?.name || ""}
          onRequestClose={() => {
            setPokemonDetail(null);
          }}         
          style={customStyles}
        >
          <div className="pdf-page">
            <button className="button button2" onClick={()=>{setPokemonDetailForOpen(false)}}> Close </button>
            <button className="button button1" onClick={(event)=>{handleExportWithComponent(event) }}> Download </button>
            <div className="app-content">
            <PDFExport scale={0.6} margin="1cm" ref={pdfExportComponent} paperSize="A4">
            <div ref={contentArea}>
            
            <br></br>
            <br></br>

            <div className="inline">
              <img src={pokemonDetail.image} alt={pokemonDetail.p_name}/>
            </div>           
            <BarChartDetails/>
            </div>
            </PDFExport>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default PokeDex;
