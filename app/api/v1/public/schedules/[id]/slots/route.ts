import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: scheduleId } = await params

        const slots = await prisma.slot.findMany({
            where: {
                scheduleId,
                status: 'AVAILABLE'
            },
            orderBy: {
                time: 'asc'
            }
        })

        return NextResponse.json(slots)
    } catch (error) {
        console.error('Fetch public schedule slots error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
