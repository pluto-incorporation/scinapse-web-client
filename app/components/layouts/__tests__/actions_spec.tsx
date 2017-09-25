jest.unmock("../actions");

import * as Actions from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";

describe("layout actions", () => {
  let store: any;

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("Scroll Top Action", () => {
    it("should return HEADER_REACH_SCROLL_TOP action", () => {
      store.dispatch(Actions.reachScrollTop());
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.HEADER_REACH_SCROLL_TOP,
      });
    });
    it("should return HEADER_LEAVE_SCROLL_TOP action", () => {
      store.dispatch(Actions.leaveScrollTop());
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.HEADER_LEAVE_SCROLL_TOP,
      });
    });
  });
});
