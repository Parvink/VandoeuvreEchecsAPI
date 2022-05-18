import mongoose from 'mongoose'
import { eventModel } from "../models/index.js"

const Events = mongoose.model('Events', eventModel);

export async function getEvent (id) {
    return Events.findById(id).populate([{ path: 'players', model: 'Users', select: 'firstname name elo email id ageCategory', options: { sort: '-elo'} }])
}

export async function getEvents() {
    return Events.find({}).populate([{ path: 'players', model: 'Users', select: 'firstname name elo email id ageCategory', options: { sort: '-elo'} }])
}

//TODO refactor this dirty function
export async function createEvent(body) {
    let event = Events(body)
    try {
    await event.save()
    return event;
    }
    catch (error) {
        return error
    }
}

export async function updateEvent(body, id) {
    return Events.findOneAndUpdate({_id: id }, body)
}

export async function deleteEvent(id) {
    return Events.deleteOne({ _id: id})
}

export async function getEventsByUser(id) {
    return Events.find({ players: { $all: [mongoose.Types.ObjectId(id)] }}).populate([{ path: 'players', model: 'Users', select: 'firstname name elo email id ageCategory' }]).lean()
}