export const CONTRIBUTION_QUERY = `
  query($userName:String!) {
    user(login: $userName) {
      login
      name
      avatarUrl
      bio
      createdAt
      followers { totalCount }
      following { totalCount }
      repositories(first: 10, orderBy: {field: STARGAZERS, direction: DESC}, ownerAffiliations: OWNER) {
        totalCount
        nodes {
          name
          stargazerCount
          forkCount
          primaryLanguage { name color }
          updatedAt
          description
        }
      }
      pullRequests(first: 1) { totalCount }
      issues(first: 1) { totalCount }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        totalIssueContributions
        totalRepositoryContributions
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks {
            firstDay
            contributionDays {
              contributionCount
              date
              color
              weekday
            }
          }
        }
      }
    }
  }
`;

export const VIEWER_QUERY = `
  query {
    viewer {
      login
      name
      avatarUrl
      bio
      createdAt
      followers { totalCount }
      following { totalCount }
      repositories(first: 10, orderBy: {field: STARGAZERS, direction: DESC}, ownerAffiliations: OWNER) {
        totalCount
        nodes {
          name
          stargazerCount
          forkCount
          primaryLanguage { name color }
          updatedAt
          description
        }
      }
      pullRequests(first: 1) { totalCount }
      issues(first: 1) { totalCount }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        totalIssueContributions
        totalRepositoryContributions
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks {
            firstDay
            contributionDays {
              contributionCount
              date
              color
              weekday
            }
          }
        }
      }
    }
  }
`;
