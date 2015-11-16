import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from '../webpack.config';
import { GRAPHQL_PORT, STATIC_PORT } from '../../config';


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
        proxy: {
          '/auth': `http://localhost:${GRAPHQL_PORT}`,
          '/graphql': `http://localhost:${GRAPHQL_PORT}`,
        },
        contentBase: path.resolve(__dirname, '../../static'),
        publicPath: '/static/',
        hot: true,
        stats: webpackConfig.stats,
        historyApiFallback: true,
      });
      server.listen(STATIC_PORT, 'localhost', function(err) {
        if (err) { console.log(err); }
        console.log(`Listening at localhost:${STATIC_PORT}`);
      });
    } else {
      bundler.run(onComplete);
    }
  });
}

export default bundle;
