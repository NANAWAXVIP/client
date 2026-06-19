import type { Guest, Event } from './types'
import { formatDate, formatTime } from './utils'

function twilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  if (!accountSid || !authToken) return null
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const twilio = require('twilio')
  return twilio(accountSid, authToken)
}

const FROM = process.env.TWILIO_WHATSAPP_FROM ?? 'whatsapp:+14155238886'

function toWhatsApp(phone: string): string {
  return phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`
}

function invitationText(guest: Guest, event: Event, baseUrl: string): string {
  const firstName = guest.name.split(' ')[0]
  const inviteUrl = `${baseUrl}/invitation/${guest.token}`
  return (
    `Bonjour ${firstName} 🖤\n\n` +
    `Vous êtes invitée à la vente privée *Nanawax*.\n\n` +
    `📅 ${formatDate(event.date)}\n` +
    `🕐 ${formatTime(event.date)}\n` +
    `📍 ${event.location}\n\n` +
    `Confirmez votre venue ici :\n${inviteUrl}\n\n` +
    `_Lien personnel & confidentiel._`
  )
}

function reminderText(guest: Guest, event: Event, baseUrl: string): string {
  const firstName = guest.name.split(' ')[0]
  const inviteUrl = `${baseUrl}/invitation/${guest.token}`
  return (
    `Bonjour ${firstName},\n\n` +
    `Vous n'avez pas encore répondu à l'invitation Nanawax 🖤\n\n` +
    `📅 ${formatDate(event.date)} · ${formatTime(event.date)}\n` +
    `📍 ${event.location}\n\n` +
    `Les places sont limitées — répondez vite :\n${inviteUrl}`
  )
}

function d1ReminderText(guest: Guest, event: Event): string {
  const firstName = guest.name.split(' ')[0]
  return (
    `À demain ${firstName} 🖤\n\n` +
    `Rappel : votre vente privée *Nanawax* est *demain*.\n\n` +
    `📅 ${formatDate(event.date)}\n` +
    `🕐 ${formatTime(event.date)}\n` +
    `📍 ${event.location}\n\n` +
    `À très vite !`
  )
}

async function send(to: string, body: string): Promise<void> {
  const client = twilioClient()
  if (!client) return
  await client.messages.create({ from: FROM, to: toWhatsApp(to), body })
}

export async function sendWhatsAppPreRegLink(phone: string, token: string, eventName: string, baseUrl: string): Promise<void> {
  const client = twilioClient()
  if (!client) return
  const registerUrl = `${baseUrl}/rejoindre/${token}`
  const body =
    `Bonjour 🖤\n\n` +
    `*Nanawax* vous réserve un accès privé à sa prochaine vente : *${eventName}*.\n\n` +
    `Ce lien vous est adressé personnellement. Il ne peut pas être partagé — il ne fonctionne qu'une seule fois.\n\n` +
    `→ S'inscrire : ${registerUrl}`
  await client.messages.create({ from: FROM, to: toWhatsApp(phone), body })
}

export async function sendWhatsAppInvitation(guest: Guest, event: Event, baseUrl: string): Promise<void> {
  if (!guest.phone) return
  await send(guest.phone, invitationText(guest, event, baseUrl))
}

export async function sendWhatsAppReminder(guest: Guest, event: Event, baseUrl: string): Promise<void> {
  if (!guest.phone) return
  await send(guest.phone, reminderText(guest, event, baseUrl))
}

export async function sendWhatsAppD1Reminder(guest: Guest, event: Event): Promise<void> {
  if (!guest.phone) return
  await send(guest.phone, d1ReminderText(guest, event))
}

export async function sendWhatsAppGift(
  guest: Guest,
  messageText: string,
  fileName: string | undefined,
  fileUrl: string | undefined,
  baseUrl: string
): Promise<void> {
  if (!guest.phone) return
  const client = twilioClient()
  if (!client) return

  const firstName = guest.name.split(' ')[0]
  const inboxUrl = `${baseUrl}/invitation/${guest.token}/messages`

  const body =
    `🖤 Nanawax — Pour vous, ${firstName}\n\n` +
    `${messageText}\n\n` +
    (fileUrl && !fileUrl.startsWith('#')
      ? `Voir votre cadeau : ${inboxUrl}`
      : `Retrouvez-le dans votre espace : ${inboxUrl}`)

  // If file is a publicly accessible URL, send as media attachment
  const isPublicUrl = fileUrl && !fileUrl.startsWith('#') && fileUrl.startsWith('http')

  await client.messages.create({
    from: FROM,
    to: toWhatsApp(guest.phone),
    body,
    ...(isPublicUrl ? { mediaUrl: [fileUrl] } : {}),
  })
}
