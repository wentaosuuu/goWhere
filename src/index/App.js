import React, {useCallback, useMemo} from "react";
import {connect} from 'react-redux';
import './App.css';
import Header from "../common/Header";
import DepartDate from "./DepartDate";
import HighSpeed from "./HighSpeed";
import Journey from "./Journey";
import Submit from "./Submit";

import {
  exchangeFromTo,
  fetchCityData,
  hideCitySelector,
  hideDateSelector,
  setDepartDate,
  setSelectedCity,
  showCitySelector,
  showDateSelector,
  toggleHighSpeed,
} from './actions';

import {bindActionCreators} from "redux";

import CitySelector from "../common/CitySelector";
import DateSelector from "../common/DateSelector";
import {h0} from "../common/fp";

function App(props) {
  const {
    from,
    to,
    isCitySelectorVisible,
    isDateSelectorVisible,
    cityData,
    isLoadingCityData,
    highSpeed,
    dispatch,
    departDate,
  } = props;

  // 为什么用useCallback? 因为给组件传递了函数. 是函数就会涉及到渲染的问题.
  // 为了不必要的重渲染, 我们要引入useCallback
  const onBack = useCallback(() => {
    window.history.back();
  }, []);

  // const doExchangeFromTo = useCallback(() => {
  //   dispatch(exchangeFromTo());
  // }, [])
  //
  // const doShowCitySelector = useCallback((m) => {
  //   dispatch(showCitySelector(m));
  // }, []);

  // bindActionCreators的作用是可以批量的把actionCreator函数和dispatch绑定在一起.
  // 所以我们又可以再简化
  // 要注意的是bindActionCreators每次都会返回一个新的函数集合. 这就和useCallback函数的目标是冲突的
  // 变通的方法是用useMemo包裹起来
  const cbs = useMemo(() => {
    return bindActionCreators({
      exchangeFromTo,
      showCitySelector,
    }, dispatch);
  }, []);

  const citySelectorCbs = useMemo(() => {
    return bindActionCreators({
      onBack: hideCitySelector,
      fetchCityData,
      onSelect: setSelectedCity,
    }, dispatch);
  }, []);

  const departDateCbs = useMemo(() => {
    return bindActionCreators({
      onClick: showDateSelector,
    }, dispatch);
  }, []);

  const dateSelectorCbs = useMemo(() => {
    return bindActionCreators({
      onBack: hideDateSelector,
    }, dispatch);
  }, []);

  const highSpeedCbs = useMemo(() => {
    return bindActionCreators({
      toggle: toggleHighSpeed,
    }, dispatch);
  }, []);

  const onSelectDate = useCallback((day) => {
    if (!day) {
      return;
    }
    if (day < h0()) {
      return;
    }
    dispatch(setDepartDate(day));
    dispatch(hideDateSelector());
  }, []);

  return (
    <div>
      <div className="header-wrapper">
        <Header title="火车票" onBack={onBack}/>
      </div>
      <form action="./query.html" className="form">
        <Journey
          from={from}
          to={to}
          {...cbs} // 这里就可以用解构语法了
          // 注释掉这这里的原因是又传入了函数. 为了性能优化(不重渲染) 就用useCallback包裹起来
          // exchangeFromTo={doExchangeFromTo}
          // showCitySelector={doShowCitySelector}
        />
        <DepartDate
          time={departDate}
          {...departDateCbs}
        />
        <HighSpeed
          highSpeed={highSpeed}
          {...highSpeedCbs}
        />
        <Submit/>
      </form>
      <CitySelector
        show={isCitySelectorVisible}
        cityData={cityData}
        isLoading={isLoadingCityData}
        {...citySelectorCbs}
      />
      <DateSelector
        show={isDateSelectorVisible}
        {...dateSelectorCbs}
        onSelect={onSelectDate}
      />
    </div>
  );

}

export default connect(
  function mapStateToProps(state) {
    return state;
  },
  function mapDispatchToProps(dispatch) {
    return {dispatch};
  }
)(App);
