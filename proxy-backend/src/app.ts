import express from 'express';
import axios from 'axios';
import { Request, Response } from 'express';

const app = express();
const port = 3000;

const IMMICH_API_BASE_URL = process.env.IMMICH_API_BASE_URL;
const IMMICH_API_KEY = process.env.IMMICH_API_KEY;


// Proxy all requests to Immich
app.use('/proxy', async (req: Request, res: Response) => {
    const url = `${IMMICH_API_BASE_URL}${req.originalUrl.replace('/proxy', '')}`;
    await axios({
        method: req.method,
        url,
        headers: {
            'x-api-key': IMMICH_API_KEY,
            ...req.headers,
        },
        data: req.body,
        responseType: 'stream',
    }).then(response => {
        response.data.pipe(res);
    }).catch(error => {
        console.error(`Error proxying request to ${req.originalUrl}:`, error);
        res.status(500).send('Error proxying request');
    });
});

app.listen(port, () => {
    console.log(`Proxy server listening on port ${port}`);
});
