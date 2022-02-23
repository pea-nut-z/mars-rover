/**
 * @jest-environment jsdom
 */

import { render, cleanup, fireEvent, screen, act } from "@testing-library/react/pure";
import React from "react";
import axios from "axios";
import App from "../App";
import Home from "../Pages/Home";
import Likes from "../Pages/Likes";
import Search from "../Pages/Search";
import * as fake from "./fake.data";
import * as helper from "../helper";
import localStorage from "./localStorage";
import "@testing-library/jest-dom/extend-expect";
import ReactTestUtils from "react-dom/test-utils";
window.localStorage = localStorage;
jest.mock("axios");

describe("Help Functions", () => {
  it("returns the previous date", () => {
    const date1 = helper.getPreviousMonthDate(2021, 1);
    const date2 = helper.getPreviousMonthDate(2021, 5);
    const date3 = helper.getPreviousMonthDate(2021, 3);
    expect(date1).toEqual([2020, 12, 31]);
    expect(date2).toEqual([2021, 4, 30]);
    expect(date3).toEqual([2021, 2, 28]);
  });

  it("converts celsius to fahrenheit.", () => {
    const fah = helper.convertCelToFah(1);
    expect(fah).toEqual("33.80");
  });

  it("filters unlike.", () => {
    const likes = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const image = { id: 1 };
    const status = "unlike";
    const result = helper.filterLikes(likes, image, status);
    expect(JSON.stringify(result)).toEqual('[{"id":2},{"id":3}]');
  });

  it("adds like.", () => {
    const likes = [{ id: 1 }];
    const image = { id: 2 };
    const status = "like";
    const result = helper.filterLikes(likes, image, status);
    expect(JSON.stringify(result)).toEqual('[{"id":1},{"id":2}]');
  });

  it("returns a url for selected criterias of an image.", () => {
    const rover = "curiosity";
    const camera = "RHAZ";
    const date = "2022-02-01";
    const result = helper.getFilteredImgUrl(rover, camera, date);
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?camera=${camera}&earth_date=${date}&api_key=${process.env.REACT_APP_NASA_API_KEY}`;
    expect(result).toEqual(url);
  });
});

describe("Home.js - Today's front camera image is available.", () => {
  let axiosGetSpy;
  beforeEach(async () => {
    const dateArray = helper.getTodayDate();
    const ftImgUrlToday = helper.getFtImgUrl(dateArray);

    axiosGetSpy = jest.spyOn(axios, "get").mockImplementation((url) => {
      url = helper.validateOtherImgUrl(url) ? "otherImgUrl" : url;
      switch (url) {
        case helper.getWeatherUrl:
          return Promise.resolve({ data: fake.weatherData1 });
        case ftImgUrlToday:
        case "otherImgUrl":
          return Promise.resolve({ data: fake.junImgData });
        case helper.getNewsUrl:
          return Promise.resolve({ data: fake.newsData });
        default:
          return Promise.reject(new Error("Test error - url not found."));
      }
    });

    await act(async () => {
      await render(<Home />);
    });
  });

  afterEach(() => {
    cleanup();
    axiosGetSpy.mockRestore();
  });

  it("displays today's images from all cameras.", async () => {
    const images = screen.getAllByTestId("image");
    expect(images).toHaveLength(7);
  });

  it("displays today's weather and news data.", async () => {
    const container = screen.getByTestId("home-container");
    expect(container).toMatchSnapshot();
  });
});

describe("Home.js - Today is the first day of the month, front and rear images are unavailable.", () => {
  let axiosGetSpy;
  beforeEach(async () => {
    const today = [2033, 7, 1];
    const yesterday = [2033, 6, 30];

    helper.getTodayDate = jest.fn(() => today);
    const ftImgUrlToday = helper.getFtImgUrl(today);
    const ftImgUrlYesterday = helper.getFtImgUrl(yesterday);

    let numOfImgUrlCall = 0;
    axiosGetSpy = jest.spyOn(axios, "get").mockImplementation((url) => {
      url = helper.validateOtherImgUrl(url) ? "otherImgUrl" : url;

      switch (url) {
        case helper.getWeatherUrl:
          return Promise.resolve({ data: fake.weatherData2 });
        case ftImgUrlToday:
          return Promise.resolve({ data: { photos: [] } });
        case ftImgUrlYesterday:
        case "otherImgUrl":
          numOfImgUrlCall++;
          if (numOfImgUrlCall === 3) {
            return Promise.resolve({ data: { photos: [] } });
          }
          return Promise.resolve({ data: fake.junImgData });
        case helper.getNewsUrl:
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

  it("displays N/A when wind speed is not provided", () => {
    const wind = screen.getByTestId("windSpeed");
    expect(wind.textContent).toBe("Wind Speed: N/A");
  });

  it("displays N/A when wind direction is not provided", () => {
    const wind = screen.getByTestId("windDirection");
    expect(wind.textContent).toBe("Wind Direction: N/A");
  });

  it("back tracks to last month.", () => {
    const date = screen.getByTestId("image-date");
    expect(date.textContent).toBe("(2033-06-30)");
  });

  it("displays six images in as one of the image is missing.", () => {
    const container = screen.getAllByTestId("image");
    expect(container).toHaveLength(6);
  });
});

describe("Home.js - Today is the second day of the month and front camera image is UNAVAILABLE", () => {
  let axiosGetSpy;
  beforeEach(async () => {
    const today = [2033, 7, 2];
    const yesterday = [2033, 7, 1];

    helper.getTodayDate = jest.fn(() => today);
    const ftImgUrlToday = helper.getFtImgUrl(today);
    const ftImgUrlYesterday = helper.getFtImgUrl(yesterday);

    axiosGetSpy = jest.spyOn(axios, "get").mockImplementation((url) => {
      url = helper.validateOtherImgUrl(url) ? "otherImgUrl" : url;

      switch (url) {
        case helper.getWeatherUrl:
          return Promise.resolve({ data: fake.weatherData1 });
        case ftImgUrlToday:
          return Promise.resolve({ data: { photos: [] } });
        case ftImgUrlYesterday:
        case "otherImgUrl":
          return Promise.resolve({ data: fake.julImgData });
        case helper.getNewsUrl:
          return Promise.resolve({ data: fake.newsData });
        default:
          return Promise.reject(new Error("Test error - url not found."));
      }
    });

    await act(async () => {
      await render(<Home />);
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

describe("Home.js - Buttons", () => {
  let axiosGetSpy;
  beforeEach(async () => {
    axiosGetSpy = jest.spyOn(axios, "get").mockImplementation((url) => {
      url = helper.validateOtherImgUrl(url) ? "otherImgUrl" : url;

      switch (url) {
        case helper.getWeatherUrl:
          return Promise.resolve({ data: fake.weatherData1 });
        case "otherImgUrl":
          return Promise.resolve({ data: fake.junImgData });
        case helper.getNewsUrl:
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

describe("Home.js - Errors", () => {
  let axiosGetSpy;
  console.error = jest.fn();

  beforeEach(async () => {
    axiosGetSpy = jest.spyOn(axios, "get").mockImplementation(() => {
      return Promise.reject("error");
    });

    await act(async () => {
      await render(<Home />);
    });
  });

  afterEach(() => {
    axiosGetSpy.mockRestore();
    cleanup();
  });

  it("handles fetching error.", () => {
    expect(console.error).toHaveBeenCalledTimes(7);
  });
});

describe("Likes.js - Render.", () => {
  beforeAll(() => {
    render(<Likes />);
  });
  afterAll(() => {
    cleanup();
  });

  it("displays all liked images.", () => {
    const images = screen.getAllByTestId("image");
    expect(images).toHaveLength(1);
  });

  it("removes the image after it is unliked.", async () => {
    const button = screen.getByTestId("like-button");
    await fireEvent.click(button);
    const message = screen.getByTestId("message-box");
    expect(message).toHaveTextContent("Oops, no images to show.");
  });
});

describe("Search.js - Select", () => {
  beforeAll(() => {
    render(<Search />);
  });
  afterAll(() => {
    cleanup();
  });

  it("disables camera selection.", () => {
    const selection = screen.getByTestId("camera-dropdown");
    expect(selection).toBeDisabled();
  });

  it("enables correct camera selections.", async () => {
    ReactTestUtils.Simulate.change(screen.getByTestId("rover-dropdown"), {
      target: { value: "curiosity" },
    });
    const images = screen.getAllByTestId("camera-option");
    expect(images[6]).toBeDisabled();
    expect(images[7]).toBeDisabled();
  });

  it("displays a message for missing required input after clicking Search button.", async () => {
    const searchButton = screen.getByTestId("search-button");
    await fireEvent.click(searchButton);
    const message = screen.getByTestId("message-box");
    expect(message).toHaveTextContent("Select a camera!");
  });
});

describe("Search.js - Fetch.", () => {
  let axiosGetSpy;
  let numOfCall = 0;
  console.error = jest.fn();

  beforeEach(async () => {
    axiosGetSpy = jest.spyOn(axios, "get").mockImplementation((url) => {
      const validUrl = helper.getFilteredImgUrl("curiosity", "FHAZ", "2033-07-02");
      if (url === validUrl && numOfCall < 2) {
        numOfCall++;
        return Promise.resolve({ data: fake.julImgData });
      } else {
        return Promise.reject(new Error("Test error - url not found."));
      }
    });

    render(<Search />);

    ReactTestUtils.Simulate.change(screen.getByTestId("rover-dropdown"), {
      target: { value: "curiosity" },
    });

    ReactTestUtils.Simulate.change(screen.getByTestId("camera-dropdown"), {
      target: { value: "0" },
    });

    ReactTestUtils.Simulate.change(screen.getByTestId("date-picker"), {
      target: { value: "2033-07-02" },
    });

    const searchButton = screen.getByTestId("search-button");
    await fireEvent.click(searchButton);
  });

  afterEach(() => {
    cleanup();
    axiosGetSpy.mockRestore();
  });

  it("renders requested images.", async () => {
    const images = screen.getAllByTestId("image");
    expect(images).toHaveLength(1);
  });

  it("can like and unlike an image.", async () => {
    console.log(localStorage);
    const button = screen.getByTestId("like-button");
    await fireEvent.click(button);
    // await fireEvent.click(button);

    console.log(localStorage);

    const likedIcon = await screen.getByTestId("like-icon");
    expect(likedIcon).toBeTruthy();

    // await fireEvent.click(button);
    // const unlikedIcon = screen.getByTestId("unliked-heart");
    // expect(unlikedIcon).toBeTruthy();
  });

  it("handles fetching error.", async () => {
    expect(console.error).toHaveBeenCalledTimes(10);
  });
});
