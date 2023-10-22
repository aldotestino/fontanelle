## Development Configuration
1. Start Postgres with Docker
    ```sh
    docker compose up db
    ```
2. Start development server
    ```sh
    npx nodemon --exec go run main.go --signal SIGTERM
    ```