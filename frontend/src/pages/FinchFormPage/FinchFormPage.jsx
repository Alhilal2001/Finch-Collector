// IMPORTS
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useParams, Link } from "react-router";

// ASSETS
import nerdFinch from "../../assets/images/finch_wave.png";

// APIs
import * as finchAPI from "../../utilities/finch-api";

export default function FinchFormPage({ createFinch, editFinch, deleteFinch }) {
    const initialState = { name: "", breed: "", description: "", age: 0 }
    const [currFinch, setCurrFinch] = useState(null);
    const [formData, setFormData] = useState(initialState);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function getAndSetDetail() {
            try {
                const finch = await finchAPI.show(id);
                console.log(finch)
                setCurrFinch(finch.finch);
                setFormData(finch.finch)
            } catch (err) {
                console.log(err)
                setCurrFinch(null)
                setFormData(initialState)
            }
        }
        if (editFinch || deleteFinch && id) getAndSetDetail()
    }, [id])

    function handleChange(evt) {
        const updatedData = { ...formData };
        setFormData({ ...updatedData, [evt.target.name]: evt.target.value })
    }

    async function handleSubmit(evt) {
        try {
            evt.preventDefault();
            const newFinch = editFinch ? await finchAPI.update(formData, currFinch.id) : await finchAPI.create(formData);
            console.log(formData)
            console.log(newFinch)
            console.log(formData)
            setFormData(initialState)
            navigate(`/finchs/${newFinch.id}`)
        } catch (err) {
            console.log(err)
        }
    }

    async function handleDelete(evt) {
        try {
            evt.preventDefault();
            const response = await finchAPI.deleteFinch(currFinch.id)
            if (response.success) {
                setFormData(initialState)
                navigate("/finchs");
            }
        } catch (err) {
            console.log(err)
        }
    }

    
    if (deleteFinch && !currFinch) return <h1>Loading</h1>    
    if (deleteFinch && currFinch)  return (<>
        <div className="page-header">
            <h1>Delete Finch?</h1>
            <img src={nerdFinch} alt="A finch using a computer" />
        </div>
        <h2>Are you sure you want to delete { currFinch.name }?</h2>
        <form onSubmit={handleDelete}>
            <Link to={`/finchs/${currFinch.id}`} className="btn secondary">Cancel</Link>
            <button type="submit" className="btn danger">Yes - Delete!</button>
        </form>
    </>)

    if (editFinch && !currFinch)  return <h1>Loading</h1>
    if (createFinch || editFinch) return (<>
        <div className="page-header">
            {editFinch ? <h1>Edit {currFinch.name}'s Info</h1> : <h1>Add a Finch</h1>}
            <img src={nerdFinch} alt="A finch using a computer" />
        </div>
        <form className="form-container" onSubmit={handleSubmit}>
            <table>
                <tbody>
                    {!editFinch &&
                        <tr>
                            <th><label htmlFor="id_name">Name:</label></th>
                            <td><input value={formData.name} type="text" name="name" maxLength="100" required="" id="id_name" onChange={handleChange} /></td>
                        </tr>
                    }
                    <tr>
                        <th><label htmlFor="id_breed">Breed:</label></th>
                        <td><input value={formData.breed} type="text" name="breed" maxLength="100" required="" id="id_breed" onChange={handleChange} /></td>
                    </tr>
                    <tr>
                        <th><label htmlFor="id_description">Description:</label></th>
                        <td>
                            <textarea value={formData.description} name="description" cols="40" rows="10" maxLength="250" required="" id="id_description" onChange={handleChange}></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th><label htmlFor="id_age">Age:</label></th>
                        <td><input value={formData.age} type="number" name="age" required="" id="id_age" onChange={handleChange} /></td>
                    </tr>
                </tbody>
            </table>
            <button type="submit" className="btn end submit">Submit!</button>
        </form>
    </>)
}