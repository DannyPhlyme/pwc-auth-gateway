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

export { Status, TokenReason, MaritalStatus, Gender, ImageType };
