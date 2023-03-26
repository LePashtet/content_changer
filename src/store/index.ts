import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from "redux-saga";
import contentReducer from "./reducers/contentReducer";
import contentSaga from "./saga/contentSaga";

let sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        content: contentReducer
    },
    middleware: [sagaMiddleware]
})

sagaMiddleware.run(contentSaga);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
