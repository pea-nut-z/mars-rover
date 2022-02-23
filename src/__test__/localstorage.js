import { junImgData } from "./fake.data";
const likesData = JSON.stringify(junImgData.photos);

export default new (class {
  store = { likes: likesData };
  setItem = (key, val) => (this.store[key] = val);
  getItem = (key) => this.store[key];
  // removeItem = (key) => {
  //   delete this.store[key];
  // };
  // clear = () => (this.store = {});
})();
