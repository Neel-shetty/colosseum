# Use the latest Golang image
FROM golang:1.22.3-alpine3.19

# Set the working directory inside the container
WORKDIR /app

# Copy the Go module definition files to the working directory
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy all source files to the working directory
COPY . .

# Build the Go application
RUN go build -o /go-docker-demo

# Expose port 8080
EXPOSE 8080

# Command to run the executable
CMD ["/go-docker-demo"]

