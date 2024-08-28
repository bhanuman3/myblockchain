const fabric = require('./fabric');
const ProductContractService = require('./ProductContractService');

const router = require('express').Router();

router.post('/products', async (req, res) => {
  const contract = await fabric.getContract('product');
  const service = new ProductContractService(contract);
  const result = await service.createProduct(req.body);
  res.json(result)
})

router.get('/init', async (req, res) => {
  const contract = await fabric.getContract('product');
  const service = new ProductContractService(contract);
  const result = await service.initLedger(req.body);
  res.json('success')
})

router.get('/products', async (req, res) => {
  const contract = await fabric.getContract('product');
  const service = new ProductContractService(contract);
  const result = await service.getAllProducts();
  res.json(result)
})

router.get('/products/:id', async (req, res) => {
  const contract = await fabric.getContract('product');
  const service = new ProductContractService(contract);
  const result = await service.readProduct(req.params.id);
  res.json(result)
})

router.put('/products/:id', async (req, res, next) => {
  try {
    const contract = await fabric.getContract('product');
    console.log(contract);
    const service = new ProductContractService(contract);
    const result = await service.udpateProduct(req.body);
    res.json(result)
  } catch (err) {
    next(err);
  }
})

module.exports.productsRouter = router;

