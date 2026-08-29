require('dotenv').config();
const { DataSource } = require('typeorm')
const Skill = require('../entities/Skill');
const CreditPackage = require('../entities/CreditPackage');


const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'student',
  password: process.env.DB_PASSWORD || 'student666',
  database: process.env.DB_DATABASE || 'fitness',
  synchronize: false,
  entities: [
    Skill,CreditPackage
  ],
  migrations: ['db/migrations/*.js'],
})
 module.exports = { dataSource }

