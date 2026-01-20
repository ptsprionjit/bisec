import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals.js";

//router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//store
import { Provider } from "react-redux";
//reducer
import { store } from "./store";

import Index from "./views/index.jsx";
// import { IndexRouters } from "./router";
import { SimpleRouter } from "./router/simple-router.jsx";
import { DefaultRouter } from "./router/default-router.jsx";

// Auth Provider
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./context/ProtectedRoute.jsx";

// React Pdf Worker File Set
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Index />,
    },
    ...SimpleRouter,
    ...DefaultRouter.map(route => ({
      ...route,
      element: (
        <ProtectedRoute>
          {route.element}
        </ProtectedRoute>
      ),
    })),
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App>
        <AuthProvider>
          <RouterProvider router={router}></RouterProvider>
        </AuthProvider>
      </App>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
