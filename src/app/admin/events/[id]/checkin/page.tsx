import { createClient } from '@/lib/supabase/server'
import { CheckinBoard } from '@/components/admin/CheckinBoard'
import { redirect } from 'next/navigation'

export const revalidate = 0

interface Props { params: Promise<{ id: string }> }

export default async function CheckinPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event } = await supabase.from('events').select('*').eq('id', id).single()
  if (!event) redirect('/admin')

  const { data: guests } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', id)
    .eq('status', 'confirmed')
    .order('name', { ascending: true })

  return <CheckinBoard event={event} initialGuests={guests ?? []} />
}
