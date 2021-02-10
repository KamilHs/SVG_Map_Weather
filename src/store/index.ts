import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";

import { mapReducer } from "../modules/Content/components/Map/redux/reducers";

const rootReducer = combineReducers({
    map: mapReducer
})

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [thunk];

export type RootState = ReturnType<typeof rootReducer>

export default createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middlewares))
);
