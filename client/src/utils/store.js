/* store.js: redux store instantiation */
import { reducer } from "./reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";

const StoreProvider = ({ children }) => {
    const store = createStore(reducer);

    return <Provider store={store}>{children}</Provider>;
}

export default StoreProvider;
