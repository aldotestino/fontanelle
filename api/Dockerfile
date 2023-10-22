# Use an official Golang runtime as a parent image
FROM golang as build

# Set the working directory in the container
WORKDIR /usr/app/api

# Copy the local package files to the container's workspace
COPY go.mod .
COPY go.sum .

# Download and install Go dependencies
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the Go application
RUN go build -o main .

# Create a final minimal image to run the application
FROM golang
WORKDIR /usr/app/api

# Copy only the binary from the previous build image
COPY --from=build /usr/app/api/main .

# Set the environment variable to release
ENV GIN_MODE=release

# Define the command to run your application
CMD ["./main"]
