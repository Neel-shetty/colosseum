package functions

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/Neel-shetty/go-fiber-server/initializers"
	"github.com/gofiber/fiber/v2"
	"github.com/machinebox/graphql"
)

type Stats struct {
	Name                  string `json:"name"`
	TotalPRs              int    `json:"totalPRs"`
	TotalPRsMerged        int    `json:"totalPRsMerged"`
	MergedPRsPercentage   float64 `json:"mergedPRsPercentage"`
	TotalReviews          int    `json:"totalReviews"`
	TotalCommits          int    `json:"totalCommits"`
	TotalIssues           int    `json:"totalIssues"`
	TotalStars            int    `json:"totalStars"`
	TotalDiscussionsStarted int  `json:"totalDiscussionsStarted"`
	TotalDiscussionsAnswered int `json:"totalDiscussionsAnswered"`
	ContributedTo         int    `json:"contributedTo"`
	Rank                  Rank   `json:"rank"`
}

type Rank struct {
	Level      string  `json:"level"`
	Percentile float64 `json:"percentile"`
}

// func fetchUserRepositories(username, token, after string) (map[string]interface{}, error) {
// 	query := fmt.Sprintf(`
// 	query {
// 		user(login: "%s") {
// 			repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}, after: %s) {
// 				totalCount
// 				nodes {
// 					name
// 					stargazers {
// 						totalCount
// 					}
// 				}
// 				pageInfo {
// 					hasNextPage
// 					endCursor
// 				}
// 			}
// 		}
// 	}`, username, after)

// 	req := graphql.NewRequest(query)
// 	req.Header.Set("Authorization", "Bearer "+token)

// 	var resp map[string]interface{}
// 	err := initializers.GraphqlClient.Run(context.Background(), req, &resp)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return resp, nil
// }

// func FetchUserStats(username, token string, includeMergedPullRequests, includeDiscussions, includeDiscussionsAnswers bool) (map[string]interface{}, error) {
// 	query := fmt.Sprintf(`
// 	query {
// 		user(login: "%s") {
// 			name
// 			login
// 			contributionsCollection {
// 				totalCommitContributions
// 				totalPullRequestReviewContributions
// 			}
// 			repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
// 				totalCount
// 			}
// 			pullRequests(first: 1) {
// 				totalCount
// 			}
// 			mergedPullRequests: pullRequests(states: MERGED) @include(if: %t) {
// 				totalCount
// 			}
// 			openIssues: issues(states: OPEN) {
// 				totalCount
// 			}
// 			closedIssues: issues(states: CLOSED) {
// 				totalCount
// 			}
// 			followers {
// 				totalCount
// 			}
// 			repositoryDiscussions @include(if: %t) {
// 				totalCount
// 			}
// 			repositoryDiscussionComments(onlyAnswers: true) @include(if: %t) {
// 				totalCount
// 			}
// 		}
// 	}`, username, includeMergedPullRequests, includeDiscussions, includeDiscussionsAnswers)

// 	req := graphql.NewRequest(query)
// 	req.Header.Set("Authorization", "Bearer "+token)

// 	var resp map[string]interface{}
// 	err := initializers.GraphqlClient.Run(context.Background(), req, &resp)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return resp, nil

// }

