import * as jose from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export async function signToken(payload: any) {
    return await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET)
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jose.jwtVerify(token, JWT_SECRET)
        return payload
    } catch (error) {
        console.error('Token verification error:', error)
        return null
    }
}
