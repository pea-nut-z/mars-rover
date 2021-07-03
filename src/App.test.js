import React from "react";
import fetchMock from "fetch-mock";
import { render, screen, act } from "@testing-library/react";
import App from "./App";


describe("testing", () => {
  let component;

  beforeEach(() => {
    const mockData = {
      TZ_Data: "America/Port_of_Spain",
abs_humidity: null,
atmo_opacity: "Sunny",
id: 1314,
local_uv_irradiance_index: "Moderate",
ls: 62,
max_gts_temp: -16,
max_temp: -25,
min_gts_temp: -80,
min_temp: -78,
pressure: 869,
pressure_string: "Higher",
season: "Month 3",
sol: 3157,
status: 200,
sunrise: "06:04",
sunset: "17:49",
terrestrial_date: "2021-06-23T00:00:00.000Z",
unitOfMeasure: "Celsius",
wind_direction: null,
wind_speed: null,

    };
    fetchMock.mock("https://api.maas2.apollorion.com/", mockData);
    // fetchMock.mock("/second/url", 404);

    const { findById } = render(
      <AccountInfo />
    );
    component = shallow(<Component />);
  });
  
  /* You should also restore the original fetch in afterEach */
  afterEach(() => {
    fetchMock.restore();
  }
    
    
  it("it tests", () => {
    
  })
})