import type { Event, Guest, CatalogItem, Message, PreRegistration } from './types'

export const MOCK_EVENT: Event = {
  id: 'evt-1',
  name: 'Vente Privée Été 2026',
  date: '2026-07-05T15:00:00.000Z',
  location: 'Showroom Nanawax — 12 rue des Arts, Paris 11e',
  capacity: 30,
  time_slots: ['15h00 – 15h30', '15h30 – 16h00', '16h00 – 16h30', '16h30 – 17h00', '17h00 – 17h30', '17h30 – 18h00'],
  created_at: '2026-06-01T10:00:00.000Z',
}

export const MOCK_GUESTS: Guest[] = [
  {
    id: 'g-1', event_id: 'evt-1', name: 'Amara Diallo', email: 'amara@example.com',
    phone: '+33612345678',
    token: 'demo-confirmed', status: 'confirmed',
    created_at: '2026-06-01T10:00:00Z', confirmed_at: '2026-06-02T09:00:00Z',
  },
  {
    id: 'g-2', event_id: 'evt-1', name: 'Fatoumata Bah', email: 'fato@example.com',
    phone: '+33623456789',
    token: 'tok_fato', status: 'confirmed',
    created_at: '2026-06-01T10:00:00Z', confirmed_at: '2026-06-02T14:00:00Z',
  },
  {
    id: 'g-3', event_id: 'evt-1', name: 'Mariama Keïta', email: 'mariama@example.com',
    phone: '+33634567890',
    token: 'demo-pending', status: 'pending',
    created_at: '2026-06-01T10:00:00Z',
  },
  {
    id: 'g-4', event_id: 'evt-1', name: 'Aïssatou Camara', email: 'aissatou@example.com',
    token: 'tok_aissatou', status: 'pending',
    created_at: '2026-06-01T10:00:00Z',
  },
  {
    id: 'g-5', event_id: 'evt-1', name: 'Rokiatou Barry', email: 'rokia@example.com',
    phone: '+33656789012',
    token: 'tok_rokia', status: 'declined',
    created_at: '2026-06-01T10:00:00Z',
  },
  {
    id: 'g-6', event_id: 'evt-1', name: 'Oumou Balde', email: 'oumou@example.com',
    phone: '+33667890123',
    token: 'tok_oumou', status: 'confirmed',
    created_at: '2026-06-01T10:00:00Z', confirmed_at: '2026-06-03T11:00:00Z',
  },
  {
    id: 'g-7', event_id: 'evt-1', name: 'Kadiatou Sow', email: 'kadia@example.com',
    token: 'tok_kadia', status: 'pending',
    created_at: '2026-06-01T10:00:00Z',
  },
]

export const MOCK_CATALOG: CatalogItem[] = [
  {
    id: 'c-1', event_id: 'evt-1', name: 'Robe Kente Fluid',
    price: 185, image_url: undefined, created_at: '2026-06-01T10:00:00Z',
  },
  {
    id: 'c-2', event_id: 'evt-1', name: 'Ensemble Bogolan',
    price: 220, image_url: undefined, created_at: '2026-06-01T10:00:00Z',
  },
  {
    id: 'c-3', event_id: 'evt-1', name: 'Kimono Wax Géo',
    price: 165, image_url: undefined, created_at: '2026-06-01T10:00:00Z',
  },
  {
    id: 'c-4', event_id: 'evt-1', name: 'Caftan Zébré',
    price: 195, image_url: undefined, created_at: '2026-06-01T10:00:00Z',
  },
  {
    id: 'c-5', event_id: 'evt-1', name: 'Top Wax Asymétrique',
    price: 98, image_url: undefined, created_at: '2026-06-01T10:00:00Z',
  },
  {
    id: 'c-6', event_id: 'evt-1', name: 'Pantalon Wide Kente',
    price: 135, image_url: undefined, created_at: '2026-06-01T10:00:00Z',
  },
]

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    event_id: 'evt-1',
    content: 'Votre cadeau exclusif Nanawax 🖤 En remerciement de votre fidélité, voici votre invitation VIP pour le concert Aya Nakamura au Zénith de Paris. Profitez bien !',
    file_url: '#mock-ticket',
    file_name: 'invitation-concert-aya-nakamura.pdf',
    file_type: 'application/pdf',
    created_at: '2026-06-15T10:00:00Z',
    recipient_ids: ['g-1', 'g-2', 'g-6'],
  },
  {
    id: 'msg-2',
    event_id: 'evt-1',
    content: 'Petit bonus pour votre venue samedi ✨ Votre bon de réduction de 20% valable sur toute la collection.',
    file_url: '#mock-voucher',
    file_name: 'bon-reduction-20pct.pdf',
    file_type: 'application/pdf',
    created_at: '2026-06-18T14:30:00Z',
    recipient_ids: ['g-1'],
  },
]

export function getMockMessagesForGuest(guestId: string): Message[] {
  return MOCK_MESSAGES.filter(m => m.recipient_ids.includes(guestId))
}

export const MOCK_PRE_REGS: PreRegistration[] = [
  {
    id: 'pr-1', event_id: 'evt-1',
    phone: '+33698765432', token: 'demo-prereg-pending',
    status: 'pending', created_at: '2026-06-18T10:00:00Z',
  },
  {
    id: 'pr-2', event_id: 'evt-1',
    phone: '+33687654321', token: 'demo-prereg-used',
    status: 'registered', guest_id: 'g-1',
    created_at: '2026-06-17T10:00:00Z', registered_at: '2026-06-17T11:30:00Z',
  },
]

export function getMockPreRegByToken(token: string): PreRegistration | undefined {
  return MOCK_PRE_REGS.find(p => p.token === token)
}

export function maskPhone(phone: string): string {
  if (phone.length < 6) return phone
  const visible = phone.slice(-2)
  const prefix = phone.slice(0, phone.startsWith('+') ? 4 : 3)
  return `${prefix} ·· ·· ·· ${visible}`
}

export function getMockGuestByToken(token: string): Guest | undefined {
  return MOCK_GUESTS.find(g => g.token === token)
}

export function getMockEventStats() {
  const confirmed = MOCK_GUESTS.filter(g => g.status === 'confirmed').length
  const pending = MOCK_GUESTS.filter(g => g.status === 'pending').length
  const declined = MOCK_GUESTS.filter(g => g.status === 'declined').length
  const remaining = Math.max(0, MOCK_EVENT.capacity - confirmed)
  return { confirmed, pending, declined, remaining }
}
