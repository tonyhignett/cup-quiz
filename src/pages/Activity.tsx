import { Link, useLoaderData } from "react-router-dom";
import {
  APIActivity,
  APIMultiRoundActivity,
  APIQuestion,
  APISimpleActivity,
  isSimpleActivity,
} from "../lib/schema";
import { useState } from "react";
import Markdown from "react-markdown";

function RoundResults({ results }: { results: boolean[] }) {
  return (
    <>
      {results.map((result, index) => {
        return (
          <div className={"result border"} key={index}>
            <div className={"text-left"}>Q{index + 1}</div>
            <div className={"text-right"}>
              {result ? "Correct" : "Incorrect"}
            </div>
          </div>
        );
      })}
    </>
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
      <div className={"text-left border"}>
        <Markdown>{data.stimulus}</Markdown>
      </div>
      <div className={"answer-buttons"}>
        <button
          className={"answer-button"}
          onClick={() => onUserResponse(data.is_correct)}
        >
          Correct
        </button>
        <button
          className={"answer-button"}
          onClick={() => onUserResponse(!data.is_correct)}
        >
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
      setResults([]);
      onComplete([...results, userAnsweredCorrectly]);
    } else {
      setQuestionIndex((prevIndex) => prevIndex + 1);
      setResults((prevResults) => [...prevResults, userAnsweredCorrectly]);
    }
  }

  return (
    <>
      <div className={"title text-left"}>Q{questionIndex + 1}.</div>
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
        <div className={"header text-center"}>{data.activity_name}</div>
        <div className={"title text-center"}>Results</div>
        <RoundResults results={results} />
        <div className={"link"}>
          <Link to={"/"}>Home</Link>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className={"header text-left"}>{data.activity_name}</div>
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
        <div className={"header text-center"}>{data.activity_name}</div>
        <div className={"title text-center"}>Results</div>
        {results.map((roundResults, index) => {
          return (
            <>
              <div className={"round-results-header text-center border"}>
                {data.questions[index].round_title}
              </div>
              <RoundResults results={roundResults} />
            </>
          );
        })}
        <div className={"link"}>
          <Link to={"/"}>Home</Link>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className={"header text-left"}>
          {data.activity_name} / {data.questions[roundIndex].round_title}
        </div>
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
