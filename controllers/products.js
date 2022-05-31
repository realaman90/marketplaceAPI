const { query } = require('express');
const { restart } = require('nodemon');
const Product = require('../models/product');


const getAllProductsStatic = async(req, res) => {


        const products = await Product.find({ price: { $gt: 30 } })
            .sort('price')
            .select('name price')
            .limit(10)
            .skip(1);
        res.status(200).json({ hits: products.length, products })
    }
    // get all products
const getAllProducts = async(req, res) => {
    const { name, featured, company, sort, fields, filter } = req.query;

    const queryObject = {};
    if (featured) {
        queryObject.featured = featured === 'true' ? true : false;
    }
    if (company) {
        queryObject.company = company;
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' };
    }
    if (filter) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = filter.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        );
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                queryObject[field] = {
                    [operator]: Number(value)
                };
            }
        });
    }
    let result = Product.find(queryObject);
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);

    } else {
        result = result.sort('createdAt')
    }
    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList)
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);
    const products = await result;
    res.status(200).json({ hits: products.length, products })
}

// create a product
const createProduct = async(req, res) => {
    const product = await Product.create(req.body)
    res.status(201).json({ status: 'created', product })
}

//delete a product

const deleteProduct = async(req, res) => {
    const { id } = req.params
    const product = await Product.findByIdAndDelete({ _id: id });

    if (!product) {
        throw new Error('Not found');

    }
    res.status(200).json({ status: 'success', message: `Product deleted Successfully` })
}

// update a product
const updateProduct = async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true
    });
    if (!product) {
        throw new Error('Not found');

    }
    res.status(200).json({ status: 'success', product })


}

// get one product by ID

const getProductByID = async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate({ _id: id });
    if (!product) {
        throw new Error('Not found');

    }
    res.status(200).json({ status: 'success', product })



}

module.exports = {
    getAllProductsStatic,
    getAllProducts,
    createProduct,
    deleteProduct,
    updateProduct,
    getProductByID

}