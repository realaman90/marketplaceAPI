const express = require('express');
const router = express.Router();


const {
    getAllProductsStatic,
    getAllProducts,
    createProduct,
    deleteProduct,
    updateProduct,
    getProductByID
} = require('../controllers/products');

router
    .route('/')
    .get(getAllProducts)
    .post(createProduct);
router
    .route('/:id')
    .get(getProductByID)
    .delete(deleteProduct)
    .patch(updateProduct);
router.route('/static').get(getAllProductsStatic);



module.exports = router