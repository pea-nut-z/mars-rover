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
  checkImgUrl,
} from "./helper";

import Modal from "react-modal";

jest.mock("axios");

const dateArray = getTodayDate();
const frontCameraImgUrl = getFtImgUrl(dateArray);

const axiosGetSpy = jest.spyOn(axios, "get").mockImplementation((url) => {
  if (checkImgUrl(url)) url = "otherImgUrl";
  console.log({ url });

  switch (url) {
    case weatherUrl:
      return Promise.resolve({ data: fakeWeatherData });
    case frontCameraImgUrl:
    case "otherImgUrl":
      return Promise.resolve({ data: fakeImgData });
    case newsUrl:
      return Promise.resolve({ data: fakeNewsData });
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
