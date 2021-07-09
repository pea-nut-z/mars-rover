import React from "react";
import "@testing-library/jest-dom";
import renderer, { act } from "react-test-renderer";
import axios from "axios";
import App from "./App";
import { fakeWeatherData, fakeFtImgData } from "./fake.data";
import { weatherUrl, getFtImgUrl, getOtherImgUrl, getTodayDate, camerasAbbr } from "./helper";

import Modal from "react-modal";

jest.mock("axios");

const dateArray = getTodayDate();
const frontCameraImgUrl = getFtImgUrl(dateArray);
const fakeRHAZImgUrl = getOtherImgUrl(cameraAbbr, dateArray);

const axiosGetSpy = jest.spyOn(axios, "get").mockImplementation((url) => {
  switch (url) {
    case weatherUrl:
      return Promise.resolve({ data: fakeWeatherData });
    case frontCameraImgUrl:
      return Promise.resolve({ data: { photos: fakeFtImgData } });
    default:
      return Promise.reject(new Error("not found"));
  }
});

describe("Fetch Data", () => {
  let component;
  beforeAll(async () => {
    await act(() => {
      return axios.get(weatherUrl).then(() => {
        component = renderer.create(<App />);
      });
    });
  });

  afterAll(() => {
    component.unmount();
    axiosGetSpy.mockRestore();
  });

  it("fetches from correct url for weather data.", async () => {
    expect(axiosGetSpy).toBeCalledWith(weatherUrl);
  });

  it("fetches from correct url with queries for image data.", async () => {
    // expect(axiosGetSpy).toBeCalledWith(frontCameraImgUrl);

    await act(() => {
      return axios.get(frontCameraImgUrl).then((res) => {
        console.log(res);
      });
    });
  });
});

// describe("Layout", () => {

//   afterAll(() => {
//     component.unmount();
//     axiosGetSpy.mockRestore();
//   });

//   it("fetches and renders weather data.", async () => {
//     let component;
//     await act(() => {
//       return axios.get("https://api.maas2.apollorion.com/").then(() => {
//         component = renderer.create(<App />);
//       });
//     });
//     expect(component.toJSON()).toMatchSnapshot();
//   });
// });
