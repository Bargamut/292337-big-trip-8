const path = require(`path`);

module.exports = {
  mode: `development`,
  entry: `./src/main.js`,
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `public`) // eslint-disable-line
  },
  devtool: `source-map`,
  devServer: {
    contentBase: path.join(__dirname, `public`), // eslint-disable-line
    publicPath: `http://localhost:8080/`
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [`style-loader`, `css-loader`]
      }
    ]
  }
};
