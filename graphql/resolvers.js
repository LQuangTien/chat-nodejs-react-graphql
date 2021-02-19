const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
module.exports = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.findAll();
        return users;
      } catch (error) {
        console.log(error);
      }
    }
  },
  Mutation: {
    register: async (a, args) => {
      const { username, email, password, confirmPassword } = args;
      let errors = {};
      try {
        if (username.trim() === '')
          errors.username = 'Username not must be empty';
        if (email.trim() === '') errors.email = 'Email not must be empty';
        if (password.trim() === '')
          errors.password = 'Password not must be empty';
        if (confirmPassword.trim() === '')
          errors.confirmPassword = 'Confirm password not must be empty';
        if (confirmPassword !== password)
          errors.confirmPassword = 'Password not match';
        // const userByUsername = await User.findOne({ where: { username } });
        // const userByEmail = await User.findOne({ where: { email } });
        // if (userByUsername) errors.username = 'Username is taken';
        // if (userByEmail) errors.email = 'Email is taken';
        if (Object.keys(errors).length > 0) {
          throw errors;
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          username,
          email,
          password: hashPassword
        });
        return user;
      } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
          err.errors.forEach(
            (e) =>
              (errors[e.path.split('.')[1]] = `${
                e.path.split('.')[1]
              } is already taken`)
          );
        } else if (err.name === 'SequelizeValidationError') {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError('Bad input', { errors });
      }
    }
  }
};
