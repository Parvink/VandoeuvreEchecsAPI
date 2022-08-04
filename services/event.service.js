import mongoose from 'mongoose'
import { eventModel } from '../models/index.js'

const Events = mongoose.model('Events', eventModel)

export function getEvent(id) {
    return Events.findById(id).populate([
        {
            path: 'players',
            model: 'Users',
            select: 'firstname name elo email id ageCategory',
            options: { sort: '-elo' },
        },
    ])
}

export function getEvents() {
    return Events.find({}).populate([
        {
            path: 'players',
            model: 'Users',
            select: 'firstname name elo email id ageCategory',
            options: { sort: '-elo' },
        },
    ])
}

export function createEvent(body) {
    return Events.create(body)
}

export function updateEvent(body, id) {
    return Events.findOneAndUpdate({ _id: id }, body)
}

export function deleteEvent(id) {
    return Events.deleteOne({ _id: id })
}

export function getEventsByUser(id) {
    return Events.find({ players: { $all: [mongoose.Types.ObjectId(id)] } })
        .populate([
            {
                path: 'players',
                model: 'Users',
                select: 'firstname name elo email id ageCategory',
            },
        ])
        .lean()
}
