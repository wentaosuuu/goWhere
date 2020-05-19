import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import 'normalize.css/normalize.css'; // 通过npm i normalize.css --save获取

import store from './store';
import './index.css';
import App from './App';

import * as serviceWorker from '../serviceWorker';

ReactDom.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);


// 用serviceWorker的话 这里的production要在webpack.config.js output下的publicPath配置才行
if ('production' === process.env.NODE_ENV) {
  serviceWorker.register();
} else {
  serviceWorker.unregister();
}
