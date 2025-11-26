const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskcontroller');
const {body} = require('express-validator');


const validator = [ //checks if the coresponding data from the inputs is valid
    body('name').trim().notEmpty().withMessage('Name required').isLength({ max: 150}),
    body('description').trim().notEmpty().withMessage('Description required'),
    body('priority').isIn(['Very High', 'High', 'Medium', 'Low', 'Very Low']).withMessage('Select a valid priority'),
    body('dueDate').isISO8601().toDate().withMessage('Invalid date')
];


router.get('/', controller.listTasks) //get route for tasks list
router.get('/new', controller.showNewForm) //get route for new task form
router.post('/', validator, controller.createTask); //post route for processing the create task page

router.get('/edit/:id', controller.showEditForm); //get route for the edit form
router.get('/:id', controller.showTask); //get route for show task page

router.put('/:id', validator, controller.updateTask); //post route after updating a task
router.delete('/:id', controller.deleteTask); //handles delete tasks

module.exports = router;
