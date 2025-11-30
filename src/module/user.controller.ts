import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user/user.service';
import {
  confirmEmailDto,
  loginDto,
  reSendOtpDto,
  signupDto,
} from './user/user.dto';
import type { UserWithRequest } from 'src/common/interfaces';
import { Auth } from 'src/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerLocal } from 'src/common/utils/multer';

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
  @Auth()
  @Get('profile')
  profile(@Request() req: UserWithRequest) {
    return { message: 'profile', user: req.user };
  }
  @Post('upload')
  @UseInterceptors(
    FileInterceptor(
      'attachment',
      multerLocal({ fileTypes: ['image/jpeg', 'image/png'] }),
    ),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { message: 'done', file };
  }
}
