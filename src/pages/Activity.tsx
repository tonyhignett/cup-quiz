import { Link, useLoaderData } from "react-router-dom";
import {
  APIActivity,
  APIMultiRoundActivity,
  APIQuestion,
  APISimpleActivity,
  isSimpleActivity,
} from "../lib/schema";
import { useState } from "react";

function RoundResults({ results }: { results: boolean[] }) {
  return (
    <div>
      {results.map((result, index) => {
        return (
          <div key={index}>
            <div>Q{index + 1}</div>
            <div>{result ? "Correct" : "Incorrect"}</div>
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

function Round({
  questions,
  onComplete,
}: {
  questions: APIQuestion[];
  onComplete: (answers: boolean[]) => void;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);

  function onUserResponse(userAnsweredCorrectly: boolean) {
    if (questionIndex === questions.length - 1) {
      setQuestionIndex(0);
      onComplete([...results, userAnsweredCorrectly]);
    } else {
      setQuestionIndex((prevIndex) => prevIndex + 1);
      setResults((prevResults) => [...prevResults, userAnsweredCorrectly]);
    }
  }

  return (
    <>
      <p>Q{questionIndex + 1}.</p>
      <Question
        data={questions[questionIndex]}
        onUserResponse={onUserResponse}
      />
    </>
  );
}

function SimpleActivity({ data }: { data: APISimpleActivity }) {
  const [results, setResults] = useState<boolean[]>([]);

  function onComplete(answers: boolean[]) {
    setResults(answers);
  }

  if (results.length > 0) {
    return (
      <div>
        <p>{data.activity_name}</p>
        <p>Results</p>
        <RoundResults results={results} />
        <Link to={"/"}>Home</Link>
      </div>
    );
  } else {
    return (
      <div>
        <p>{data.activity_name}</p>
        <Round questions={data.questions} onComplete={onComplete} />
      </div>
    );
  }
}

function MultiRoundActivity({ data }: { data: APIMultiRoundActivity }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [results, setResults] = useState<boolean[][]>([]);

  function onRoundComplete(roundResults: boolean[]) {
    setRoundIndex((prevIndex) => prevIndex + 1);
    setResults((prevResults) => [...prevResults, roundResults]);
  }

  if (roundIndex === data.questions.length) {
    return (
      <div>
        <p>{data.activity_name}</p>
        <p>Results</p>
        {results.map((roundResults, index) => {
          return (
            <>
              <p>{data.questions[index].round_title}</p>
              <RoundResults results={roundResults} />
            </>
          );
        })}
        <Link to={"/"}>Home</Link>
      </div>
    );
  } else {
    return (
      <div>
        <p>
          {data.activity_name} / {data.questions[roundIndex].round_title}
        </p>
        <Round
          questions={data.questions[roundIndex].questions}
          onComplete={onRoundComplete}
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
    return <MultiRoundActivity data={activity} />;
  }
}
