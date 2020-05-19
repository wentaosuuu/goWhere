import React, {useMemo} from "react";
import './DepartDate.css';
import {h0} from '../common/fp';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

export default function DepartDate(props) {
  const {
    time, // 输入的这个time我们希望是去掉小时分钟秒毫秒的, 之后还会用到很多. 所以写一个公共函数fp.js
    onClick,
  } = props;

  // 要注意的是这里不建议用useMemo进行优化. 因为h0不是从props里获得而是从系统获取的时间. 是另一个获取途径.
  // 所以用useMemo优化是有风险的. 风险就是可能该重渲染的时候没有重渲染
  const h0OfDepart = h0(time); // 这一步操作是把小时分钟秒毫秒去掉. 然后再作为下面这个函数的依赖.
  const departDate = new Date(h0OfDepart);

  // 转换日期的操作比较复杂, 占用资源比较多. 所以最好用useMemo优化一下
  const departDateString = useMemo(() => {
    return dayjs(h0OfDepart).format('YYYY-MM-DD');
  }, [h0OfDepart]);

  const isToday = h0OfDepart === h0(); // 这一步操作就是想看是不是今天. 要和零时刻做一个对比.

  const weekString = '周'
    + ['日','一','二','三','四','五','六',][departDate.getDay()]
    +(isToday ? '(今天)':'');

  return (
    <div className="depart-date" onClick={onClick}>
      <input
        type="hidden"
        name="date"
        value={departDateString}
      />
      {departDateString}
      <span className="depart-week">{weekString}</span>
    </div>
  );
}

DepartDate.propsType={
  time: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};
