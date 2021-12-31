/**
 * @jest-environment jsdom
 */

import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import axios from "axios";
import App from "../App";
import * as fake from "./fake.data";
import * as func from "../helper";
import localStorage from "./localStorage";

window.localStorage = localStorage;
jest.mock("axios");

describe("Today's front camera image is AVAILABLE.", () => {
  let axiosGetSpy;
  beforeEach(async () => {
    const dateArray = func.getTodayDate();
    const ftImgUrlToday = func.getFtImgUrl(dateArray);

    axiosGetSpy = jest.spyOn(axios, "get").mockImplementation((url) => {
      url = func.validateOtherImgUrl(url) ? "imgUrl" : url;
      switch (url) {
        case func.getWeatherUrl:
          return Promise.resolve({ data: fake.weatherData1 });
        case ftImgUrlToday:
        case "imgUrl":
          return Promise.resolve({ data: fake.junImgData });
        case func.getNewsUrl:
          return Promise.resolve({ data: fake.newsData });
        default:
          return Promise.reject(new Error("Test error - url not found."));
      }
    });

    await act(async () => {
      await render(<App />);
    });
  });

  afterEach(() => {
    cleanup();
    axiosGetSpy.mockRestore();
  });

  it("displays images from all cameras.", async () => {
    const container = screen.getAllByTestId("image");
    expect(container).toHaveLength(7);
  });

  it("displays today's images, latest weather and news data.", async () => {
    const container = screen.getByTestId("home-container");
    expect(container).toMatchSnapshot();
  });
});

describe("Today is the first day of the month, front and RHAZ images are UNAVAILABLE", () => {
  let axiosGetSpy;
  beforeEach(async () => {
    const today = [2033, 7, 1];
    const yesterday = [2033, 6, 30];

    const helper = require("../helper");
    helper.getTodayDate = jest.fn(() => today);
    const ftImgUrlToday = func.getFtImgUrl(today);
    const ftImgUrlYesterday = func.getFtImgUrl(yesterday);

    axiosGetSpy = jest.spyOn(axios, "get").mockImplementation((url) => {
      // if (url !== ftImgUrlToday) {
      //   const result = func.validateOtherImgUrl(url);

      //   url =
      //     result === "valid"
      //       ? "otherImgUrl"
      //       : validateOtherImgUrl(url) === "valid & RHAZ"
      //       ? "RHAZImgUrl"
      //       : url;
      // }
      url = func.validateOtherImgUrl(url) ? "imgUrl" : url;

      switch (url) {
        case func.getWeatherUrl:
          return Promise.resolve({ data: fake.weatherData2 });
        case ftImgUrlToday:
          // case "RHAZImgUrl":
          return Promise.resolve({ data: { photos: [] } });
        case ftImgUrlYesterday:
        case "imgUrl":
          return Promise.resolve({ data: fake.junImgData });
        case func.getNewsUrl:
          return Promise.resolve({ data: fake.newsData });
        default:
          return Promise.reject(new Error("Test error - url not found."));
      }
    });

    await act(async () => {
      await render(<App />);
    });
  });

  afterEach(() => {
    axiosGetSpy.mockRestore();
    jest.unmock("../helper");
    cleanup();
  });

  it("displays N/A when wind direction and speed data are not provided", () => {
    const wind = screen.getByTestId("wind");
    expect(wind.textContent).toBe("Wind Speed: N/AWind Direction: N/A");
  });

  it("back tracks to last month.", () => {
    const date = screen.getByTestId("image-date");
    expect(date.textContent).toBe("(2033-06-30)");
  });

  it("is missing a RHAZ image.", () => {
    const container = screen.getAllByTestId("image");
    expect(container).toHaveLength(6);
  });
});

describe("Today is the second day of the month and front camera image is UNAVAILABLE", () => {
  let axiosGetSpy;
  beforeEach(async () => {
    const today = [2033, 7, 2];
    const yesterday = [2033, 7, 1];

    const func = require("../helper");
    func.getTodayDate = jest.fn(() => today);
    const ftImgUrlToday = func.getFtImgUrl(today);

    const ftImgUrlYesterday = func.getFtImgUrl(yesterday);

    axiosGetSpy = jest.spyOn(axios, "get").mockImplementation((url) => {
      url = func.validateOtherImgUrl(url) ? "otherImgUrl" : url;

      switch (url) {
        case func.getWeatherUrl:
          return Promise.resolve({ data: fake.weatherData1 });
        case ftImgUrlToday:
          return Promise.resolve({ data: { photos: [] } });
        case ftImgUrlYesterday:
        case "otherImgUrl":
          return Promise.resolve({ data: fake.julImgData });
        case func.getNewsUrl:
          return Promise.resolve({ data: fake.newsData });
        default:
          return Promise.reject(new Error("Test error - url not found."));
      }
    });

    await act(async () => {
      await render(<App />);
    });
  });

  afterEach(() => {
    axiosGetSpy.mockRestore();
    jest.unmock("../helper");
    cleanup();
  });

  it("back tracks to first day of the month.", () => {
    const date = screen.getByTestId("image-date");
    expect(date.textContent).toBe("(2033-07-01)");
  });
});

