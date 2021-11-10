This project provide api to support listing local file

Edit docker-compose.yml and map your source path for root directory to volume :
For linux:

- x-source-os: &source-os linux
- x-source-path: &source-path /Users/apple/Desktop/

For window:

- x-source-os: &source-os window
- x-source-path: &source-path C:\Users\Administrator\Desktop

Project support absolute and relative path to source directory

Start dev server:
docker-compose up -d dev

Swagger:
localhost:3000/api
