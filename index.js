const express = require('express');
const connection = require('./mysql/connection.js');
const router = require('./routers/routes.js');


const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(router)


app.listen(PORT, () => {
    console.log('Server is up on port ' + PORT)
})