export type APIRound = {
  round_title: string;
};

export type APIQuestion = {
  is_correct: boolean;
  stimulus: string;
};

type BaseActivity = {
  activity_name: string;
  // We'll use this as the activity ID, so we don't assume the API returns activities in order.
  order: number;
};

export type APISimpleActivity = BaseActivity & {
  questions: APIQuestion[];
};

export type APIMultiRoundActivity = BaseActivity & {
  questions: APIRound[];
};

export type APIActivity = APISimpleActivity | APIMultiRoundActivity;

export type APIResponse = {
  name: string;
  activities: APIActivity[];
};

export function isSimpleActivity(
  activity: APIActivity,
): activity is APISimpleActivity {
  return "is_correct" in activity.questions[0];
}
