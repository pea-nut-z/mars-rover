/**
 * @jest-environment jsdom
 */

import { render, cleanup, getByText } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";
import axios from "axios";
import App from "./App";
import { fakeWeatherData, fakeImgData, fakeNewsData } from "./fake.data";
import { getTodayDate, weatherUrl, getFtImgUrl, checkImgUrl, newsUrl } from "./helper";

jest.mock("axios");

const dateArray = getTodayDate();
const frontCameraImgUrl = getFtImgUrl(dateArray);

describe("Fetch today's data - front camera image is available.", () => {
  const axiosGetSpy = jest.spyOn(axios, "get").mockImplementation((url) => {
    if (checkImgUrl(url)) url = "otherImgUrl";
    switch (url) {
      case weatherUrl:
        return Promise.resolve({ data: fakeWeatherData });
      case frontCameraImgUrl:
      case "otherImgUrl":
        return Promise.resolve({ data: fakeImgData });
      case newsUrl:
        return Promise.resolve({ data: fakeNewsData });
      default:
        return Promise.reject(new Error("Test error - url not found."));
    }
  });

  let getByTestId;
  beforeAll(async () => {
    await act(async () => {
      const component = await render(<App />);
      getByTestId = component.getByTestId;
    });
  });

  afterAll(() => {
    cleanup();
    axiosGetSpy.mockRestore();
  });

  it("displays today's data.", async () => {
    const container = getByTestId("container");
    expect(container).toMatchSnapshot();
  });
});
