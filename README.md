# Quiz app

To use the app, visit http://tonyhignett-cup-quiz.s3-website.eu-west-2.amazonaws.com/.

## Notes

- I re-uploaded the API data to my bucket so I could set CORS headers to allow it to be accessed.
- I have not implemented a "splash" screen for the rounds in Activity 2. There is an inconsistency: the written requirements say "the user is prompted to take the next round", but the wireframes imply a screen which lcears automatically. In reality I'd get clarification on this requirement; here I'm working at the weekend so I don't expect to get it in time.
- Asterisks in markdown cause italics, not bold type. But markdown seems natural, so I've kept it. In reality I'd suggest changing the data to use underscores.
- I've used "Incorrect" instead of "False" for results where the user gave the wrong answer, because it's consistent with "Correct". In reality I'd point this out to check the change.
- I didn't add SASS for reasons of time, but even in such a small app the CSS becomes messy without it.
- I also haven't implemented the scrollbar on the results page for reasons of time.

## Development

### Run locally

```yarn start```

### Build

```yarn build```

### Deploy to S3

```yarn deploy```