describe("buttons", () => {
  let axiosGetSpy;
  beforeEach(async () => {
    const dateArray = func.getTodayDate();
    // const ftImgUrlToday = func.getFtImgUrl(dateArray);

    axiosGetSpy = jest.spyOn(axios, "get").mockImplementation((url) => {
      url = func.validateOtherImgUrl(url) ? "imgUrl" : url;

      switch (url) {
        case func.getWeatherUrl:
          return Promise.resolve({ data: fake.weatherData1 });
        // case ftImgUrlToday:
        case "imgUrl":
          return Promise.resolve({ data: fake.junImgData });
        case func.getNewsUrl:
          return Promise.resolve({ data: fake.newsData });
        default:
          return Promise.reject(new Error("Test error - url not found."));
      }
    });
    await act(async () => {
      await render(<App />);
    });
  });

  afterEach(() => {
    axiosGetSpy.mockRestore();
    cleanup();
  });

  it("toggles from celcius to farenheit.", () => {
    const toggleBtn = screen.getByTestId("unit-toggle");
    fireEvent.click(toggleBtn);
    const tempNodes = screen.getAllByTestId("temperature");
    expect(tempNodes).toMatchSnapshot();
  });

  it("toggles from farenheit to celcius.", () => {
    const toggleBtn = screen.getByTestId("unit-toggle");
    fireEvent.click(toggleBtn);
    fireEvent.click(toggleBtn);
    const tempNodes = screen.getAllByTestId("temperature");
    expect(tempNodes).toMatchSnapshot();
  });

  it("displays a modal explaining each piece of weather infomation.", async () => {
    const info = screen.getByTestId("info");
    fireEvent.click(info);
    const modal = screen.getByTestId("modal");
    expect(modal).toMatchSnapshot();
  });

  it("returns to main page after clicking close modal.", () => {
    const info = screen.getByTestId("info");
    fireEvent.click(info);
    const closeBtn = screen.getByTestId("closeModalBtn");
    fireEvent.click(closeBtn);
    const container = screen.getByTestId("home-container");
    expect(container).toMatchSnapshot();
  });
});

describe("Help functions", () => {
  it("returns the previous date", () => {
    const date1 = func.getPreviousMonthDate(2021, 1);
    const date2 = func.getPreviousMonthDate(2021, 5);
    const date3 = func.getPreviousMonthDate(2021, 3);
    expect(date1).toEqual([2020, 12, 31]);
    expect(date2).toEqual([2021, 4, 30]);
    expect(date3).toEqual([2021, 2, 28]);
  });

  it("converts celsius to fahrenheit.", () => {
    const fah = func.convertCelToFah(1);
    expect(fah).toEqual("33.80");
  });
});

describe("Errors", () => {
  let axiosGetSpy;
  console.error = jest.fn();

  beforeEach(async () => {
    const dateArray = func.getTodayDate();
    const ftImgUrlToday = func.getFtImgUrl(dateArray);

    axiosGetSpy = jest.spyOn(axios, "get").mockImplementation((url) => {
      url = func.validateOtherImgUrl(url) ? "otherImgUrl" : url;
      switch (url) {
        case func.getWeatherUrl:
          return Promise.resolve({ data: {} });
        case ftImgUrlToday:
        case "otherImgUrl":
          return Promise.resolve({ data: {} });
        case func.getNewsUrl:
          return Promise.resolve({ data: "error" });
        default:
          return Promise.reject(new Error("Test error - url not found."));
      }
    });

    await act(async () => {
      await render(<App />);
    });
  });

  afterEach(() => {
    axiosGetSpy.mockRestore();
    cleanup();
  });

  it("handles errors in fetching.", () => {
    expect(console.error).toHaveBeenCalledTimes(4);
  });
});
