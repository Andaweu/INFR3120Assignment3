const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskcontroller');
const {body} = require('express-validator');


const validator = [
    body('name').trim().notEmpty().withMessage('Name required').isLength({ max: 150}),
    body('description').trim().notEmpty().withMessage('Description required'),
    body('priority').isIn(['Very High', 'High', 'Medium', 'Low', 'Very Low']).withMessage('Select a valid priority'),
    body('dueDate').isISO8601().toDate().withMessage('Invalid date')
];

router.get('/', controller.listTasks)
router.get('/new', controller.showNewForm)
router.post('/', validator, controller.createTask);

router.get('/edit/:id', controller.showEditForm);
router.get('/:id', controller.showTask)

router.put('/:id', validator, controller.updateTask);
router.delete('/:id', controller.deleteTask);

module.exports = router;
