import React, {memo, useMemo, useReducer, useState} from "react";
import './Bottom.css';
import PropTypes from 'prop-types';
import {ORDER_DEPART} from "./constant";
import classnames from 'classnames';
import Slider from './Slider';

function checkedReducer(state, action) {
  const {type, payload} = action;
  let newState;
  switch ((type)) {
    case 'toggle':
      newState = {...state};
      if (payload in newState) {
        delete newState[payload];
      } else {
        newState[payload] = true;
      }
      return newState;
    case 'reset':
      return {};
    default:
  }
}

const Filter = memo(function Filter(props) {
  const {name, checked, dispatch, value} = props;

  return (
    <li className={classnames({checked})} onClick={() => dispatch({payload: value, type: 'toggle'})}>
      {name}
    </li>
  );
});

Filter.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
};

const Option = memo(function Option(props) {
  const {title, options, checkedMap, dispatch} = props;

  return (
    <div className="option">
      <h3>{title}</h3>
      <ul>
        {options.map(option => {
          return (
            // 循环下面的JSX 都应该放在一个独立的组件中
            <Filter
              key={option.value}
              {...option}
              checked={option.value in checkedMap} // 每个option都有一个value, 如果value存在于checkedMap中. 就是选中了
              dispatch={dispatch}
            />
          );
        })}
      </ul>
    </div>
  );
});

