export const CONTRIBUTION_QUERY = `
  query($userName:String!) {
    user(login: $userName) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            firstDay
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
`;
