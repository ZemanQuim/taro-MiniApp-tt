/* eslint-disable import/prefer-default-export */
import HTTPREQUEST from './http';

//登录后台
export const login = (postData) => {
  return HTTPREQUEST.post('/api/login', postData);
};

//获取用户信息
export const getUserInfo = () => {
  return HTTPREQUEST.get('/api/user_info');
};

//绑定用户信息
export const bindInfo = (postData) => {
  return HTTPREQUEST.post('/api/bind_info', postData);
};

//排行榜
export const getRankingList = (getData) => {
  return HTTPREQUEST.get('/api/ranking_list', getData);
};

//我查看的电影
export const getMyWatchList = (getData) => {
  return HTTPREQUEST.get('/api/user/see_movie', getData);
};

//我查看的电影
export const getGuessList = (getData) => {
  return HTTPREQUEST.get('/api/user/guess_right', getData);
};

//猜一部电影
export const getOneMovie = () => {
  return HTTPREQUEST.get('/api/movie/get_one');
};

//猜电影
export const anwser = (postData) => {
  return HTTPREQUEST.post('/api/movie/guess', postData);
};

//查看电影名
export const watchAnwser = (postData) => {
  return HTTPREQUEST.post('/api/movie/see_movie_title', postData);
};

//积分记录
export const getPointRecord = (getData) => {
  return HTTPREQUEST.get('/api/user/point_record', getData);
};

//签到
export const signIn = () => {
  return HTTPREQUEST.get('/api/sign/sign_in');
};

//签到排行榜
export const signInRankingList = (getData) => {
  return HTTPREQUEST.get('/api/sign/ranking_list', getData);
};

//落地页----------------

//一部电影
export const getGoalMovie = (getData) => {
  return HTTPREQUEST.get('/api/goal/get_movie', getData);
};

export const getGoalRecord = (getData) => {
  return HTTPREQUEST.get('/api/goal/get_record', getData);
};
