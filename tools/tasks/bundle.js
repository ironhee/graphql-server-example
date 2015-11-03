import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from '../webpack.config';
import { GRAPHQL_PORT } from '../../server/server';


function bundle() {
  return new Promise((resolve, reject) => {
    function onComplete(err, stats) {
      if (err) {
        return reject(err);
      }
      console.log(stats.toString(webpackConfig.stats));
      return resolve();
    }

    const bundler = webpack(webpackConfig);

    if (global.WATCH) {
      const server = new WebpackDevServer(bundler, {
        proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
        contentBase: path.resolve(__dirname, '../../static'),
        publicPath: '/static/',
        hot: true,
        stats: webpackConfig.stats,
        historyApiFallback: true,
      });
      server.listen(3000, 'localhost', function(err) {
        if (err) { console.log(err); }
        console.log('Listening at localhost:3000');
      });
    } else {
      bundler.run(onComplete);
    }
  });
}

export default bundle;
