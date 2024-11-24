const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Patient, Doctor } = require('../models/user');

router.post('/register', async (req, res) => {
    const { full_name, email, password, role, gender, age, location, specialization, license_number, phone_number, years_of_experience } = req.body;

    // Basic validation
    if (!full_name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        let existingUser;

        // Check for existing user based on role
        if (role === 'patient') {
            existingUser = await Patient.findOne({ where: { email } });
        } else if (role === 'doctor') {
            existingUser = await Doctor.findOne({ where: { email_address: email }}); // Ensure this matches your model
        }

        if (existingUser) {
            return res.status(400).json({ message: `${role} already exists` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser;
        // Create a new user based on role
        if (role === 'patient') {
            newUser = await Patient.create({
                full_name,
                gender,
                location,
                age,
                email,
                password: hashedPassword,
            });
        } else if (role === 'doctor') {
            newUser = await Doctor.create({
                full_name,
                email_address: email, // Ensure this matches your model
                phone_number,
                specialization,
                license_number,
                location,
                years_of_experience,
                password: hashedPassword,
            });
        }

        res.status(201).json({ message: `${role} registered successfully`, user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Export the router
module.exports = router;