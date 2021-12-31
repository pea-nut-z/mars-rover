export default new (class {
  store = { likes: "[]" };
  setItem = (key, val) => (this.store[key] = val);
  getItem = (key) => this.store[key];
  removeItem = (key) => {
    delete this.store[key];
  };
  clear = () => (this.store = {});
})();
