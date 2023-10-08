import { Link, useLoaderData } from "react-router-dom";
import {
  APIActivity,
  APIQuestion,
  APISimpleActivity,
  isSimpleActivity,
} from "../lib/schema";
import { useState } from "react";

function SimpleResults({ answers }: { answers: boolean[] }) {
  return (
    <div>
      {answers.map((answer, index) => {
        return (
          <div key={index}>
            <div>Q{index + 1}</div>
            <div>{answer ? "Correct" : "Incorrect"}</div>
          </div>
        );
      })}
    </div>
  );
}

function Question({
  data,
  onUserResponse,
}: {
  data: APIQuestion;
  onUserResponse: (userAnsweredCorrectly: boolean) => void;
}) {
  return (
    <>
      <p>{data.stimulus}</p>
      <div>
        <button onClick={() => onUserResponse(data.is_correct)}>Correct</button>
        <button onClick={() => onUserResponse(!data.is_correct)}>
          Incorrect
        </button>
      </div>
    </>
  );
}

function SimpleActivity({ data }: { data: APISimpleActivity }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  function onUserResponse(userAnsweredCorrectly: boolean) {
    setQuestionIndex((prevIndex) => prevIndex + 1);
    setAnswers((prevAnswers) => [...prevAnswers, userAnsweredCorrectly]);
  }

  if (questionIndex === data.questions.length) {
    return (
      <div>
        <p>{data.activity_name}</p>
        <p>Results</p>
        <SimpleResults answers={answers} />
        <Link to={"/"}>Home</Link>
      </div>
    );
  } else {
    return (
      <div>
        <p>{data.activity_name}</p>
        <p>Q{questionIndex + 1}.</p>
        <Question
          data={data.questions[questionIndex]}
          onUserResponse={onUserResponse}
        />
      </div>
    );
  }
}

export function Activity() {
  const activity = useLoaderData() as APIActivity;
  if (isSimpleActivity(activity)) {
    return <SimpleActivity data={activity} />;
  } else {
    return <>multi-round</>;
  }
}
