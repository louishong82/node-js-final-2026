require('dotenv').config();
const app = require('../app');
const { dataSource } = require('../db/data-source')

const port = Number(process.env.PORT) || 8080;
dataSource.initialize()
  .then(()=>{
    app.listen(port,()=>{
      console.log(`Server 啟動在 http://localhost:${port}`);
      console.log(`Swagger UI：http://localhost:${port}/docs`);
    }) 
  })
  .catch((err) =>{
     console.error('資料庫連線失敗：', err);
    process.exit(1);
  });
  
