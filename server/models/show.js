import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
    {
        movie: {
            type: String,
            ref: 'Movie',
            required: true  
        },
        showDateTime: { 
            type: Date,
            required: true  
        },  
        hall: {
            type: String,
            default: 'Hall 01'
        },
        showPrice: {
            type: Number,
            required: true
        },
        occupiedSeats: {
            type: [String],
            default: [] 
        }
    }
);

const Show = mongoose.model('Show', showSchema);
export default Show;    