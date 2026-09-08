const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/articlesController');
const { createArticle, updateArticle } = require('../validators/article.validator');
const validateRequest = require('../utils/validateRequest');

router.get('/', ctrl.list);
router.post('/', createArticle, validateRequest, ctrl.create);
router.get('/:id', ctrl.getById);
router.patch('/:id', updateArticle, validateRequest, ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;