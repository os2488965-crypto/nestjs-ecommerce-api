import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user/user.service';
import {
  confirmEmailDto,
  loginDto,
  reSendOtpDto,
  signupDto,
} from './user/user.dto';
import type { UserWithRequest } from 'src/common/interfaces';
import { AuthenticationGuard } from 'src/common/guards';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('SignUp')
  SignUp(@Body() body: signupDto) {
    // return { body, query };
    return this.userService.signUp(body);
  }
  @Post('reSendOtp')
  reSendOtp(@Body() body: reSendOtpDto) {
    // return { body, query };
    return this.userService.reSendOtp(body);
  }
  @Patch('comfrimEmail')
  confirmEmail(@Body() body: confirmEmailDto) {
    // return { body, query };
    return this.userService.confirmEmail(body);
  }
  @Post('login')
  login(@Body() body: loginDto) {
    // return { body, query };
    return this.userService.login(body);
  }
  @UseGuards(AuthenticationGuard)
  @Get('profile')
  profile(@Request() req: UserWithRequest) {
    return { message: 'profile', user: req.user };
  }
}
