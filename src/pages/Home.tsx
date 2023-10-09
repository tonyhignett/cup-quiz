import { Link, useLoaderData } from "react-router-dom";
import { APIResponse } from "../lib/schema";

export function Home() {
  const apiResponse = useLoaderData() as APIResponse;

  return (
    <div>
      <div className={"header text-center"}>CAE</div>
      <div className={"title text-center"}>{apiResponse.name}</div>
      {apiResponse.activities.map((activity, index) => (
        <div className={"link border"}>
          <Link key={index} to={`/activity/${activity.order}`}>
            {activity.activity_name}
          </Link>
        </div>
      ))}
    </div>
  );
}
