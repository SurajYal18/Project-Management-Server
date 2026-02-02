const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../database/config/database');

const Otp = sequelize.define('Otp', {
    otp_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    email_id: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    otp_code: {
        type: DataTypes.STRING(6),
        allowNull: false,
        validate: {
            len: [6, 6],
            isNumeric: true
        }
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'otps',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Otp;
