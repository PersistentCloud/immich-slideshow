# Immich Slideshow App

The **Weather Slideshow App** is an React application that displays a slideshow of weather images based on the user's current location. The app utilizes the OpenWeatherMap API to fetch current weather data and displays it along with sunrise and sunset times.

## Table of Contents

- [Immich Slideshow App](#immich-slideshow-app)
  - [Table of Contents](#table-of-contents)
  - [Disclaimer](#disclaimer)
  - [Features](#features)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Installation Steps](#installation-steps)
  - [Usage](#usage)
  - [Docker](#docker)
  - [Immich Reverse Proxy Configuration](#immich-reverse-proxy-configuration)
  - [API Keys](#api-keys)
  - [Example Screens](#example-screens)
  - [Contributing](#contributing)
  - [License](#license)

## Disclaimer

- This project is not affiliated with immich!
- Immich is under **very active** development. Breaking changes can always happen.
- I'm not a professional developer. Code Gore and the ignoring of best practices cannot be ruled out.

## Features

- Display of a slideshow of images contained in multiple albums
- Refreshing the content
- Shuffling the images so that you don't always see the same pictures
- Display of current temperature and weather conditions
- Display of sunrise and sunset times
- Automatic updates based on user location
- Nginx preconfigured to be ready when deployed in Docker

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
   git clone https://github.com/your-username/weather-slideshow-app.git
   cd weather-slideshow-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configuration**

   - Create a .env file in the root directory based on .env.example.
   - Set your API keys and other configurations.

## Usage

1. Start the application with the following command:

   ```bash
   npm start
   ```

2. Open your web browser and navigate to <http://localhost:3000> (or the specified URL).

## Docker

Run the following command:

```bash
build.sh <repository_url>
```

Keep in mind, that you should only use this with a private repository. All variables are hardcoded during build. Unfortunately there is no other way. Therefore I hosted a repository for myself.

## Immich Reverse Proxy Configuration

The Nginx configuration for the immich server can be found in the official documentation at <https://immich.app/docs/administration/reverse-proxy/>. Please note that the port is not correct and has been corrected in the [default.conf](nginx/default.conf). Corresponding CORS headers have also been added. These should be adjusted if necessary.

**_NOTE:_** When you build this and you want to create a docker image, ffs leave the REACT_APP_IMMICH_API_BASE_URL environment variable empty. I don't know why, it seems like magic, but I lost a day to figure this out. For more informations you can visit <https://github.com/dmaze/docker-frontend-hostnames>.

**_NOTE 2:_** Please bear in mind that you need a reverse proxy to access the Immich API via the React app. In my case, I use the already started container as such. If you don't have the app running in your docker setup before you try to program something locally, no images will be displayed.

## API Keys

This app uses various APIs, including:

- [OpenWeatherMap](https://openweathermap.org/): for weather data and forecasts. An API key is required and should be configured in the .env file.
- [Immich](https://immich.app/): for the Pictures which are used for the Slideshow.

## Example Screens

![Landscape Mode Picture](./example_screenshots/example_1.png)
![Portrait Mode Picture](./example_screenshots/example_2.png)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the GNU General Public License v3.0. See the LICENSE.md file for details.
