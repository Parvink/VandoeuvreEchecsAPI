import { Router } from 'express'
import { eventController } from '../controllers/index.js'
import middlewares from '../middleware/index.js'

const { isValidID } = middlewares
const eventRouter = Router()

eventRouter.route('/user/:id').get(isValidID, eventController.getEventsByUser)
eventRouter.route('/invite/:id').put(isValidID, eventController.invitePlayers)
eventRouter.route('/:eventId/:userId').put(eventController.confirmParticipation)
eventRouter
    .route('/:id')
    .get(isValidID, eventController.getEvent)
    .put(isValidID, eventController.updateEvent)
    .delete(isValidID, eventController.deleteEvent)
eventRouter
    .route('/')
    .get(eventController.getEvents)
    .post(eventController.addNewEvent)

export default eventRouter
