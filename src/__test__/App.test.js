/**
 * @jest-environment jsdom
 */

import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import axios from "axios";
import App from "../App";
import { fakeWeatherData, fakeImgData, fakeNewsData } from "./fake.data";
import {
  getTodayDate,
  getPreviousMonthDate,
  weatherUrl,
  getFtImgUrl,
  validateOtherImgUrl,
  newsUrl,
} from "../helper";

jest.mock("axios");

const dateArray = getTodayDate();
const ftImgUrlToday = getFtImgUrl(dateArray);

describe("Today's front camera image is AVAILABLE.", () => {
  const axiosGetSpy = jest.spyOn(axios, "get").mockImplementation((url) => {
    if (validateOtherImgUrl(url)) url = "otherImgUrl";
    switch (url) {
      case weatherUrl:
        return Promise.resolve({ data: fakeWeatherData });
      case ftImgUrlToday:
      case "otherImgUrl":
        return Promise.resolve({ data: fakeImgData });
      case newsUrl:
        return Promise.resolve({ data: fakeNewsData });
      default:
        return Promise.reject(new Error("Test error - url not found."));
    }
  });

  beforeAll(async () => {
    await act(async () => {
      await render(<App />);
    });
  });

  afterAll(() => {
    cleanup();
    axiosGetSpy.mockRestore();
  });

  it("displays today's images, latest weather and news data.", async () => {
    const container = screen.getByTestId("container");
    expect(container).toMatchSnapshot();
  });
});

describe("Today's front camera image is UNAVAILABLE.", () => {
  const dateArray = getTodayDate();
  const [year, month, day] = dateArray;
  const yesterday = day === 1 ? getPreviousMonthDate(year, month) : [year, month, day - 1];
  const ftImgUrlYesterday = getFtImgUrl(yesterday);

  const axiosGetSpy = jest.spyOn(axios, "get").mockImplementation((url) => {
    if (validateOtherImgUrl(url)) url = "otherImgUrl";

    switch (url) {
      case weatherUrl:
        return Promise.resolve({ data: fakeWeatherData });
      case ftImgUrlToday:
        return Promise.resolve({ data: { photos: [] } });
      case ftImgUrlYesterday:
      case "otherImgUrl":
        return Promise.resolve({ data: fakeImgData });
      case newsUrl:
        return Promise.resolve({ data: fakeNewsData });
      default:
        return Promise.reject(new Error("Test error - url not found."));
    }
  });

  beforeAll(async () => {
    await act(async () => {
      await render(<App />);
    });
  });

  afterAll(() => {
    cleanup();
    axiosGetSpy.mockRestore();
  });

  it("displays a modal explaining each piece of weather infomation.", async () => {
    const info = screen.getByTestId("info");
    fireEvent.click(info);
    const modal = screen.getByTestId("modal");
    expect(modal).toMatchSnapshot();
  });

  it("back tracks to the latest images available", () => {
    expect(axiosGetSpy).toBeCalledWith(ftImgUrlYesterday);
  });
});

describe("Help functions", () => {
  it("returns the previous date", () => {
    const date1 = getPreviousMonthDate(2021, 1);
    const date2 = getPreviousMonthDate(2021, 5);
    const date3 = getPreviousMonthDate(2021, 3);
    expect(date1).toEqual([2020, 12, 31]);
    expect(date2).toEqual([2021, 4, 30]);
    expect(date3).toEqual([2021, 2, 28]);
  });
});
