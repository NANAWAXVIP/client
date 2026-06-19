export type GuestStatus = 'pending' | 'confirmed' | 'declined'

export interface Event {
  id: string
  name: string
  date: string
  location: string
  capacity: number
  time_slots?: string[]
  created_at: string
}

export interface Guest {
  id: string
  event_id: string
  name: string
  email: string
  phone?: string
  token: string
  status: GuestStatus
  time_slot?: string
  created_at: string
  confirmed_at?: string
}

export interface CatalogItem {
  id: string
  event_id: string
  name: string
  price: number
  image_url?: string
  created_at: string
}

export interface Favorite {
  id: string
  guest_id: string
  catalog_item_id: string
}

export type PreRegStatus = 'pending' | 'registered' | 'expired'

export interface PreRegistration {
  id: string
  event_id: string
  phone?: string   // renseigné par la personne lors de son inscription, pas par Maureen
  token: string
  status: PreRegStatus
  guest_id?: string
  created_at: string
  registered_at?: string
}

export interface Message {
  id: string
  event_id: string
  content: string
  file_url?: string
  file_name?: string
  file_type?: string
  created_at: string
  recipient_ids: string[]
}

export interface MessageWithRead extends Message {
  read_at?: string
}

export interface EventWithStats extends Event {
  confirmed_count: number
  pending_count: number
  declined_count: number
  remaining_spots: number
  guests?: Guest[]
}
