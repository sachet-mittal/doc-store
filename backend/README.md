# Backend Deployment

This folder now contains a Lambda version of the Express API. `app.ts` defines the Express application while `handler.ts` exposes it as an AWS Lambda function via `serverless-http`.

## Build

```bash
npm install
npm run build
```

The compiled files are placed in `dist/` and can be deployed with AWS SAM.

## Deploy with AWS SAM

1. Install the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html).
2. From this directory run:

```bash
sam deploy --guided
```

SAM will package the Lambda code and create an HttpApi. Provide values for `S3_BUCKET`, `DDB_TABLE` and `OPENSEARCH_URL` when prompted or edit `template.yaml` before deploying.

After deployment SAM prints the HTTPS endpoint for the API. Update the mobile app's `backendUrl` to this value.
