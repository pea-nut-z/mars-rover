import React from "react";
import "@testing-library/jest-dom";
import renderer, { act } from "react-test-renderer";
import axios from "axios";
import App from "./App";
import { fakeWeatherData, fakeImgData, fakeNewsData } from "./fake.data";
import {
  weatherUrl,
  getFtImgUrl,
  getOtherImgUrl,
  newsUrl,
  getTodayDate,
  cameraAbbrs,
} from "./helper";

import Modal from "react-modal";

jest.mock("axios");

const dateArray = getTodayDate();
const frontCameraImgUrl = getFtImgUrl(dateArray);
// const fakeRHAZImgUrl = getOtherImgUrl(cameraAbbr, dateArray);

const axiosGetSpy = jest.spyOn(axios, "get").mockImplementation((url) => {
  let res;
  if (url === weatherUrl) {
    res = Promise.resolve({ data: fakeWeatherData });
  } else if (url === frontCameraImgUrl) {
    res = Promise.resolve({ data: fakeImgData });
  } else if (url === newsUrl) {
    res = Promise.resolve({ data: fakeNewsData });
  } else {
    res = Promise.reject(new Error("not found"));
  }
  return res;
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

  // it("fetches from correct url with queries for image data.", async () => {
  //   expect(axiosGetSpy).toBeCalledWith(frontCameraImgUrl);

  it("fetches from correct url for news data.", async () => {
    // await act(() => {
    //   return axios.get(newsUrl).then((res) => {
    //     console.log(res.data.articles);
    //   });
    // });
    expect(axiosGetSpy).toBeCalledWith(newsUrl);
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
