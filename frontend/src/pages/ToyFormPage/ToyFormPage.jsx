// IMPORTS
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useParams, Link } from "react-router";
import nerdFinch from "../../assets/images/finch_wave.png";

// APIs
import * as toyAPI from "../../utilities/toy-api";

export default function ToyFormPage({ createToy, editToy, deleteToy }) {
    const initialState = { name: "", color: "#ff0000" }
    const [currToy, setCurrToy] = useState(null);
    const [formData, setFormData] = useState(initialState);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function getAndSetDetail() {
          try {
              const toyDetail = await toyAPI.show(id);
              setFormData({ name: toyDetail.name, color: toyDetail.color })
              setCurrToy(toyDetail);
          } catch (err) {
              console.log(err);
              setFormData(initialState);
              setCurrToy(null);
          }
    }
        if (editToy || deleteToy && id) getAndSetDetail()
    }, [id])

    function handleChange(evt) {
        const updatedData = { ...formData };
        console.log(formData.color)
        setFormData({ ...updatedData, [evt.target.name]: evt.target.value })
    }

    async function handleSubmit(evt) {
        try {
            evt.preventDefault();
            const newToy = editToy ? await toyAPI.update(currToy.id, formData) : await toyAPI.create(formData);
            setFormData(initialState)
            navigate(`/toys/${newToy.id}`)
        } catch (err) {
            console.log(err);
        }
    }

    async function handleDelete(evt) {
        try {
          evt.preventDefault();
          const response = await toyAPI.deleteToy(currToy.id)
          if (response.success) {
            setFormData(initialState)
            navigate("/toys");
          }
        } catch (err) {
            console.log(err);
        }
    }

    
    if (deleteToy && !currToy) return <h1>Loading</h1>    
    if (deleteToy && currToy)  return (<>
        <div className="page-header">
            <h1>Delete Toy?</h1>
            <img src={nerdFinch} alt="A Finch using a computer" />
        </div>
        <h2>Are you sure you want to delete { currToy.name }?</h2>
        <form onSubmit={handleDelete}>
            <Link to={`/toys/${currToy.id}`} className="btn secondary">Cancel</Link>
            <button type="submit" className="btn danger">Yes - Delete!</button>
        </form>
    </>)

    if (editToy && !currToy)  return <h1>Loading</h1>
    if (createToy || editToy) return (<>
        <div className="page-header">
            {editToy ? <h1>Edit {currToy.name}'s Info</h1> : <h1>Add a Toy</h1>}
            <img src={nerdFinch} alt="A Finch using a computer" />
        </div>
        <form className="form-container" onSubmit={handleSubmit}>
            <table>
                <tbody>
                  <tr>
                    <th><label htmlFor="id_name">Name:</label></th>
                    <td><input value={formData.name} type="text" name="name" minLength="3" maxLength="50" required id="id_name" onChange={handleChange}/></td>
                  </tr>
                  <tr>
                    <th><label htmlFor="id_color">Color:</label></th>
                    <td><input value={formData.color} type="color" name="color" maxLength="20" required id="id_color" onChange={handleChange}/></td>
                  </tr>
                </tbody>
            </table>
            <button type="submit" className="btn end submit">Submit!</button>
        </form>
    </>)
}