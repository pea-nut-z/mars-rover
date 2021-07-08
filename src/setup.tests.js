import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

module.exports = {
  // testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["./setup.tests.js"],
};
