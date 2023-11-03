const { createProduct, getAllProducts, getSingleProduct, updatedProduct, deleteProduct, addRating } = require('../controllers/product');
const authorization = require('../middleware/auth');

const router = require('express').Router();

// router.post('/products/:userId',authorization,createProduct);
router.post('/products',authorization,createProduct);
router.get('/products', authorization,getAllProducts);
router.get('/products/:productId',authorization,getSingleProduct);
router.put('/products/:productId',authorization, updatedProduct);
router.delete('/products/:productId',authorization,deleteProduct);
router.post('/add-rating/:userId/:productId',authorization,addRating);



module.exports=router;