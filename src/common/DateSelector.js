import React from "react";
import './DateSelector.css';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Header from "./Header";
import {h0} from '../common/fp';

function Day(props) {
  const {
    day, onSelect
  } = props;

  if (!day) {
    return <td className="null"></td>;
  }

  const classes = [];

  const now = h0();

  if (day < now) {
    classes.push('disabled');
  }

  if ([6, 0].includes(new Date(day).getDay())) {
    classes.push('weekend');
  }

  const dateString = now === day ? '今天' : new Date(day).getDate();

  return (
    <td className={classnames(classes)} onClick={() => onSelect(day)}>
      {dateString}
    </td>
  );
}

Day.propTypes = {
  day: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
};

function Week(props) {
  const {
    days,
    onSelect,
  } = props;

  return (
    <tr className="date-table-days">
      {
        days.map((day, index) => {
          return <Day key={index} day={day} onSelect={onSelect}/>
        })
      }
    </tr>
  )
}

Week.propTypes = {
  days: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};

function Month(props) {
  const {startingTimeInMonth, onSelect} = props;

  // 如何获取当前月的所有日期?
  // 递增日期day, 直到Month借位
  const startDay = new Date(startingTimeInMonth); // 代表当前月零时刻的对象
  const currentDay = new Date(startingTimeInMonth); // 指针变量currentDay

  let days = [];

  while (currentDay.getMonth() === startDay.getMonth()) {
    days.push(currentDay.getTime());
    currentDay.setDate(currentDay.getDate() + 1); // 日期+1
  }

  // 补齐月首
  days = new Array(startDay.getDay() ? startDay.getDay() - 1 : 6)
    .fill(null)
    .concat(days); // 连接days

  // 先获取数组的最后一位, 也就是当前月最后一天
  const lastDay = new Date(days[days.length - 1]);

  // 补齐月尾
  // 这回我们要放在days的后边, 所以这个concat要这么写
  days = days.concat(new Array(lastDay.getDay() ? 7 - lastDay.getDay() : 0).fill(null));

  const weeks = [];

  for (let row = 0; row < days.length / 7; ++row) {
    const week = days.slice(row * 7, (row + 1) * 7); // 用slice计算起点和终点. 不懂就查slice的用法
    weeks.push(week);
  }

  return (
    <table className="date-table">
      <thead>
      <tr>
        <td colSpan="7">
          <h5>
            {startDay.getFullYear()}年{startDay.getMonth() + 1}月
          </h5>
        </td>
      </tr>
      </thead>
      <tbody>
      <tr className="data-table-weeks">
        <th>周一</th>
        <th>周二</th>
        <th>周三</th>
        <th>周四</th>
        <th>周五</th>
        <th className="weekend">周六</th>
        <th className="weekend">周日</th>
      </tr>
      {weeks.map((week, idx) => {
        return <Week key={idx} days={week} onSelect={onSelect}/>;
      })}
      </tbody>
    </table>
  );
}

Month.propTypes = {
  startingTimeInMonth: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default function DateSelector(props) {
  const {
    show,
    onSelect,
    onBack,
  } = props;

  // 获取当前时间, 去除小时分秒毫秒
  const now = new Date();
  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);
  now.setDate(1); // 日期设置为当前的1号

  // now.getTime()这样就可以获取到当前月的零时刻
  const monthSequence = [now.getTime()];

  now.setMonth(now.getMonth() + 1); // 下一个月的零时刻
  monthSequence.push(now.getTime());

  now.setMonth(now.getMonth() + 1); // 下下个月的
  monthSequence.push(now.getTime());


  return (
    <div className={classnames('date-selector', {hidden: !show})}>
      <Header
        title="日期选择"
        onBack={onBack}
      />
      <div className="date-selector-tables">
        {
          monthSequence.map((month) => {
            return (
              <Month
                key={month}
                onSelect={onSelect}
                startingTimeInMonth={month}
              />
            );
          })
        }
      </div>
    </div>
  )
}

DateSelector.propTypes = {
  show: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
};
