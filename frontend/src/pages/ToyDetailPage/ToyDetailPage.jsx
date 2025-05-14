// IMPORTS
import "./styles.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { closest } from 'color-2-name';

// APIs
import * as toyAPI from "../../utilities/toy-api";

export default function ToyDetailPage() {
    const [toyDetail, setToyDetail] = useState(null);
    const { id } = useParams();

    useEffect(() => { 
        async function getAndSetDetail() {
          try {
            const toy = await toyAPI.show(id);
            setToyDetail(toy);
          } catch (err) {
            console.log(err);
            setToyDetail(null);
          }
        }
        getAndSetDetail()
    }, [id])

    if (!toyDetail) return <h3>Your toy details will display soon</h3>

  return (<>
    <div className="toy-detail-card" style={{ borderColor: toyDetail.color }}>
      <div className="toy-detail-card-bg" style={{ backgroundColor: toyDetail.color }}></div>
      <div className="toy-detail-card-content">
        <h2>{ toyDetail.name }</h2>
        <p>A { closest(toyDetail.color).name } toy</p>
      </div>
    </div>
    <div className="toy-actions">
      <Link to={`/toys/edit/${toyDetail.id}`} className="btn warn">Edit</Link>
      <Link to={`/toys/confirm_delete/${toyDetail.id}`} className="btn danger">Delete</Link>
    </div>
  </>)
}