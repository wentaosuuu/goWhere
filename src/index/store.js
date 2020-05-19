import {applyMiddleware, combineReducers, createStore} from 'redux';
import './reducers';
import thunk from 'redux-thunk'; // thunk中间件专门用来支持异步的action
import reducers from "./reducers";

export default createStore(
  // 这里的数据都是可变的. 不然就没有意义了
  // 变化的方法是用actionCreator函数创建出actionCreator对象, 再通过reducer函数返回的新数据来改变
  combineReducers(reducers),
  {
    from: '北京', // 这是在设置默认值
    to: '上海',
    isCitySelectorVisible: false,
    currentSelectingLeftCity: false,
    cityData: null,
    isLoadingCityDate: false,
    isDateSelectorVisible: false,
    highSpeed: false,
  },
  applyMiddleware(thunk)
);
