/* eslint-disable no-unused-vars */
import Logger from './logger.js'
import nodemailer from 'nodemailer'

async function sendInvitationMail(event, firstname, id, mail) {
    try {
        let testAccount = await nodemailer.createTestAccount()

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            name: testAccount.smtp.name,
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
            logger: true,
            debug: true,
        })

        // send mail with defined transport object
        const eventDate = new Date(event.date)
        let info = await transporter.sendMail({
            from: 'Vandoeuvre Echecs <fake@fake.fk>', // sender address
            to: 'emailtestertest@yopmail.com', // list of receivers
            subject: 'Invitation tournoi en équipe', // Subject line
            text: `Bonjour ${firstname}, je t'envoie ce mail afin de t'inviter à l'évènement ${
                event.name
            } qui aura lieu le ${eventDate.toLocaleDateString('fr-FR')}.
      Je t'invite à te rendre sur ce lien afin de confirmer ou refuser l'invitation: http://vandoeuvre-echecs/invitations/${
          event.id
      }/${id}/
      Merci d'avance, cordialement.
      
      Claude ton mentor`, // plain text body
        })
    } catch (e) {
        Logger.error(`Error when mail was send: ${e.message}`)
    }
}

export default sendInvitationMail
