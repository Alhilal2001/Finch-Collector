// IMPORTS
import "./styles.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router";
import { closest } from "color-2-name";

// IMAGES
import skaterFinch from "../../assets/images/finch_wave.png";
import finchCone from "../../assets/images/finch_wave.png";
import finchOniGirl from "../../assets/images/finch_wave.png";
import kittyKabob from "../../assets/images/finch_wave.png";
import string from "../../assets/images/finch_wave.png"
import mouse from "../../assets/images/finch_wave.png"
import fish from "../../assets/images/finch_wave.png"

// COMPONENTS
import FeedingForm from "../../components/Forms/FeedingForm";
import DisplayFinchToys from "../../components/DisplayFinchToys/DisplayFinchToys";
import AddPhotoForm from "../../components/Forms/AddPhotoForm";
// APIs
import * as finchAPI from "../../utilities/finch-api";
import * as feedingAPI from "../../utilities/feedings-api";
import * as toyAPI from "../../utilities/toy-api";


export default function FinchDetailPage() {
  const [finchDetail, setFinchDetail] = useState(null);
  const [finchFeedings, setFinchFeedings] = useState([]);
  const [toysFinchHas, setToysFinchHas] = useState([]);
  const [toysFinchDoesntHave, setToysFinchDoesntHave] = useState([]);
  const { id } = useParams();

  const MEALS = {
    'B': 'Breakfast',
    'L': 'Lunch',
    'D': 'Dinner',
  }

  useEffect(() => {
    async function getAndSetDetail() {
      try {
        const finchData = await finchAPI.show(id);
        const feedings = await feedingAPI.finchFeedings(id);
        setFinchDetail(finchData.finch);
        setToysFinchHas(finchData.toysFinchHas)
        setToysFinchDoesntHave(finchData.toysFinchDoesntHave)
        setFinchFeedings(feedings);
      } catch (err) {
        console.log(err);
        setFinchDetail(null);
      }
    }
    if (id) getAndSetDetail()
  }, [id])

  async function handleAddToy(evt, toyId) {
    try {
      evt.preventDefault()
      const toyData = await finchAPI.addToyToFinch(finchDetail.id, toyId);
      console.log(toyData)
      setToysFinchHas(toyData.toysFinchHas);
      setToysFinchDoesntHave(toyData.toysFinchDoesntHave);
    } catch (err) {
      console.log(err);
      setToysFinchHas([...toysFinchHas]);
      setToysFinchDoesntHave([...toysFinchDoesntHave]);
    }
  }

  async function handleRemoveToy(evt, toyId) {
    try {
      evt.preventDefault()
      const toyData = await finchAPI.removeToyFromFinch(finchDetail.id, toyId);
      console.log(toyData)
      setToysFinchHas(toyData.toysFinchHas);
      setToysFinchDoesntHave(toyData.toysFinchDoesntHave);
    } catch (err) {
      console.log(err);
      setToysFinchHas([...toysFinchHas]);
      setToysFinchDoesntHave([...toysFinchDoesntHave]);
    }
  }

  async function addPhoto(finchId, formData) {
    console.log(finchId, formData)
    try {
      const updatedFinch = await finchAPI.addPhoto(finchId, formData);
      console.log(updatedFinch)
      setFinchDetail(updatedFinch);
    } catch (err) {
      console.log(err);
      setFinchDetail({...finchDetail})
    }
}

  if (!finchDetail) return <h3>Your finch details will display soon</h3>

  return (<>
    <section className="detail-finch-container">
    <div className="detail-finch-img">
        { finchDetail.photo?.url
            ? <img src={finchDetail.photo.url} alt={`A photo of ${finchDetail.name}`} className="usr-img" />
            : <img src={skaterFinch} alt="A skater boy finch" className="usr-img" />
        }
    </div>
      <div className="finch-details">
        <h1>{finchDetail.name}</h1>
        <h2>{finchDetail.age > 0
          ? `A ${finchDetail.age} year old ${finchDetail.breed}`
          : `A ${finchDetail.breed} kitten.`}
        </h2>
        <p>{finchDetail.description}</p>
      </div>
      <div className="finch-actions">
        <Link to={`/finchs/edit/${finchDetail.id}`} className="btn warn">Edit</Link>
        <Link to={`/finchs/confirm_delete/${finchDetail.id}`} className="btn danger">Delete</Link>
      </div>
      <section>
       <AddPhotoForm finch={finchDetail} addPhoto={addPhoto} />
      </section>
    </section>
    <div className="feedings-toy-container">
      <section className="feedings">
        <div className="subsection-title">
          <h2>Feedings</h2>
          <img src={finchCone} alt="An ice cream cone finch" />
          <img src={finchOniGirl} alt="A finch as onigiri" />
          <img src={kittyKabob} alt="A kabob of kittens" />
        </div>
        <h3>Add a Feeding</h3>
        <FeedingForm finchDetail={finchDetail} finchFeedings={finchFeedings} setFinchFeedings={setFinchFeedings} />
        {finchFeedings.length > 0
          ?
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Meal</th>
              </tr>
            </thead>
            <tbody>
              {finchFeedings.map((meal, ind) => (
                <tr key={ind}>
                  <td>{meal.date}</td>
                  <td>{MEALS[meal.meal]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          :
          <div className="subsection-content">
            <p>⚠️ {finchDetail.name} has not been fed!</p>
          </div>
        }
      </section>
      <section className="feedings">
        <div className="subsection-title">
          <h2>Toys</h2>
          <img src={string} alt="A ball of string" />
          <img src={mouse} alt="A mouse" />
          <img src={fish} alt="A fishy toy" />
        </div>
        <h3>{finchDetail.name}'s Toys</h3>
        <div className="subsection-content">
          {toysFinchHas.map(toy => (
            <DisplayFinchToys key={toy.id} toy={toy} submitFunction={handleRemoveToy} formAction={"Remove Toy"} />
          ))}
        </div>
        <h3>Available Toys</h3>
        <div className="subsection-content">
          {toysFinchDoesntHave.map(toy => (
            <DisplayFinchToys key={toy.id} toy={toy} submitFunction={handleAddToy} formAction={"Give Toy"} />
          ))}
        </div>
      </section>
    </div>
  </>)
}