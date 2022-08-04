/* eslint-disable no-console */

import { faker } from '@faker-js/faker'
import axios from 'axios'

const baseUrl = 'http://localhost:3000/api/'

async function populatePlayers(quantity) {
    let ids = []
    for (let i = 0; i < quantity; i++) {
        const json = {
            firstname: faker.name.firstName(),
            name: faker.name.lastName(),
            email: faker.internet.email(),
            password: '123',
            elo: faker.datatype.number(),
            type: 'PLAYER',
            ageCategory: 12,
        }
        try {
            const result = await axios.post(baseUrl + 'user/', json)
            ids.push(result.data._id)
        } catch (e) {
            console.error(e)
        }
    }
    return ids
}

async function populateEvents(quantity, users) {
    for (let i = 0; i < quantity; i++) {
        const json = {
            name: 'Tournament with ' + faker.company.companyName(),
            description: faker.company.catchPhrase(),
            date: faker.date.future(),
            players: users,
        }
        try {
            const result = await axios.post(baseUrl + '/event/', json)
            console.log(result.data)
        } catch (e) {
            console.error(e)
        }
    }
}

if (process.argv.length < 3) {
    console.error('Missing quantity argument')
    console.error(
        'usage: npm run populate <number of users (between 1 & 50)> <optional: number of events(between 1 & 50)>'
    )
    process.exit(1)
}
if (process.argv[2] > 50 || process.argv[2] < 0) {
    console.error('Pick a number between 1 and 50')
    console.error(
        'usage: npm run populate <number of users (between 1 & 50)> <optional: number of events(between 1 & 50)>'
    )
    process.exit(1)
}
const index = populatePlayers(process.argv[2]).then()
if (process.argv[3] && process.argv[3] < 50 && process.argv[3] > 0) {
    populateEvents(process.argv[3], index)
}
