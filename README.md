# doc-store

This repository contains a simple document storage application with a mobile client and a Node.js backend. Files are uploaded to Amazon S3, indexed in OpenSearch and their metadata is saved in DynamoDB.

## Backend

The backend is a TypeScript Express application located in `backend/`.
Run it locally with:

```
cd backend
npm install
npm start
```

The server listens on port **3000** and expects AWS credentials in the environment as usual along with optional variables `S3_BUCKET`, `DDB_TABLE` and `OPENSEARCH_URL`.

The same code can also be deployed as an AWS Lambda function. See `backend/README.md` for build and deployment steps.

## Mobile App

The React Native client lives in `mobile/` and uses Expo with TypeScript for ease of development.

```
cd mobile
npm install
npx expo start
```

The app lets users upload documents, list files from DynamoDB and download them back to the device.
