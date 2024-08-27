const express = require('express')
const cors = require('cors')

const { productsRouter } = require('./products.router');

const app = express()
const port = 5001

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(productsRouter);

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).json({
    error: {
      message: err.message,
      details: err.details,
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
