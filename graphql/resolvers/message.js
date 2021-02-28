const { UserInputError, AuthenticationError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const { User, Message } = require('../../models');
const { JWT_SECRET } = require('../../config/env.json');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
module.exports = {
  Query: {
    getMessages: async (_, args, context) => {
      try {
        const { user } = context;
        if (!user) throw new AuthenticationError('Unanthenticated');

        const { from } = args;
        const friend = await User.findOne({ where: { username: from } });
        if (!friend) throw new UserInputError('User not found');

        const usernames = [user.username, friend.username];
        const messages = await Message.findAll({
          where: {
            from: { [Op.in]: usernames },
            to: { [Op.in]: usernames }
          },
          order: [['createdAt', 'DESC']]
        });
        return messages;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  },
  Mutation: {
    sendMessage: async (_, args, context) => {
      const { user } = context;
      if (!user) throw new AuthenticationError('Unanthenticated');
      const { to, content } = args;
      if (content.trim() === '') throw new UserInputError('Message is empty');
      const recipient = await User.findOne({ where: { username: to } });
      if (user.username === recipient.username)
        throw new UserInputError("You can't message yourself ");
      if (!recipient) throw new UserInputError('User not found');
      const message = await Message.create({
        from: user.username,
        to,
        content
      });
      return message;
    }
  }
};
