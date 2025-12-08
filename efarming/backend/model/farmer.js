import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    location: {
        type: String
    }
}, {
    timestamps: true
});

const farmer = mongoose.model('farmer', farmerSchema);
export default farmer;