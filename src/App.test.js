import React from "react";
import "@testing-library/jest-dom";
import App from "./App";
import axios from "axios";
import { weatherData } from "./mocked-data";
import renderer, { act } from "react-test-renderer";

jest.mock("axios");

axios.get.mockImplementation((url) => {
  switch (url) {
    case "https://api.maas2.apollorion.com/":
      return Promise.resolve({ data: weatherData });
    default:
      return Promise.reject(new Error("not found"));
  }
});

// axios.get.mockImplementation(() => mockedAxiosGet());

describe("testing", () => {
  // let axiosGetSpy;

  // afterEach(() => {
  // component.unmount();
  // axiosGetSpy.mockRestore();
  // });

  it("should work.", async () => {
    let component;

    await act(() => {
      return axios.get("https://api.maas2.apollorion.com/").then(async (users) => {
        component = renderer.create(<App />);
        expect(component.toJSON()).toMatchSnapshot();
      });
    });

    // mockedAxiosGet("https://api.maas2.apollorion.com/").then((test) => {
    //   console.log(test.data);

    //   expect(component.toJSON()).toMatchSnapshot();
    // });
  });
});
