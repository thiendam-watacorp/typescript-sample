import { AuthenticationError } from 'apollo-server-express';

const isProduction = process.env.NODE_ENV === 'production';

const formatError = (err: any) => {
  if (isProduction) {
    // Don't give the specific errors to the client.
    if (err.message.startsWith('Database Error: ')) {
      return new Error('Internal server error');
    }
    // Otherwise return the original error. The error can also
    // be manipulated in other ways, as long as it's returned.
    if (err.originalError instanceof AuthenticationError) {
      return new Error('Different authentication error message!');
    }
  }

  return err;
};

export const ApolloHandler = {
  formatError,
};
