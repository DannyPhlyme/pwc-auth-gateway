export class AuthUtils {

  private generate_string(length: number): string{
    let result: string
    const characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public async generate_referral_code(firstname: string) {
    try {
      const firstThree = firstname.substring(0, 3);
      const lastThree = this.generate_string(3)
    } catch (e) {
      
    }
  }

  public async find_referrer(referral_code: string) {
    const referrer = "referrer"

    if (!referrer) {
      return false
    }
    return referrer
  }

}