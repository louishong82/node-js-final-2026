require('dotenv').config();
const { DataSource } = require('typeorm')
const Skill = require('../entities/Skill');
const CreditPackage = require('../entities/CreditPackage');
const Users = require('../entities/Users');


const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'student',
  password: process.env.DB_PASSWORD || 'student666',
  database: process.env.DB_DATABASE || 'fitness',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  entities: [
    Skill,CreditPackage,Users
  ],
  migrations: ['db/migrations/*.js'],
})
 module.exports = { dataSource }

