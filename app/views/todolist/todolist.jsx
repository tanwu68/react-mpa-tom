import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from '../../store/configureStore'
import Todo from '../../containers/Todo';

import '../../static/css/common.less';

// 创建 Redux 的 store 对象
const store = configureStore();

render(
    <Provider store={store}>
        <Todo />
    </Provider>,
    document.getElementById('root')
);
