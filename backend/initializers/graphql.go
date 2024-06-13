
package initializers 

import (
    "github.com/joho/godotenv"
    "github.com/machinebox/graphql"
    "log"
)

var GraphqlClient *graphql.Client

func InitGraphql() {
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file")
    }
    GraphqlClient = graphql.NewClient("https://api.github.com/graphql")
}
