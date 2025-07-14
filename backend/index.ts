import express, { Request, Response } from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import { Client } from '@opensearch-project/opensearch';
import cors from 'cors';

const upload = multer();
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// configure AWS SDK from env variables
const s3 = new AWS.S3();
const dynamo = new AWS.DynamoDB.DocumentClient();
const osClient = new Client({ node: process.env.OPENSEARCH_URL || 'http://localhost:9200' });
const bucket = process.env.S3_BUCKET || 'doc-store-bucket';
const table = process.env.DDB_TABLE || 'doc-store';

app.post('/upload', upload.none(), async (req: Request, res: Response) => {
  const { name, data } = req.body;
  const key = Date.now() + '_' + name;
  await s3.putObject({ Bucket: bucket, Key: key, Body: Buffer.from(data, 'base64') }).promise();
  await dynamo.put({ TableName: table, Item: { id: key, name } }).promise();
  await osClient.index({ index: 'docs', id: key, body: { name } });
  res.json({ id: key });
});

app.get('/files', async (_req: Request, res: Response) => {
  const result = await dynamo.scan({ TableName: table }).promise();
  res.json(result.Items || []);
});

app.get('/download/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const obj = await s3.getObject({ Bucket: bucket, Key: id }).promise();
  res.json({ content: obj.Body.toString('base64') });
});

app.listen(3000, () => console.log('Server running on port 3000'));
