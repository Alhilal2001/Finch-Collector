import { useState } from "react";

export default function AddPhotoForm({ finch, addPhoto }) {
    const initialState = { url: "", title: "" }
    const [formData, setFormData] = useState(initialState)

    function handleChange(evt) {
        setFormData({ ...formData, [evt.target.name]: evt.target.value })
    }
    function handleSubmit(evt) {
        evt.preventDefault();
        addPhoto(finch.id, formData);
        setFormData(initialState);
    }

   return (<>
        <h3>Change { finch.name }'s photo</h3>
        <form onSubmit={handleSubmit} autoComplete="off">   
            <p>
              <label htmlFor="id_url">Url:</label>
              <input value={formData.url} type="text" name="url" maxLength="250" required    id="id_url" onChange={handleChange}/>
            </p>
            <p>
              <label htmlFor="id_title">Title:</label>
              <input value={formData.title} type="text" name="title" maxLength="250" required    id="id_title" onChange={handleChange}/>
            </p>
            <button type="submit" className="btn submit">Add Photo</button>
        </form>
    </>)
}