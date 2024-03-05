import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @Post('/signin')
    signIn(){
        return this.authService.signIn();
    }

    @Post('/signup')
    signUp(@Body() payload: AuthDto): Promise<Tokens>{
        return this.authService.signUp(payload);
    }

    @Post('/logout')
    logOut(){
        return this.authService.logOut();
    }

    @Post('/refresh')
    refreshToken(){
        return this.authService.refreshToken();
    }
}