Option.propType = {
  title: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  checkedMap: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

const BottomModal = memo(function BottomModal(props) {
  const {
    ticketTypes,
    trainTypes,
    departStations,
    arriveStations,
    checkedTicketTypes,
    checkedTrainTypes,
    checkedDepartStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd,
    setCheckedTicketTypes,
    setCheckedTrainTypes,
    setCheckedDepartStations,
    setCheckedArriveStations,
    setDepartTimeStart,
    setDepartTimeEnd,
    setArriveTimeStart,
    setArriveTimeEnd,
    toggleIsFiltersVisible,
  } = props;

  // 设置缓冲区
  // 希望统一捕获到数据的更新行为. redux不能获取到组件中生成的state
  // 自定义函数useReducer可以
  // 第一个参数是一个reducer函数. 第二个是这个reducer的初始值.
  // 如果我们传入第三个参数, 就会得到异步初始化的state. 第三个参数也是一个函数. 参数是useReducer的第二个参数
  // 在里面我们做解构
  const [localCheckedTicketTypes, localCheckedTicketTypesDispatch] = useReducer(checkedReducer, checkedTicketTypes, (checkedTicketTypes) => {
    return {
      ...checkedTicketTypes
    };
  });

  const [localCheckedTrainTypes, localCheckedTrainTypesDispatch] = useReducer(checkedReducer, checkedTrainTypes, (checkedTrainTypes) => {
    return {
      ...checkedTrainTypes
    }
  });

  const [localCheckedDepartStations, localCheckedDepartStationsDispatch] = useReducer(checkedReducer, checkedDepartStations, (checkedDepartStations) => {
    return {
      ...checkedDepartStations
    }
  });

  const [localCheckedArriveStations, localCheckedArriveStationsDispatch] = useReducer(checkedReducer, checkedArriveStations, (checkedArriveStations) => {
    return {
      ...checkedArriveStations
    }
  });

  // 那两个滑块的缓冲区
  const [localDepartTimeStart, setLocalDepartTimeStart] = useState(departTimeStart);
  const [localDepartTimeEnd, setLocalDepartTimeEnd] = useState(departTimeEnd);
  const [localArriveTimeStart, setLocalArriveTimeStart] = useState(arriveTimeStart);
  const [localArriveTimeEnd, setLocalArriveTimeEnd] = useState(arriveTimeEnd);

  const optionGroup = [
    {
      title: '坐席类型',
      options: ticketTypes,
      checkedMap: localCheckedTicketTypes,
      dispatch: localCheckedTicketTypesDispatch
    },
    {
      title: '车次类型',
      options: trainTypes,
      checkedMap: localCheckedTrainTypes,
      dispatch: localCheckedTrainTypesDispatch
    },
    {
      title: '出发车站',
      options: departStations,
      checkedMap: localCheckedDepartStations,
      dispatch: localCheckedDepartStationsDispatch
    },
    {
      title: '到达车站',
      options: arriveStations,
      checkedMap: localCheckedArriveStations,
      dispatch: localCheckedArriveStationsDispatch
    },
  ];

  function sure() {
    setCheckedTicketTypes(localCheckedTicketTypes);
    setCheckedTrainTypes(localCheckedTrainTypes);
    setCheckedDepartStations(localCheckedDepartStations);
    setCheckedArriveStations(localCheckedArriveStations);

    setDepartTimeStart(localDepartTimeStart);
    setDepartTimeEnd(localDepartTimeEnd);

    setArriveTimeStart(localArriveTimeStart);
    setArriveTimeEnd(localArriveTimeEnd);

    toggleIsFiltersVisible();
  }

  const isResetDisabled = useMemo(() => {
    return Object.keys(localCheckedTicketTypes).length === 0
      && Object.keys(localCheckedTrainTypes).length === 0
      && Object.keys(localCheckedDepartStations).length === 0
      && Object.keys(localCheckedArriveStations).length === 0
      && localDepartTimeStart === 0
      && localDepartTimeEnd === 24
      && localArriveTimeStart === 0
      && localArriveTimeEnd === 24
  }, [
    localCheckedTicketTypes,
    localCheckedTrainTypes,
    localCheckedDepartStations,
    localCheckedArriveStations,
    localDepartTimeStart,
    localDepartTimeEnd,
    localArriveTimeStart,
    localArriveTimeEnd,
  ]);

  function reset() {
    if (isResetDisabled) {
      return;
    }

    localCheckedTicketTypesDispatch({type: 'reset'});
    localCheckedTrainTypesDispatch({type: 'reset'});
    localCheckedDepartStationsDispatch({type: 'reset'});
    localCheckedArriveStationsDispatch({type: 'reset'});
    setLocalDepartTimeStart(0);
    setLocalDepartTimeEnd(24);
    setLocalArriveTimeStart(0);
    setLocalArriveTimeEnd(24);
  }

  return (
    <div className='bottom-modal'>
      <div className="bottom-dialog">
        <div className="bottom-dialog-content">
          <div className="title">
            <span className={classnames('reset', {
              disabled: isResetDisabled,
            })} onClick={reset}>重置</span>
            <span className="ok" onClick={sure}>确定</span>
          </div>
          <div className="options">
            {
              optionGroup.map(group => (
                  <Option {...group} key={group.title}/>
                )
              )
            }
            <Slider
              title="出发时间"
              currentStartHours={localDepartTimeStart}
              currentEndHours={localDepartTimeEnd}
              onStartChanged={setLocalDepartTimeStart}
              onEndChanged={setLocalDepartTimeEnd}
            />
            <Slider
              title="到达时间"
              currentStartHours={localArriveTimeStart}
              currentEndHours={localArriveTimeEnd}
              onStartChanged={setLocalArriveTimeStart}
              onEndChanged={setLocalArriveTimeEnd}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

BottomModal.propTypes = {
  checkedTicketTypes: PropTypes.object.isRequired,
  checkedTrainTypes: PropTypes.object.isRequired,
  checkedDepartStation: PropTypes.object.isRequired,
  checkedArriveStations: PropTypes.object.isRequired,
  departTimeStart: PropTypes.number.isRequired,
  departTimeEnd: PropTypes.number.isRequired,
  arriveTimeStart: PropTypes.number.isRequired,
  arriveTimeEnd: PropTypes.number.isRequired,
  ticketTypes: PropTypes.array.isRequired,
  trainType: PropTypes.array.isRequired,
  departStations: PropTypes.array.isRequired,
  arriveStations: PropTypes.array.isRequired,
  setCheckedTicketTypes: PropTypes.func.isRequired,
  setCheckedTrainTypes: PropTypes.func.isRequired,
  setCheckedDepartStations: PropTypes.func.isRequired,
  setCheckedArriveStations: PropTypes.func.isRequired,
  setDepartTimeStart: PropTypes.func.isRequired,
  setDepartTimeEnd: PropTypes.func.isRequired,
  setArriveTimeStart: PropTypes.func.isRequired,
  setArriveTimeEnd: PropTypes.func.isRequired,
  toggleIsFiltersVisible: PropTypes.func.isRequired
};

export default function Bottom(props) {
  const {
    toggleOrderType,
    toggleHighSpeed,
    toggleOnlyTickets,
    toggleIsFiltersVisible,
    highSpeed,
    orderType,
    onlyTickets,
    isFiltersVisible,

    ticketTypes,
    trainTypes,
    departStations,
    arriveStations,
    checkedTicketTypes,
    checkedTrainTypes,
    checkedDepartStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd,
    setCheckedTicketTypes,
    setCheckedTrainTypes,
    setCheckedDepartStations,
    setCheckedArriveStations,
    setDepartTimeStart,
    setDepartTimeEnd,
    setArriveTimeStart,
    setArriveTimeEnd,
  } = props;

  const noChecked = useMemo(() => {
    return (
      Object.keys(checkedTicketTypes).length === 0 &&
      Object.keys(checkedTrainTypes).length === 0 &&
      Object.keys(checkedDepartStations).length === 0 &&
      Object.keys(checkedArriveStations).length === 0 &&
      departTimeStart === 0 &&
      departTimeEnd === 24 &&
      arriveTimeStart === 0 &&
      arriveTimeEnd === 24
    );
  }, [
    checkedTicketTypes,
    checkedTrainTypes,
    checkedDepartStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd,
  ]);

  return (
    <div className="bottom">
      <div className="bottom-filters">
        <span className="item" onClick={toggleOrderType}>
          <i className="icon">&#xf065;</i>
          {orderType === ORDER_DEPART ? '出发 早->晚' : '耗时 短->长'}
        </span>
        <span
          className={classnames('item', {'item-on': highSpeed})}
          onClick={toggleHighSpeed}
        >
          <i className="icon">{highSpeed ? '\uf43f' : '\uf43e'}</i>
          只看高铁动车
        </span>
        <span
          className={classnames('item', {'item-on': onlyTickets})}
          onClick={toggleOnlyTickets}
        >
          <i className="icon">{onlyTickets ? '\uf43d' : '\uf43c'}</i>
          只看有票
        </span>
        <span
          className={classnames('item', {'item-on': isFiltersVisible || !noChecked})}
          onClick={toggleIsFiltersVisible}
        >
          <i className="icon">{noChecked ? '\uf0f7' : '\uf446'}</i>
          综合筛选
        </span>
      </div>
      {
        isFiltersVisible && (
          <BottomModal
            ticketTypes={ticketTypes}
            trainTypes={trainTypes}
            departStations={departStations}
            arriveStations={arriveStations}
            checkedTicketTypes={checkedTicketTypes}
            checkedTrainTypes={checkedTrainTypes}
            checkedDepartStations={checkedDepartStations}
            checkedArriveStations={checkedArriveStations}
            departTimeStart={departTimeStart}
            departTimeEnd={departTimeEnd}
            arriveTimeStart={arriveTimeStart}
            arriveTimeEnd={arriveTimeEnd}
            setCheckedTicketTypes={setCheckedTicketTypes}
            setCheckedTrainTypes={setCheckedTrainTypes}
            setCheckedDepartStations={setCheckedDepartStations}
            setCheckedArriveStations={setCheckedArriveStations}
            setDepartTimeStart={setDepartTimeStart}
            setDepartTimeEnd={setDepartTimeEnd}
            setArriveTimeStart={setArriveTimeStart}
            setArriveTimeEnd={setArriveTimeEnd}
            toggleIsFiltersVisible={toggleIsFiltersVisible}
          />
        )
      }
    </div>
  );
}

Bottom.propTypes = {
  toggleOrderType: PropTypes.func.isRequired,
  toggleHighSpeed: PropTypes.func.isRequired,
  toggleOnlyTickets: PropTypes.func.isRequired,
  toggleIsFiltersVisible: PropTypes.func.isRequired,
  highSpeed: PropTypes.bool.isRequired,
  orderType: PropTypes.number.isRequired,
  onlyTickets: PropTypes.bool.isRequired,
  isFiltersVisible: PropTypes.bool.isRequired,

  ticketTypes: PropTypes.array.isRequired,
  trainTypes: PropTypes.array.isRequired,
  departStations: PropTypes.array.isRequired,
  arriveStations: PropTypes.array.isRequired,
  checkedTicketTypes: PropTypes.object.isRequired,
  checkedTrainTypes: PropTypes.object.isRequired,
  checkedDepartStations: PropTypes.object.isRequired,
  checkedArriveStations: PropTypes.object.isRequired,
  departTimeStart: PropTypes.number.isRequired,
  departTimeEnd: PropTypes.number.isRequired,
  arriveTimeStart: PropTypes.number.isRequired,
  arriveTimeEnd: PropTypes.number.isRequired,
  setCheckedTicketTypes: PropTypes.func.isRequired,
  setCheckedTrainTypes: PropTypes.func.isRequired,
  setCheckedDepartStations: PropTypes.func.isRequired,
  setCheckedArriveStations: PropTypes.func.isRequired,
  setDepartTimeStart: PropTypes.func.isRequired,
  setDepartTimeEnd: PropTypes.func.isRequired,
  setArriveTimeStart: PropTypes.func.isRequired,
  setArriveTimeEnd: PropTypes.func.isRequired,
};
