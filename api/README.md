## Development Configuration
1. Start Postgres with Docker
    ```sh
    docker compose up
    ```
2. Create `fontanelle` database 
    ```sql
    CREATE DATABASE fontanelle;
    ```
3. Start development server
    ```sh
    npx nodemon --exec go run main.go --signal SIGTERM
    ```