import "./styles.css";
import { Link } from "react-router";
import skaterFinch from "../../assets/images/finch_wave.png";

export default function FinchIndexCard({ finch }) {

    return (
        <div className="finch-index-card">
            <Link to={`/finchs/${finch.id}`}>
                <div className="finch-index-card-content">
                <div className="detail-finch-img">
                    { finch.photo?.url
                        ? <img src={finch.photo.url} alt={`A photo of ${finch.name}`} className="usr-img" />
                        : <img src={skaterFinch} alt="A skater boy finch" />
                    }
                </div>                    <h2>{finch.name}</h2>
                    <p>{finch.age > 0 ? `A ${finch.age} year old ${finch.breed}` : `A ${finch.breed} kitten.`}</p>
                    <p><small>{finch.description}</small></p>
                </div>
            </Link>
        </div>
      )
}