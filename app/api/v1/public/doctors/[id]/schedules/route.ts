import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: doctorId } = await params
        const { searchParams } = new URL(req.url)

        // Default to next 7 days if no range provided
        const now = new Date()
        const today = new Date(now.setHours(0, 0, 0, 0))
        const sevenDaysLater = new Date(now.setDate(now.getDate() + 7))
        sevenDaysLater.setHours(23, 59, 59, 999)

        const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : today
        const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : sevenDaysLater

        const schedules = await prisma.schedule.findMany({
            where: {
                doctorId,
                status: 'PUBLISHED',
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                _count: {
                    select: {
                        slots: {
                            where: { status: 'AVAILABLE' }
                        }
                    }
                }
            },
            orderBy: {
                date: 'asc'
            }
        })

        // Format for frontend
        const result = schedules.map(s => ({
            id: s.id,
            date: s.date,
            startTime: s.startTime,
            endTime: s.endTime,
            availableSlots: s._count.slots
        }))

        return NextResponse.json(result)
    } catch (error) {
        console.error('Fetch doctor schedules error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
