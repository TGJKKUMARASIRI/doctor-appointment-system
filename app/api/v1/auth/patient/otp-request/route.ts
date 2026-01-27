import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSmsProvider } from '@/lib/sms'

export async function POST(req: NextRequest) {
    try {
        const { mobile } = await req.json()

        if (!mobile) {
            return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 })
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

        // Store OTP in Database
        await prisma.oTP.upsert({
            where: { mobile },
            update: {
                code: otp,
                expiresAt
            },
            create: {
                mobile,
                code: otp,
                expiresAt
            }
        })

        // Send OTP via configured provider
        const smsProvider = getSmsProvider()
        await smsProvider.sendSms(mobile, `Your OTP for Doctor Appointment System is ${otp}`)

        return NextResponse.json({ message: 'OTP sent successfully' })
    } catch (error) {
        console.error('OTP request error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

