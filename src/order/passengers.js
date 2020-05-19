import React, {memo, useMemo} from "react";
import './passengers.css';
import PropTypes from 'prop-types';

const Passenger = memo(function Passenger(props) {
  const {
    id,
    name,
    ticketType,
    licenceNo,
    gender,
    birthday,
    onRemove,
    onUpdate,
    showGenderMenu,
    showFollowAdultMenu,
    showTicketTypeMenu,
    followAdultName,
  } = props;

  const isAdult = ticketType === 'adult';

  return (
    <li className="passenger">
      <i className="delete" onClick={() => onRemove(id)}>-</i>
      <ol className="items">
        <li className="item">
          <label className="label name">姓名</label>
          <input
            className="input name"
            type="text"
            placeholder="乘客姓名"
            value={name}
            onChange={(e) => onUpdate(id, {name: e.target.value})}
          />
          <label className="ticket-type" onClick={() => showTicketTypeMenu(id)}>
            {isAdult ? '成人票' : '儿童票'}
          </label>
        </li>
        {
          isAdult &&
          <li className="item">
            <label className="label licenceNo">身份证</label>
            <input
              className="input name"
              type="text"
              placeholder="证件号码"
              value={licenceNo}
              onChange={(e) => onUpdate(id, {licenceNo: e.target.value})}
            />
          </li>
        }
        {
          !isAdult &&
          <li className="item arrow">
            <label className="label licenceNo">性别</label>
            <input
              className="input name"
              type="text"
              placeholder="请选择"
              onClick={() => showGenderMenu(id)}
              value={
                gender === 'male' ? '男'
                  : gender === 'female' ? '女'
                  : ''
              }
              readOnly
              onChange={(e) => onUpdate(id, {licenceNo: e.target.value})}
            />
          </li>
        }
        {
          !isAdult &&
          <li className="item">
            <label className="label birthday">出生日期</label>
            <input
              className="input birthday"
              type="text"
              placeholder="如19950101"
              value={birthday}
              onChange={(e) => onUpdate(id, {birthday: e.target.value})}
            />
          </li>
        }
        {
          !isAdult &&
          <li className="item arrow">
            <label className="label followAdult">同行成人</label>
            <input
              className="input followAdult"
              type="text"
              placeholder="请选择"
              value={followAdultName}
              readOnly
              onClick={() => showFollowAdultMenu(id)}
            />
          </li>
        }
      </ol>
    </li>
  );
});

Passenger.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  followAdult: PropTypes.number,
  ticketType: PropTypes.string.isRequired,
  licenceNo: PropTypes.string,
  gender: PropTypes.string,
  birthday: PropTypes.string,
  onRemove: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  showGenderMenu: PropTypes.func.isRequired,
  showTicketTypeMenu: PropTypes.func.isRequired,
  followAdultName: PropTypes.string,
};

const Passengers = memo(function Passengers(props) {
  const {
    passengers,
    createAdult,
    createChild,
    removePassenger,
    updatePassenger,
    showGenderMenu,
    showFollowAdultMenu,
    showTicketTypeMenu,
  } = props;

  const nameMap = useMemo(() => {
    const ret = {};
    for (const passenger of passengers) {
      ret[passenger.id] = passenger.name;
    }
    return ret;
  }, [passengers]);

  return (
    <div className="passengers">
      <ul>
        {
          passengers.map(passenger => {
            return (
              <Passenger
                {...passenger}
                key={passenger.id}
                onRemove={removePassenger}
                onUpdate={updatePassenger}
                showGenderMenu={showGenderMenu}
                showFollowAdultMenu={showFollowAdultMenu}
                showTicketTypeMenu={showTicketTypeMenu}
                followAdultName={nameMap[passenger.followAdult]}
              />
            )
          })
        }
      </ul>
      <section className="add">
        <div className="adult" onClick={() => createAdult()}>添加成人</div>
        <div className="child" onClick={() => createChild()}>添加儿童</div>
      </section>
    </div>
  );
});

Passengers.propTypes = {
  passengers: PropTypes.array.isRequired,
  createAdult: PropTypes.func.isRequired,
  createChild: PropTypes.func.isRequired,
  showGenderMenu: PropTypes.func.isRequired,
  showFollowAdultMenu: PropTypes.func.isRequired,
  showTicketTypeMenu: PropTypes.func.isRequired,
};

export default Passengers;
