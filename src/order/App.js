import React, {useCallback, useEffect, useMemo} from "react";
import {connect} from 'react-redux';
import './App.css';
import URI from 'urijs';
import Header from "../common/Header";

import dayjs from "dayjs";

import {
  createAdult,
  createChild,
  fetchInitial,
  hideMenu,
  removePassenger,
  setArriveStation,
  setDepartDate,
  setDepartStation,
  setSearchParsed,
  setSeatType,
  setTrainNumber,
  showFollowAdultMenu,
  showGenderMenu,
  showTicketTypeMenu,
  updatePassenger,
} from './actions';
import Detail from "../common/Detail";
import Ticket from "./Ticket";
import Passengers from "./passengers";
import {bindActionCreators} from "redux";
import Menu from "./Menu";
import Choose from "./choose";
import Account from "./account";


function App(props) {
  const {
    trainNumber,
    departStation,
    arriveStation,
    seatType,
    departDate,
    arriveDate,
    departTimeStr,
    arriveTimeStr,
    durationStr,
    price,
    passengers,
    menu,
    isMenuVisible,
    searchParsed,

    dispatch,
  } = props;

  const onBack = useCallback(() => {
    window.history.back();
  }, []);

  useEffect(() => {
    const queries = URI.parseQuery(window.location.search);

    const {
      trainNumber,
      dStation,
      aStation,
      type,
      date,
    } = queries;

    dispatch(setDepartStation(dStation));
    dispatch(setArriveStation(aStation));
    dispatch(setTrainNumber(trainNumber));
    dispatch(setSeatType(type));
    dispatch(setDepartDate(dayjs(date).valueOf()));
    dispatch(setSearchParsed(true));
  });

  useEffect(() => {
    if (!searchParsed) {
      return;
    }
    const url = new URI('/rest/order')
      .setSearch('dStation', departStation)
      .setSearch('aStation', arriveStation)
      .setSearch('type', seatType)
      .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
      .toString();

    dispatch(fetchInitial(url));
  }, [searchParsed, departStation, arriveStation, seatType, departDate, dispatch]);

  const passengersCbs = useMemo(() => {
    return bindActionCreators({
      createChild,
      createAdult,
      removePassenger,
      updatePassenger,
      showGenderMenu,
      showFollowAdultMenu,
      showTicketTypeMenu,
    }, dispatch);
  }, [dispatch]);

  const menuCbs = useMemo(() => {
    return bindActionCreators({
      hideMenu,
    }, dispatch);
  }, [dispatch]);

  const chooseCbs = useMemo(() => {
    return bindActionCreators({
      updatePassenger,
    }, dispatch);
  }, [dispatch]);

  if (!searchParsed) {
    return null;
  }

  return (
    <div className="app">
      <div className="header-wrapper">
        <Header title="订单填写" onBack={onBack}/>
      </div>
      <div className="detail-wrapper">
        <Detail
          departDate={departDate}
          arriveDate={arriveDate}
          departTimeStr={departTimeStr}
          arriveTimeStr={arriveTimeStr}
          trainNumber={trainNumber}
          departStation={departStation}
          arriveStation={arriveStation}
          durationStr={durationStr}
        >
          <span className="train-icon" style={{display: 'block'}}></span>
        </Detail>
      </div>
      <Ticket price={price} type={seatType}/>
      <Passengers
        {...passengersCbs}
        passengers={passengers}
        onRemove={removePassenger}
      />
      {
        passengers.length > 0 &&
        (<Choose
          passengers={passengers}
          {...chooseCbs}
        />)
      }
      <Account length={passengers.length} price={price}/>
      <Menu
        {...menu}
        {...menuCbs}
        show={isMenuVisible}
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
