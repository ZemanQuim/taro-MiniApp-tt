import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import 'taro-ui/dist/style/index.scss';
import { counterStore, authStore, goalStore } from './store/index';

import './app.scss';

const store = {
  counterStore,
  authStore,
  goalStore,
};

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // this.props.children 就是要渲染的页面
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
