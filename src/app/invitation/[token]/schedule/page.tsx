import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { NanawaxLogo } from '@/components/NanawaxLogo'
import { TimeSlotPicker } from '@/components/client/TimeSlotPicker'
import { getMockGuestByToken, MOCK_EVENT } from '@/lib/mock-data'

interface Props {
  params: Promise<{ token: string }>
}

export default async function SchedulePage({ params }: Props) {
  const { token } = await params

  const guest = getMockGuestByToken(token)
  if (!guest) notFound()
  if (guest.status !== 'confirmed') redirect(`/invitation/${token}`)

  const slots = MOCK_EVENT.time_slots ?? []

  return (
    <div className="min-h-screen bg-nw-white">
      {/* Header */}
      <div className="border-b border-nw-black/8 px-4 py-4 flex items-center justify-between">
        <Link href={`/invitation/${token}/catalog`} className="text-nw-black/40 hover:text-nw-black transition-colors">
          <ArrowLeft size={16} strokeWidth={1.5} />
        </Link>
        <NanawaxLogo size="sm" />
        <div className="w-8" />
      </div>

      <div className="px-5 pt-8 pb-12 max-w-md mx-auto">
        <div className="mb-8">
          <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-camel mb-2">
            Créneau de passage
          </p>
          <h1 className="font-display font-light text-2xl">Choisissez votre heure</h1>
          <p className="text-sm text-nw-black/45 mt-2">
            Chaque créneau dure 30 minutes. Vous êtes libre de rester plus longtemps.
          </p>
        </div>

        <TimeSlotPicker token={token} slots={slots} />
      </div>
    </div>
  )
}