func fetchUserRepositories(username, token, after string) (map[string]interface{}, error) {
	query := fmt.Sprintf(`
	query {
		user(login: "%s") {
			repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}, after: %s) {
				totalCount
				nodes {
					name
					stargazers {
						totalCount
					}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}
	}`, username, after)

	req := graphql.NewRequest(query)
	req.Header.Set("Authorization", "Bearer "+token)

	var resp map[string]interface{}
	err := initializers.GraphqlClient.Run(context.Background(), req, &resp)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func FetchUserStats(username, token, after string, includeMergedPullRequests, includeDiscussions, includeDiscussionsAnswers bool) (map[string]interface{}, error) {
	query := fmt.Sprintf(`
	query {
		user(login: "%s") {
			name
			login
			contributionsCollection {
				totalCommitContributions
				totalPullRequestReviewContributions
			}
			repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
				totalCount
			}
			pullRequests(first: 1) {
				totalCount
			}
			mergedPullRequests: pullRequests(states: MERGED) @include(if: %t) {
				totalCount
			}
			openIssues: issues(states: OPEN) {
				totalCount
			}
			closedIssues: issues(states: CLOSED) {
				totalCount
			}
			followers {
				totalCount
			}
			repositoryDiscussions @include(if: %t) {
				totalCount
			}
			repositoryDiscussionComments(onlyAnswers: true) @include(if: %t) {
				totalCount
			}
			repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}, after: %s) {
				totalCount
				nodes {
					name
					stargazers {
						totalCount
					}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}
	}`, username, includeMergedPullRequests, includeDiscussions, includeDiscussionsAnswers, after)

	req := graphql.NewRequest(query)
	req.Header.Set("Authorization", "Bearer "+token)

	var resp map[string]interface{}
	err := initializers.GraphqlClient.Run(context.Background(), req, &resp)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func statsFetcher(username, token string, includeMergedPullRequests, includeDiscussions, includeDiscussionsAnswers bool) (map[string]interface{}, error) {
	var stats map[string]interface{}
	var hasNextPage = true
	var endCursor = "null"

	_, _, _ = includeDiscussions, includeDiscussionsAnswers, includeMergedPullRequests

	for hasNextPage {
		res, err := fetchUserRepositories(username, token, endCursor)
		if err != nil {
			return nil, err
		}

		fmt.Println(res)
		if res["data"] == nil {
			return nil, fmt.Errorf("data field is nil in the response")
		}

		userData, ok := res["data"].(map[string]interface{})["user"].(map[string]interface{})
		if !ok {
			return nil, fmt.Errorf("failed to convert user data")
		}

		if stats == nil {
			stats = res
		} else {
			repoNodes := userData["repositories"].(map[string]interface{})["nodes"].([]interface{})
			for _, node := range repoNodes {
				stats["data"].(map[string]interface{})["user"].(map[string]interface{})["repositories"].(map[string]interface{})["nodes"] = append(stats["data"].(map[string]interface{})["user"].(map[string]interface{})["repositories"].(map[string]interface{})["nodes"].([]interface{}), node)
			}
		}

		pageInfo := userData["repositories"].(map[string]interface{})["pageInfo"].(map[string]interface{})
		hasNextPage, ok = pageInfo["hasNextPage"].(bool)
		if !ok {
			return nil, fmt.Errorf("failed to convert hasNextPage")
		}
		endCursor = fmt.Sprintf(`"%s"`, pageInfo["endCursor"].(string))
	}

	return stats, nil
}


// func statsFetcher(username, token string) (map[string]interface{}, error) {
// 	var stats map[string]interface{}
// 	var hasNextPage = true
// 	var endCursor = "null"

// 	for hasNextPage {
// 		res, err := fetchUserRepositories(username, token, endCursor)
// 		if err != nil {
// 			return nil, err
// 		}

// 		if stats == nil {
// 			stats = res
// 		} else {
// 			repoNodes := res["data"].(map[string]interface{})["user"].(map[string]interface{})["repositories"].(map[string]interface{})["nodes"].([]interface{})
// 			for _, node := range repoNodes {
// 				stats["data"].(map[string]interface{})["user"].(map[string]interface{})["repositories"].(map[string]interface{})["nodes"] = append(stats["data"].(map[string]interface{})["user"].(map[string]interface{})["repositories"].(map[string]interface{})["nodes"].([]interface{}), node)
// 			}
// 		}

// 		pageInfo := res["data"].(map[string]interface{})["user"].(map[string]interface{})["repositories"].(map[string]interface{})["pageInfo"].(map[string]interface{})
// 		hasNextPage = pageInfo["hasNextPage"].(bool)
// 		endCursor = fmt.Sprintf(`"%s"`, pageInfo["endCursor"].(string))
// 	}

// 	return stats, nil
// }

func totalCommitsFetcher(username, token string) (int, error) {
	url := fmt.Sprintf("https://api.github.com/search/commits?q=author:%s", username)

	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return 0, err
	}
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Accept", "application/vnd.github.cloak-preview")

	resp, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return 0, err
	}

	totalCount := int(result["total_count"].(float64))
	return totalCount, nil
}

func FetchStats(c *fiber.Ctx) error {
	username := c.Params("username")
	if username == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Username is required",
		})
	}

	token := os.Getenv("GITHUB_TOKEN")
	includeAllCommits := c.Query("include_all_commits") == "true"
	excludeRepo := strings.Split(c.Query("exclude_repo"), ",")
	includeMergedPullRequests := c.Query("include_merged_pull_requests") == "true"
	includeDiscussions := c.Query("include_discussions") == "true"
	includeDiscussionsAnswers := c.Query("include_discussions_answers") == "true"

	var stats Stats

	res, err := statsFetcher(username, token,includeMergedPullRequests, includeDiscussions, includeDiscussionsAnswers)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	user := res["data"].(map[string]interface{})["user"].(map[string]interface{})

	stats.Name = user["name"].(string)

	if includeAllCommits {
		stats.TotalCommits, err = totalCommitsFetcher(username, token)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
	} else {
		stats.TotalCommits = int(user["contributionsCollection"].(map[string]interface{})["totalCommitContributions"].(float64))
	}

	stats.TotalPRs = int(user["pullRequests"].(map[string]interface{})["totalCount"].(float64))
	if includeMergedPullRequests {
		stats.TotalPRsMerged = int(user["mergedPullRequests"].(map[string]interface{})["totalCount"].(float64))
		stats.MergedPRsPercentage = (float64(stats.TotalPRsMerged) / float64(stats.TotalPRs)) * 100
	}

	stats.TotalReviews = int(user["contributionsCollection"].(map[string]interface{})["totalPullRequestReviewContributions"].(float64))
	stats.TotalIssues = int(user["openIssues"].(map[string]interface{})["totalCount"].(float64)) + int(user["closedIssues"].(map[string]interface{})["totalCount"].(float64))

	if includeDiscussions {
		stats.TotalDiscussionsStarted = int(user["repositoryDiscussions"].(map[string]interface{})["totalCount"].(float64))
	}

	if includeDiscussionsAnswers {
		stats.TotalDiscussionsAnswered = int(user["repositoryDiscussionComments"].(map[string]interface{})["totalCount"].(float64))
	}

	stats.ContributedTo = int(user["repositoriesContributedTo"].(map[string]interface{})["totalCount"].(float64))

	repoNodes := user["repositories"].(map[string]interface{})["nodes"].([]interface{})
	for _, repo := range repoNodes {
		repoData := repo.(map[string]interface{})
		if !contains(excludeRepo, repoData["name"].(string)) {
			stats.TotalStars += int(repoData["stargazers"].(map[string]interface{})["totalCount"].(float64))
		}
	}

	// Assuming a calculateRank function that returns a Rank struct
	stats.Rank = calculateRank()

	return c.JSON(stats)
}

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}

// Placeholder function for calculateRank
func calculateRank() Rank {
	// Dummy implementation
	return Rank{
		Level:      "C",
		Percentile: 100,
	}
}
