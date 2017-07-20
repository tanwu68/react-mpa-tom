import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from '../store/configureStore'
import App from '../containers'
//import fn from './redux-demo.js';
//fn();

import { testFetch } from '../fetch/test.js'
testFetch();

import '../static/css/common.less';

// 创建 Redux 的 store 对象
const store = configureStore();

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
