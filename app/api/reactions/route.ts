import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase/client'
import { isAllowedReaction, REACTION_COLUMN_MAP } from '../../../lib/constants/reactions'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const slug = body.slug
    const reaction = body.reaction || body.reaction_type
    const sessionId = body.sessionId || body.session_id

    // Validate presence and type of required fields
    if (!slug || typeof slug !== 'string' || !sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { error: 'Parameter slug dan sessionId wajib disertakan.' },
        { status: 400 }
      )
    }

    // Validate reaction against strict allowlist (fire, insightful, rocket, applause)
    if (!isAllowedReaction(reaction)) {
      return NextResponse.json(
        { error: 'Jenis reaksi tidak valid. Hanya diizinkan: fire, insightful, rocket, applause.' },
        { status: 400 }
      )
    }

    // Explicit mapping to prevent arbitrary column writes
    const dbColumn = REACTION_COLUMN_MAP[reaction]
    if (!dbColumn) {
      return NextResponse.json(
        { error: 'Pemetaan kolom database tidak ditemukan.' },
        { status: 400 }
      )
    }

    // Execute toggle_reaction RPC in Supabase
    const { error } = await supabase.rpc('toggle_reaction', {
      post_slug: slug,
      user_session_id: sessionId,
      reaction_type: reaction,
    })

    if (error) {
      console.warn('[API/reactions] Error RPC toggle_reaction:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      reaction,
      column: dbColumn,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Format permintaan tidak valid.' },
      { status: 400 }
    )
  }
}
