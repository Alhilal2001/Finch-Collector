import { Link } from "react-router"
import { closest } from "color-2-name"

export default function DisplayFinchsToys({ toy, submitFunction, formAction }) {
    return (
        <div className="toy-container">
          <div className="toy-info">
            <Link to={`/toys/${toy.id}`}>
                <p>A { closest(toy.color).name } { toy.name }</p>
            </Link>
            <div className="color-block" style={{ backgroundColor: toy.color }}></div>
          </div>
          <form onSubmit={(evt) => submitFunction(evt, toy.id)}>
            <button type="submit" className="btn submit">{formAction}</button>
          </form>
        </div>
    )
}