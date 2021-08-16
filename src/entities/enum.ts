import { EmailTemplateDto } from '../dtos/auth/emailTemplate.dto';
enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

enum TokenReason {
  REFRESH_TOKEN = 'refresh-token',
  VERIFY_EMAIL = 'verify-email',
  FORGOT_PASSWORD = 'forgot-password',
  RESET_PASSWORD = 'reset-password'
}

enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  SEPARATED = 'separated',
}

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

enum ImageType {
  JPEG = 'jpeg',
  PNG = 'png',
}

const emailTemplate = (emailName:string, email:string, token?:string) => {
  switch (emailName) {
    case 'registerEmail':
      return {
        msgTo: email,
        template: '3624'
      }
    case 'verificationEmail':
      return {
        msgTo: email,
        template: '3048'
      }
    case 'forgotPassword':
      return {
        msgTo: email,
        template: 3698
      }
    case 'referralRegistered':
      return {
        msgTo: email,
        template: '3779'
      }
    case 'resetPassword':
      return {
        msgTo: email,
        template: 3731
      }
    default: return ''
  }
}

export { Status, TokenReason, MaritalStatus, Gender, ImageType, emailTemplate};
