const getBaseUrl = (url) => {
  let BASE_URL = '';
  if (process.env.NODE_ENV === 'development') {
    //开发环境 - 根据请求不同返回不同的BASE_URL
    if (url.includes('/api/')) {
      BASE_URL = 'http://api-guess-movie.you7h.com:443';
    } else {
      BASE_URL = 'http://api-guess-movie.you7h.com:443';
    }
  } else {
    // 生产环境
    if (url.includes('/api/')) {
      BASE_URL = 'http://guess-movie-api.lkd2020.cn';
    } else {
      BASE_URL = 'http://guess-movie-api.lkd2020.cn';
    }
  }
  return BASE_URL;
};

export default getBaseUrl;
