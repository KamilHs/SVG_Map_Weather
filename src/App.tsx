import React from 'react';
import { Provider } from "react-redux"

import { Map } from "./modules/Content";
import store from "./store";

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Map />
        </Provider>
    )
}

export default App;
