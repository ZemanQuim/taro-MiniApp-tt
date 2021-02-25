import { observable, action, runInAction } from 'mobx';
import { getJokeData } from '../servers/servers';

class homeStore {
  @observable rainbow = '';
  @observable loading = false;

  @action getJokeData = async () => {
    this.loading = true;
    const res = await getJokeData();
    runInAction(() => {
      this.rainbow = res;
      this.loading = false;
    });
  };
}

export default new homeStore();
