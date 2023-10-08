import { Link, useLoaderData } from "react-router-dom";
import { APIResponse } from "../lib/schema";

export function Home() {
  const apiResponse = useLoaderData() as APIResponse;

  return (
    <div>
      <p>CAE</p>
      <p>{apiResponse.name}</p>
      {apiResponse.activities.map((activity, index) => (
        <Link key={index} to={`/activity/${activity.order}`}>
          {activity.activity_name}
        </Link>
      ))}
    </div>
  );
}
