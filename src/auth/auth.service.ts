import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from "bcrypt"
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService,
        private jwtService: JwtService) { }

    hashData(data: string) {
        return bcrypt.hash(data, 10)
    }


    async getTokens(userId: number, email: string) {
        const [at, rt ] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email
            }, {
                secret: 'at-secret',
                expiresIn: 60 * 15
            }), 

            this.jwtService.signAsync({
                sub: userId,
                email
            }, {
                secret: 'rt-secret',
                expiresIn: 60 * 60 * 24 * 7
            })
        ])
        
        return {
            access_token: at,
            refresh_token: rt,
        }
    }
    async signUp(payload: AuthDto): Promise<Tokens> {
        const hashedPassword = await this.hashData(payload.password)
        const newUser = await this.prisma.user.create({
            data: {
                username: payload.username,
                password: hashedPassword,
                email: payload.email,
            }
        })
        const tokens = await this.getTokens(newUser.id, newUser.email)
        return tokens

    }

    signIn() {

    }

    logOut() { }

    refreshToken() { }
}
