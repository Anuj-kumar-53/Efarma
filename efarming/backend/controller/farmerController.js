import farmer from '../model/farmer.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// Farmer Registration (Signup)
export const signupFarmer = async (req, res) => {
    try {
        const { name, email, password, phone, location } = req.body;

        // Check if farmer exists
        const existingFarmer = await farmer.findOne({ email });
        if (existingFarmer) {
            return res.status(400).json({
                success: false,
                message: "Farmer already exists, please login"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new farmer document
        const newFarmer = new farmer({
            name,
            email,
            password: hashedPassword,
            phone,
            location
        });

        await newFarmer.save();

        res.status(201).json({
            success: true,
            message: "Farmer registered successfully",
        
            farmer: {
                id: newFarmer._id,
                name: newFarmer.name,
                email: newFarmer.email
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};



// Farmer Login
export const loginFarmer = async (req, res) => {
    try {
        const { email, password } = req.body;

        const FarmerUser = await farmer.findOne({ email });
        if (!FarmerUser) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, FarmerUser.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: FarmerUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hrs
        });

        res.json({
            success: true,
            message: "Farmer login successful",
            token,
            farmer: {
                id: FarmerUser._id,
                name: FarmerUser.name,
                email: FarmerUser.email
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
