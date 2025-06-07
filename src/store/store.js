import { configureStore } from "@reduxjs/toolkit";
import workflowReducer from "../store/workflowSlice.js";

const store = configureStore({
  reducer: {
    workflow: workflowReducer,
  },
});

export default store;
