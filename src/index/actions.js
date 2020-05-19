export const ACTION_SET_FROM = 'SET_FROM';
export const ACTION_SET_TO = 'SET_TO';
export const ACTION_SET_IS_CITY_SELECTOR_VISIBLE = 'SET_IS_CITY_SELECTOR_VISIBLE';
export const ACTION_SET_CURRENT_SELECTING_LEFT_CITY = 'SET_CURRENT_SELECTING_LEFT_CITY';
export const ACTION_SET_CITY_DATA = 'SET_CITY_DATA';
export const ACTION_SET_IS_LOADING_CITY_DATA = 'SET_IS_LOADING_CITY_DATA';
export const ACTION_SET_IS_DATE_SELECTOR_VISIBLE = 'SET_IS_DATA_SELECTOR_VISIBLE';
export const ACTION_SET_HIGH_SPEED = 'SET_HIGH_SPEED';
export const ACTION_SET_DEPART_DATE = 'SET_DEPART_DATE';

export function setFrom(from) {
  return {
    type: ACTION_SET_FROM,
    payload: from,
  }
}

export function setTo(to) {
  return {
    type: ACTION_SET_TO,
    payload: to,
  }
}

export function setIsLoadingCityDate(isLoadingCityDate) {
  return {
    type: ACTION_SET_IS_LOADING_CITY_DATA,
    payload: isLoadingCityDate,
  }
}

export function setCityData(cityData) {
  return {
    type: ACTION_SET_CITY_DATA,
    payload: cityData,
  }
}

export function toggleHighSpeed() {
  return (dispatch, getState) => {
    const {highSpeed} = getState();
    dispatch({
      type: ACTION_SET_HIGH_SPEED,
      payload: !highSpeed,
    })
  }
}

export function showCitySelector(currentSelectingLeftCity) {
  // 由于要把2个函数绑在一起, 所以这里要用到异步action
  return (dispatch) => {
    dispatch({
      type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
      payload: true,
    });

    dispatch({
      type: ACTION_SET_CURRENT_SELECTING_LEFT_CITY,
      payload: currentSelectingLeftCity
    });
  }
}

export function hideCitySelector() {
  return {
    type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
    payload: false,
  }
}

export function setSelectedCity(city) {
  return (dispatch, getState) => {
    const {currentSelectingLeftCity} = getState();

    if (currentSelectingLeftCity) {
      dispatch(setFrom(city));
    } else {
      dispatch(setTo(city));
    }

    dispatch(hideCitySelector());
  };
}

export function showDateSelector() {
  return {
    type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
    payload: true,
  };
}

export function hideDateSelector() {
  return {
    type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
    payload: false,
  };
}

export function exchangeFromTo() {
  return (dispatch, getState) => {
    const {from, to} = getState(); // 这是先获取from和to的值, 然后再dispatch
    dispatch(setFrom(to));
    dispatch(setTo(from));
  }
}

export function setDepartDate(departDate){
  return{
    type: ACTION_SET_DEPART_DATE,
    payload: departDate
  }
}

export function fetchCityData() {
  return (dispatch, getState) => {
    const {isLoadingCityData} = getState();
    if (isLoadingCityData) {
      return;
    }

    const cache = JSON.stringify(localStorage.getItem('city_date_cache') || '{}');
    if (Date.now < cache.expires){
      dispatch(setCityData(cache.data));
      return;
    }

    dispatch(setIsLoadingCityDate(true));

    // 发送网络请求
    fetch('/rest/cities?_' + Date.now())
      .then(res => res.json())
      .then(cityData => {
        dispatch(setCityData(cityData));

        // 优化: 城市数据基本不会变化, 不需要每次打开页面就请求数据一次, 可以做一个缓存, 这样就不用每次都调用接口了
        // 把city date写进缓存并设置一个有效期
        localStorage.setItem(
          'city_date_cache',
          JSON.stringify({
            expires: Date.now() + 60 * 1000,
            data: cityData
          }),
        );
        dispatch(setIsLoadingCityDate(false));
      })
      .catch(() => {
        dispatch(setIsLoadingCityDate(false));
      })
  };
}
