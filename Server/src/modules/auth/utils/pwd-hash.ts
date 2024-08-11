import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    return '';
  }
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);

    return isMatch;
  } catch (error) {
    return false;
  }
}
