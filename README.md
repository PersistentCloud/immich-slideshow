# Weather Slideshow App

The **Weather Slideshow App** is an React application that displays a slideshow of weather images based on the user's current location. The app utilizes the OpenWeatherMap API to fetch current weather data and displays it along with sunrise and sunset times.

## Disclaimer

- Immich is under **very active** development. Breaking changes can always happen.
- I'm not a professional developer. Code Gore and the ignoring of best practices cannot be ruled out.

## Features

- Display of a slideshow of images contained in multiple albums
- Refreshing the content
- Shuffling the images so that you don't always see the same pictures
- Display of current temperature and weather conditions
- Display of sunrise and sunset times
- Automatic updates based on user location

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

## Immich Reverse Proxy Configuration

Nginx configuration for the immich server which can be found in the official documentation at <https://immich.app/docs/administration/reverse-proxy/>. Please note that the port is not correct and has been corrected in the following example. Corresponding CORS headers have also been added. These should be adjusted if necessary. In my case, the nginx server is not accessible from the internet, so I did not worry about this.

```text
server {
    # server_name <public_url>;

    # allow large file uploads
    client_max_body_size 50000M;

    # Set headers
    proxy_set_header Host              $http_host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # enable websockets: http://nginx.org/en/docs/http/websocket.html
    proxy_http_version 1.1;
    proxy_set_header   Upgrade    $http_upgrade;
    proxy_set_header   Connection "upgrade";
    proxy_redirect     off;

    # set timeout
    proxy_read_timeout 600s;
    proxy_send_timeout 600s;
        send_timeout       600s;

    location / {
        proxy_pass http://immich_server:3001;
        if ($request_method = 'OPTIONS') {
           add_header 'Access-Control-Allow-Origin' '*';
           add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
           #
           # Custom headers and headers various browsers *should* be OK with but aren't
           #
           add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization,x-api-key';
           #
           # Tell client that this pre-flight info is valid for 20 days
           #
           add_header 'Access-Control-Max-Age' 1728000;
           add_header 'Content-Type' 'text/plain; charset=utf-8';
           add_header 'Content-Length' 0;
           return 204;
        }
        if ($request_method = 'POST') {
           add_header 'Access-Control-Allow-Origin' '*' always;
           add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
           add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization,x-api-key' always;
           add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;
        }
        if ($request_method = 'GET') {
           add_header 'Access-Control-Allow-Origin' '*' always;
           add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
           add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization,x-api-key' always;
           add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;
        }
    }
}
```

## API Keys

This app uses various APIs, including:

- [OpenWeatherMap](https://openweathermap.org/): for weather data and forecasts. An API key is required and should be configured in the .env file.
- [Immich](https://immich.app/): for the Pictures which are used for the Slideshow.

## License

This project is licensed under the GNU General Public License v3.0.
