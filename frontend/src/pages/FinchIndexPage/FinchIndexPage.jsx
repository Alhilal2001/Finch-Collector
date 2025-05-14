// IMPORTS
import "./styles.css";
import { useState, useEffect } from "react";

// IMAGES
import coolFinch from "../../assets/images/finch_wave.png";
import happyFinch from "../../assets/images/finch_wave.png";
import teacupFinch from "../../assets/images/finch_wave.png";
import finchInBox from "../../assets/images/finch_wave.png";

// COMPONENTS
import FinchIndexCard from "../../components/FinchIndexCard/FinchIndexCard";

// APIs
import * as finchAPI from "../../utilities/finch-api";

export default function FinchIndexPage() {
  const [allFinchs, setAllFinchs] = useState([]);

  useEffect(() => {
    async function getAllFinchs() {
        try {
            const finchData = await finchAPI.index()
            setAllFinchs(finchData)
        } catch (err) {
            console.log(err);
        }
    }
    if (allFinchs.length === 0) getAllFinchs()
}, [])

  const displayAllFinchs = allFinchs.map(c => (
    <FinchIndexCard key={c.name} finch={c}/>
  ))

  return (<>
    <section className="page-header">
      <h1>Finch List</h1>
      <img src={coolFinch} alt="A cool finch" />
      <img src={happyFinch} alt="A happy finch" />
      <img src={teacupFinch} alt="A finch in a teacup" />
      <img src={finchInBox} alt="A finch in a box" />
    </section>
    <section className="index-card-container">
      {displayAllFinchs}
    </section>
  </>)
}