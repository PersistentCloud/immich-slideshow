# Immich Slideshow App

<table class="images" width="100%"  style="border:0px solid white; width:100%;">
    <tr style="border: 0px;">
        <td width="50%" style="border:0px; width:50%">
            <img src="/example_screenshots/example_1.png" alt="Landscape Image"/>
        </td>
        <td width="50%" style="border:0px; width:50%">
            <img src="/example_screenshots/example_2.png" alt="Portrait Image" />
        </td>
    </tr>
</table>

The **Immich Slideshow App** is a React application that displays a slideshow of images provided 
by [immich](https://github.com/immich-app/immich). The app utilises the OpenWeatherMap API to retrieve current weather
data and displays it along with sunrise and sunset times.

## Table of Contents

- [Immich Slideshow App](#immich-slideshow-app)
  - [Table of Contents](#table-of-contents)
  - [Disclaimer](#disclaimer)
  - [Features](#features)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Installation Steps](#installation-steps)
  - [Docker Build](#docker-build)
  - [Usage](#usage)
    - [Local](#local)
    - [Docker Compose](#docker-compose)
  - [Immich Reverse Proxy Configuration](#immich-reverse-proxy-configuration)
  - [API Keys](#api-keys)
  - [Additional informations](#additional-informations)
    - [Why does the fallback take effect with the GeoLocation query](#why-does-the-fallback-take-effect-with-the-geolocation-query)
  - [Contributing](#contributing)
  - [License](#license)

## Disclaimer

- This project is not affiliated with immich!
- Immich is under **very active** development. Breaking changes can always happen.
- I'm not a professional developer. Code Gore and the ignoring of best practices cannot be ruled out.
- **Breaking changes happend between v1 and v2. Please don't use the config.json but environment variables from now on.**

## Features

- Slideshow of images contained in multiple albums
- Refreshing the content automatically
- Shuffling the images so that you don't always see the same ones
- Display the current temperature and weather conditions
- Display the sunrise and sunset times
- Automatic temperature updates based on user location
- Nginx preconfigured to be ready when deployed in Docker
- v2.0.0 provides video support

## Installation

### Prerequisites

- Node.js (Version 16.X.X or higher)
- npm (Node Package Manager)
- Hosted Immich Server
- Immich API Key
- Reverse Proxy for Immich Server to avoid CORS issues
- OpenWeatherMap API Key

### Installation Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/PersistentCloud/immich-slideshow.git
   cd immich-slideshow
   ```

2. **Install dependencies**
   Go into the folder for slideshow-frontend and proxy-backend and execute following command there.

   ```bash
   npm install
   ```

3. **Configuration**

   - Create and adjust the .env variable according to .env.example
   - Set your API keys and other configurations.

## Docker Build

Run the following command:

```bash
build.sh <repository_url>
```

Keep in mind, that you will provide the config.json to your build. If there are any credentials during the build process,
they will be pushed and published.

## Usage

### Local

1. Start the proxy-backend with the following command:

   ```bash
   npm run dev
   ```

2. Start the slideshow-frontend with the following command:

   ```bash
   npm start
   ```

3. Open your web browser and navigate to <http://localhost:3001> (or the specified URL).

### Docker Compose

1. Ensure you have Docker and Docker Compose installed on your system.
2. Use the docker-compose.example.yml file in the root of your project directory. It is important to run immich-slideshow
   in the same network as the immich-server, otherwise you will receive an issue with the nginx configuration.
3. Run your application using Docker Compose:

   ```bash
   docker compose up -d
   ```

This will start your application and make it accessible at <http://localhost:8780>. Use the environment variables 
to configure the application.

## Immich Reverse Proxy Configuration

The Nginx configuration for the immich server can be found in the official documentation at
<https://immich.app/docs/administration/reverse-proxy/>.
Please note that the port is not correct and has been corrected in the [default.conf](nginx/default.conf).
Corresponding CORS headers have also been added. These should be adjusted if necessary.

**_NOTE:_** When you build this and you want to create a docker image, ffs leave the
IMMICH_API_BASE_URL & REACT_APP_PROXY_URL config variable empty. I don't know why, it seems like magic, but I lost
a day to figure this out. For more informations you can visit <https://github.com/dmaze/docker-frontend-hostnames>.

**_NOTE 2:_** Please bear in mind that you need a reverse proxy to access the Immich API via the React app.
In my case, I use the already started container as such. If you don't have the app running in your docker setup
before you try to program something locally, no images will be displayed.

## API Keys

This app uses various APIs, including:

- [OpenWeatherMap](https://openweathermap.org/): for weather data and forecasts. An API key is required and should be
  configured in the .env file.
- [Immich](https://immich.app/): for the Pictures which are used for the Slideshow.

## Additional informations

### Why does the fallback take effect with the GeoLocation query

<https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts>

tl;dr: You must access the App either on localhost or through HTTPS.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the GNU General Public License v3.0. See the LICENSE.md file for details.
