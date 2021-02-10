import React from 'react';
import { Provider } from "react-redux"

import { Map } from "./modules/Content";
import Sidebar from "./modules/Sidebar";
import store from "./store";

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Map />
            <Sidebar />
        </Provider>
    )
}

export default App;
