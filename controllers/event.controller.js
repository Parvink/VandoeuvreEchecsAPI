import Logger from "../utils/logger.js";
import isObjectId from "../utils/idvalidator.js";
import sendInvitationMail from "../utils/mailer.js"
import { eventService } from "../services/index.js";

/*
  CRUD method: Search all the content objects in the DB and send them as an array.
*/
export async function getEvents(req, res) {
  try {
    const events = await eventService.getEvents();
    if (!events) {
      Logger.error("Events collection was empty");
      return res.status(500).json("Events collection was empty");
    }
    return res.status(200).json(events);
  } catch (e) {
    Logger.error(e);
    return res.status(500).json(e);
  }
}

/*
  CRUD method: Search a content object with his id in the DB and send it as an object.
*/
export async function getEvent(req, res) {
  if (!req.params.id) {
    Logger.error("Id parameter not found or not an objectId");
    return res
      .status(400)
      .json({ error: "Id parameter not found or not an objectId" });
  }
  try {
    const event = await eventService.getEvent(req.params.id);
    if (!event) {
      Logger.error("Event not found in the database");
      return res.status(404).json({ error: "Event not found in the database" });
    }
    return res.status(200).json(event);
  } catch (e) {
    Logger.error(e.message);
    return res.status(400).json(e);
  }
}

export async function addNewEvent(req, res) {
  const event = await eventService.createEvent(req.body);
  if (!event || event.errors) {
    Logger.error("Error when creating event");
    return res.status(400).json(event);
  }
  return res.status(201).json(event);
}

//TODO needs more testing, success all the time even with unexisting keys
export async function updateEvent(req, res) {
  const { id } = req.params;
  const event = await eventService.getEvent(id);
  if (!event) {
    Logger.error("Unable to update the event");
    return res.status(500).json({ error: "Unable to update the event" });
  }
  for (const [key, value] of Object.entries(req.body)) {
    event[key] = value;
  }
  try {
    event.save();
    return res.status(200).json({ message: "Event was updated with success" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}
/*
  CRUD method: Search a content object with his id in the DB,
  remove it and send back a confirmation.
*/
export async function deleteEvent(req, res) {
  if (!req.params.id) {
    Logger.error("Id parameter not found or not an objectId");
    return res
      .status(400)
      .json({ error: "Id parameter not found or not an objectId" });
  }
  const eventDeleted = await eventService.deleteEvent(req.params.id);
  if (!eventDeleted || eventDeleted.deletedCount == 0) {
    Logger.error("Unable to delete this event");
    return res
      .status(404)
      .json({ error: "Unable to delete a event with this parameter" });
  }
  return res.status(200).json({ message: "Event was deleted with success" });
}

/*
  CRUD method: Search all the content objects in the DB and send them as an array.
*/
export async function getEventsByUser(req, res) {
  const events = await eventService.getEventsByUser(req.params.id);
  if (!events) {
    Logger.error("No events found for this user");
    return res.status(404).json("No events founds for this user");
  }
  return res.status(200).json(events);
}

export async function confirmParticipation(req, res) {
  let { userId, eventId } = req.params;
  if (!isObjectId(userId) || !isObjectId(eventId)) {
    Logger.error("One of the id parameters not found or not an objectId");
    return res
      .status(400)
      .json({ error: "One of the id parameters not found or not an objectId" });
  }
  const event = await eventService.getEvent(eventId);
  if (!event) {
    Logger.error("No events found with this id");
    return res.status(404).json("No events found with this id");
  }
  const alreadyExists = event.players.some(
    (val) => val.id.toString() === userId
  );
  if (alreadyExists) {
    Logger.error(`User already joined the event with id ${eventId}`);
    return res
      .status(400)
      .json({ error: `User already joined the event with id ${eventId}` });
  }
  event.players.push(userId);
  let updatedEvent = await event.save();
  return res
    .status(200)
    .json({ message: "The user successfully joined this event" });
}

export async function addToTeam(req, res) {
  let { userId, eventId } = req.params;
  if (!isObjectId(userId) || !isObjectId(eventId)) {
    Logger.error("One of the id parameters not found or not an objectId");
    return res
      .status(400)
      .json({ error: "One of the id parameters not found or not an objectId" });
  }
  const event = await eventService.getEvent(eventId);
  if (!event) {
    Logger.error("No events found with this id");
    return res.status(404).json("No events found with this id");
  }
  const alreadyExists = event.players.some(
    (val) => val.id.toString() === userId
  );
  if (alreadyExists) {
    Logger.error(
      `User already part of the team for the event with id ${eventId}`
    );
    return res
      .status(400)
      .json({
        error: `User already part of team for the the event with id ${eventId}`,
      });
  }
  event.players.push(userId);
  try {
    let updatedEvent = await event.save();
    return res
      .status(200)
      .json({ message: "The user successfully joined this event" });
  } catch (e) {
    Logger.error(e.message);
    return res.status(500).json(e.message);
  }
}

//TODO: Middleware id for this one
export async function invitePlayers(req, res) {
  let { id } = req.params;
  let { players } = req.body;
  if (!players) {
    Logger.error("The body does not contain the players");
    return res
      .status(400)
      .json({ error: "The body does not contain the players" });
  }
  let event = await eventService.getEvent(id);
  if (!event) {
    Logger.error("No events found with this id");
    return res.status(404).json("No events found with this id");
  }
  let alreadyAccepted, alreadyInvited;
  let newInvitations = []
  for (let i = 0; i < players.length; i++) {
    alreadyAccepted = event.players.some(
      (val) => val.id.toString() === players[i]
    );
    alreadyInvited = event.invitedPlayers.some(
      (val) => val.userId.toString() === players[i]
    );
    if (!alreadyInvited && !alreadyAccepted) {
      newInvitations.push({ userId: players[i], answered: false });
    }
    if (newInvitations.length == 0) {
      return res.status(400).json({ error: 'These users have already been invited'})
    }
  }
  try {
    event.invitedPlayers = event.invitedPlayers.concat(newInvitations)
    event = await event.save();
    sendInvitationMail(event, 'Arthur', '6284b03df4b418213804b722', "skurtskurt@mail.com", )
    return res
      .status(200)
      .json({ message: "The players have been invited with success" });
  } catch (e) {
    Logger.error(e.message);
    return res.status(500).json(e.message);
  }
}
