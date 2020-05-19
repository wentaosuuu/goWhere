import React, {memo, useMemo} from "react";
import './Nav.css';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';

// 因为没有用到除了props之外的任何参数
// 所以这里可以用memo包裹起来进行性能优化
const Nav = memo(function Nav(props) {
  const {
    date,
    prev,
    next,
    isPrevDisabled,
    isNextDisabled,
  } = props;

  const currentString = useMemo(() => {
    const d = dayjs(date);
    return d.format('M月D日') + d.locale('zh-cn').format('ddd');
  }, [date]);

  return (
    <div className="nav">
      <span
        onClick={prev}
        className={classnames('nav-prev', {
          'nav-disabled': isPrevDisabled,
        })}
      >
        前一天
      </span>
      <span className="nav-current">{currentString}</span>
      <span
        className={classnames('nav-next', {
          'nav-disabled': isNextDisabled,
        })}
        onClick={next}
      >
        后一天
      </span>
    </div>
  );
});

Nav.propTypes = {
  date: PropTypes.number.isRequired,
  prev: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  isPrevDisabled: PropTypes.bool.isRequired,
  isNextDisabled: PropTypes.bool.isRequired,
};

export default Nav;
