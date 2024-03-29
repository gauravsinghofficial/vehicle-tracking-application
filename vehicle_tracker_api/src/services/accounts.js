import {User} from '@/models';
import {generateKey} from '@/utils/token';

/**
 * Performs Login.
 * @param {Object} payload Login email and password.
 * @return {Object} Token.
 */
export async function performLoginService(payload) {
  const user = await User.findOne({email: payload.email, isActive: true});
  if (!user) return null;
  const success = await user.validatePassword(payload.password);
  if (!success) return null;
  if (!user.token) {
    user.token = {key: generateKey()};
    user.lastLogin = new Date();
    await user.save();
  }

  return {token: user.token.key};
}

/**
 * Retrieve User Details
 * @param {Object} user Request User
 * @return {Object} User Details
 */
export async function retrieveUserService(user) {
  const detail = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    dateJoined: user.dateJoined,
    isAdmin: user.isAdmin,
  };

  return detail;
}


/**
 * Perform Logout
 * @param {Object} user Request User
 * @return {Object} Empty Object
 */
export async function performLogoutService(user) {
  user.set('token', undefined, {strict: false});
  await user.save();
  return {};
}
