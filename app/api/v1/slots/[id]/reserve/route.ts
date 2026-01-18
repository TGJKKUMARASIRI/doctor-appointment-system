import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const runtime = 'edge'

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: slotId } = await params
        const token = req.cookies.get('token')?.value
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const decoded: any = await verifyToken(token)
        if (!decoded || decoded.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const slot = await prisma.slot.update({
            where: { id: slotId },
            data: {
                status: 'RESERVED_MANUAL'
            }
        })

        return NextResponse.json(slot)
    } catch (error) {
        console.error('Slot reservation error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
