const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Patient, Doctor } = require('./user');

// Appointment model
const Appointment = sequelize.define('Appointment', {
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

// Associations
Appointment.belongsTo(Patient, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', onDelete: 'CASCADE' });

module.exports = { Appointment };