// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';
module.exports = {
  optimization: {
    minimize: isProd,
  },
  compress: isProd,
  sassOptions: {
    includePaths: [path.join(__dirname, 'app/views/scss')],
  },
};
