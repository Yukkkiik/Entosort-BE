const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3000

const app = express();

app.listen(PORT, () => {
    console.log(`Server ini jalan di port : ${PORT}`)
})