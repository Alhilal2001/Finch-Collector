import { useState } from "react";
import * as feedingAPI from "../../utilities/feedings-api";

export default function FeedingForm({ finchDetail, finchFeedings, setFinchFeedings }) {
    const today = new Date().toISOString().slice(0, 10);
    const initialState = { date: today, meal: "B", finch: finchDetail.id}
    const todaysFeedingCount = finchFeedings.filter(feeding => new Date(feeding.date).toISOString().slice(0, 10) === today)
    const [formData, setFormData] = useState(initialState)
    
    function handleChange(evt) {
        const updatedData = { ...formData, [evt.target.name]: evt.target.value }
        setFormData(updatedData)
    }
    
    async function handleSubmit(evt) {
        try {
            evt.preventDefault();
            const updatedFeedings = await feedingAPI.create(formData, finchDetail.id);
            setFinchFeedings(updatedFeedings)
            setFormData(initialState);
        } catch (err) {
            console.log(err);
            setFinchFeedings([...finchFeedings])
        }
    }
    

    return (
        <form onSubmit={handleSubmit}>
            {todaysFeedingCount.length >= 3
                ? <p className="fed">{finchDetail.name} has been fed all their meals for today!</p>
                : <p className="unfed">{finchDetail.name} might be hungry!</p>
            }
            <p>
                <label htmlFor="id_date">Feeding date:</label>
                <input value={formData.date} type="date" name="date" placeholder="Select a date" onChange={handleChange} />
            </p>
            <p>
                <label htmlFor="id_meal">Meal:</label>
                <select value={formData.meal} name="meal" id="id_meal" onChange={handleChange} >
                    <option value="B">Breakfast</option>
                    <option value="L">Lunch</option>
                    <option value="D">Dinner</option>
                </select>
            </p>
            <button type="submit" className="btn submit">Add Feeding</button>
        </form>
    )}