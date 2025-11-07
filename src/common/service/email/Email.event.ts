// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-misused-promises */
// import { EventEmitter } from 'events';
// import { sendEmail } from './sendEmail';
// import { emailTemplate } from './email.templete';
// import { OtpTypeEnum } from 'src/common/enums';
// export const eventEmitter = new EventEmitter();

// eventEmitter.on(OtpTypeEnum.CONFIRM_EMAIL, async (data) => {
//   const { email, otp } = data;
//   await sendEmail({
//     to: email,
//     subject: OtpTypeEnum.CONFIRM_EMAIL,
//     html: emailTemplate(otp, OtpTypeEnum.CONFIRM_EMAIL),
//   });
// });

// eventEmitter.on(OtpTypeEnum.FORGET_PASSWORD, async (data) => {
//   const { otp, email } = data;
//   await sendEmail({
//     to: email,
//     subject: OtpTypeEnum.FORGET_PASSWORD,
//     html: emailTemplate(otp, OtpTypeEnum.FORGET_PASSWORD),
//   });
// });
