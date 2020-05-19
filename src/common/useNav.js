import {h0} from "./fp";
import {useCallback} from "react";

// 自定义HOOK函数, 要用use开头
export default function useNav(departDate, dispatch, prevDate, nextDate) {
  const isPrevDisabled = h0(departDate) <= h0();
  const isNextDisabled = h0(departDate) - h0() > 20 * 86400 * 1000;

  const prev = useCallback(() => {
    if (isPrevDisabled) {
      return;
    }
    dispatch(prevDate());
  }, [dispatch, isPrevDisabled, prevDate]);

  const next = useCallback(() => {
    if (isNextDisabled) {
      return;
    }
    dispatch(nextDate());
  }, [dispatch, isNextDisabled, nextDate]);

  return {
    isPrevDisabled,
    isNextDisabled,
    prev,
    next,
  };
}
