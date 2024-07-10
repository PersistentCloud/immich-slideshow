import express from 'express';
import axios from 'axios';
import { Request, Response } from 'express';
import { validate as uuidValidate } from 'uuid';
import dotenv from "dotenv"

dotenv.config() // Load environment variables from .env file 

const app = express();
const port = 3000;

const IMMICH_API_BASE_URL = process.env.IMMICH_API_BASE_URL ? process.env.IMMICH_API_BASE_URL : '';
const IMMICH_API_KEY = process.env.IMMICH_API_KEY;


app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});


app.get('/config', (req: Request, res: Response) => {
    const config = {
        OPENWEATHERMAP_API_KEY: process.env.OPENWEATHERMAP_API_KEY,
        IMMICH_ALBUM_IDS: process.env.IMMICH_ALBUM_IDS.split(', '),
        EXCLUDED_FILE_TYPES: process.env.EXCLUDED_FILE_TYPES.split(', '),
        SLIDESHOW_INTERVAL_SECONDS: parseInt(process.env.SLIDESHOW_INTERVAL_SECONDS, 10),
        ALBUM_UPDATE_INTERVAL_MINUTES: parseInt(process.env.ALBUM_UPDATE_INTERVAL_MINUTES, 10),
        FALLBACK_COORDINATES: {
            latitude: parseFloat(process.env.FALLBACK_LATITUDE),
            longitude: parseFloat(process.env.FALLBACK_LONGITUDE)
        }
    };

    res.json(config);
});


app.use('/albums/:albumId', async (req: Request, res: Response) => {
    const albumId = req.params.albumId
    if (!albumId || !uuidValidate(albumId)) {
        return res.status(400).send("Invalid or missing albumId");
    }
    const url = `${IMMICH_API_BASE_URL}/api/albums/${albumId}`;
    await axios({
        method: "GET",
        url,
        headers: {
            'x-api-key': IMMICH_API_KEY
        }
    }).then(response => {
        res.header(response.headers);
        return res.json(response.data);
    }).catch(error => {
        console.error(`Error proxying request to ${req.originalUrl}:`, error);
        res.status(500).json(error);
    });
});


app.use('/image/:imageId', async (req: Request, res: Response) => {
    const imageId = req.params.imageId
    if (!imageId || !uuidValidate(imageId)) {
        return res.status(400).send("Invalid or missing imageId");
    }
    const url = `${IMMICH_API_BASE_URL}/api/assets/${imageId}/original`;
    await axios({
        method: "GET",
        url,
        headers: {
            'x-api-key': IMMICH_API_KEY
        },
        responseType: 'stream',
    }).then(response => {
        res.header(response.headers);
        response.data.pipe(res);
    }).catch(error => {
        console.error(`Error proxying request to ${req.originalUrl}:`, error);
        res.status(500).json(error);
    });
});


app.use('/video/:videoId', async (req: Request, res: Response) => {
    const videoId = req.params.videoId
    if (!videoId || !uuidValidate(videoId)) {
        return res.status(400).send("Invalid or missing videoId");
    }
    const url = `${IMMICH_API_BASE_URL}/api/assets/${videoId}/video/playback`;
    await axios({
        method: 'GET',
        url,
        headers: {
            'x-api-key': IMMICH_API_KEY
        },
        responseType: 'stream',
    }).then(response => {
        res.header(response.headers);
        response.data.pipe(res);
    }).catch(error => {
        console.error(`Error proxying request to ${req.originalUrl}:`, error);
        res.status(500).json(error);
    });
});


app.listen(port, () => {
    console.log(`Proxy server listening on port ${port}`);
});
