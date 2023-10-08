import React from "react";
import { createBrowserRouter, json, RouterProvider } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { Activity } from "./pages/Activity";
import { APIResponse } from "./lib/schema";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: async () => {
      return await fetch(
        "https://s3.eu-west-2.amazonaws.com/tonyhignett-cup-quiz/api/payload.json",
      );
    },
  },
  {
    path: "/activity/:order",
    element: <Activity />,
    loader: async ({ params }) => {
      // Pretend that we only fetched the specific activity from the API.
      const response = await fetch(
        "https://s3.eu-west-2.amazonaws.com/tonyhignett-cup-quiz/api/payload.json",
      );
      const body = await response.json();
      return json(
        (body as APIResponse).activities.find(
          (activity) => activity.order === parseInt(params.order!),
        ),
      );
    },
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
