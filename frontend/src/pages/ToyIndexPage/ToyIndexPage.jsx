// IMPORTS
import "./styles.css";
import { useState, useEffect } from "react"
import { Link } from "react-router";
import { closest } from "color-2-name";


import string from "../../assets/images/finch_wave.png";
import mouse from "../../assets/images/finch_wave.png";
import post from "../../assets/images/finch_wave.png";
import fish from "../../assets/images/finch_wave.png";


// APIs
import * as toyAPI from "../../utilities/toy-api";

export default function ToyIndexPage() {
    const [allToys, setAllToys] = useState([])

    useEffect(() => {
        async function getAllToys() {
          try {
            const toys = await toyAPI.index();
            setAllToys(toys);
          } catch (err) {
            console.log(err);
            setAllToys([]);
          }
        }
        getAllToys();
    }, [])

    return (<>
        <section className="page-header">
            <h1>All Finch Toys</h1>
            <img src={string} alt="A ball of string" />
            <img src={mouse} alt="A mouse" />
            <img src={post} alt="A scratching post" />
            <img src={fish} alt="A fishy toy" />
        </section>
        <section className="toy-index-card-container">
        {allToys.map(toy => (
          <div key={toy.id} className="toy-index-card" style={{ borderColor: toy.color }}>
            <div className="toy-index-card-bg" style={{ backgroundColor: toy.color }}></div>
            <Link to={`/toys/${toy.id}`}>
              <div className="toy-index-card-content">
                <h2>{ toy.name }</h2>
                <p>A { closest(toy.color).name } toy</p>
              </div>
            </Link>
          </div>
        ))}
        </section>
    </>)
}