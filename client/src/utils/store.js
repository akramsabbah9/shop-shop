/* store.js: redux store instantiation */
import { reducer } from "./reducers";
import { createStore } from "redux";

export const store = createStore(reducer);
