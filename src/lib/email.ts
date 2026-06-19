import type { Guest, Event } from './types'
import { formatDate, formatTime } from './utils'

const FROM = 'Nanawax <invitations@nanawax.fr>'

function invitationBody(guest: Guest, event: Event, baseUrl: string) {
  const inviteUrl = `${baseUrl}/invitation/${guest.token}`
  return `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1A1A1A; background: #FAF8F5; padding: 40px 32px;">
  <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #B8835A; margin-bottom: 32px;">nanawax</p>
  <h1 style="font-size: 28px; font-weight: 300; margin: 0 0 8px;">Vous êtes invitée</h1>
  <p style="color: #666; margin: 0 0 32px;">${guest.name}</p>
  <p style="border-left: 2px solid #B8835A; padding-left: 16px; margin: 0 0 8px;"><strong>${event.name}</strong></p>
  <p style="border-left: 2px solid #B8835A; padding-left: 16px; margin: 0 0 32px; color: #555;">${formatDate(event.date)} · ${formatTime(event.date)}<br>${event.location}</p>
  <a href="${inviteUrl}" style="display: block; background: #B8835A; color: #FAF8F5; text-align: center; padding: 16px 32px; text-decoration: none; font-size: 14px; letter-spacing: 0.05em;">Voir mon invitation →</a>
</div>
  `
}

function confirmationBody(guest: Guest, event: Event) {
  return `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1A1A1A; background: #FAF8F5; padding: 40px 32px;">
  <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #B8835A; margin-bottom: 32px;">nanawax</p>
  <h1 style="font-size: 28px; font-weight: 300; margin: 0 0 8px;">Votre venue est confirmée</h1>
  <p style="color: #666; margin: 0 0 32px;">${guest.name}, nous avons hâte de vous accueillir.</p>
  <p style="border-left: 2px solid #B8835A; padding-left: 16px; margin: 0;"><strong>${event.name}</strong><br>${formatDate(event.date)}, ${formatTime(event.date)}<br>${event.location}</p>
</div>
  `
}

function reminderBody(guest: Guest, event: Event, baseUrl: string) {
  const inviteUrl = `${baseUrl}/invitation/${guest.token}`
  return `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1A1A1A; background: #FAF8F5; padding: 40px 32px;">
  <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #B8835A; margin-bottom: 32px;">nanawax</p>
  <h1 style="font-size: 24px; font-weight: 300; margin: 0 0 16px;">Rappel — Répondez-vous à l'invitation ?</h1>
  <p style="color: #555; margin: 0 0 32px;">Les places sont limitées. Si vous souhaitez confirmer votre présence, faites-le dès maintenant.</p>
  <a href="${inviteUrl}" style="display: block; background: #1A1A1A; color: #FAF8F5; text-align: center; padding: 16px 32px; text-decoration: none; font-size: 14px; letter-spacing: 0.05em;">Répondre à l'invitation →</a>
</div>
  `
}

function reminderD1Body(guest: Guest, event: Event) {
  return `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1A1A1A; background: #FAF8F5; padding: 40px 32px;">
  <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #B8835A; margin-bottom: 32px;">nanawax</p>
  <h1 style="font-size: 24px; font-weight: 300; margin: 0 0 16px;">À demain, ${guest.name.split(' ')[0]} !</h1>
  <p style="color: #555; margin: 0 0 24px;">Nous vous rappelons votre rendez-vous Nanawax :</p>
  <p style="border-left: 2px solid #B8835A; padding-left: 16px; margin: 0;"><strong>${event.name}</strong><br>${formatDate(event.date)}, ${formatTime(event.date)}<br>${event.location}</p>
</div>
  `
}

export async function sendInvitationEmail(guest: Guest, event: Event, baseUrl: string) {
  if (!process.env.RESEND_API_KEY) return
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: FROM,
    to: guest.email,
    subject: `Invitation — ${event.name}`,
    html: invitationBody(guest, event, baseUrl),
  })
}

export async function sendConfirmationEmail(guest: Guest, event: Event) {
  if (!process.env.RESEND_API_KEY) return
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: FROM,
    to: guest.email,
    subject: `Confirmation — ${event.name}`,
    html: confirmationBody(guest, event),
  })
}

export async function sendReminderEmail(guest: Guest, event: Event, baseUrl: string) {
  if (!process.env.RESEND_API_KEY) return
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: FROM,
    to: guest.email,
    subject: `Rappel — Votre invitation Nanawax`,
    html: reminderBody(guest, event, baseUrl),
  })
}

export async function sendD1ReminderEmail(guest: Guest, event: Event) {
  if (!process.env.RESEND_API_KEY) return
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: FROM,
    to: guest.email,
    subject: `Demain — ${event.name}`,
    html: reminderD1Body(guest, event),
  })
}
