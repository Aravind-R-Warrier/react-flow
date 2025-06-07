import React from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import WorkflowCanvas from "./components/WorkflowCanvas";

const App = () => (
  <Provider store={store}>
    <WorkflowCanvas />
  </Provider>
);

export default App;
