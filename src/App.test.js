/**
 * @jest-environment jsdom
 */

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

import React from "react";
import "@testing-library/jest-dom";
import fetchMock from "fetch-mock";
import { render, screen, act, waitForElementToBeRemoved } from "@testing-library/react/pure";
import App from "./App";
import Modal from "react-modal";
import { shallow, mount } from "enzyme";

describe("testing", () => {
  it("should do async work", async () => {
    let component = mount(<App />);
    requests.pop().respond(200);

    setTimeout(() => {
      try {
        component.update();
        // assertNewBehaviour();
        done();
      } catch (error) {
        done(error);
      }
    }, 1000);
    console.log(component.debug());
  });
});
