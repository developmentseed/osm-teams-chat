import { assoc } from 'ramda'

export default async function getMyTeams (accessToken) {
  if (!accessToken) return []
  return fetch('https://mapping.team/api/my/teams', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }).then((response) => response.json())
  .then((data) => {
    if (data) {
      const memberOf = data.member
      const moderatorOf = data.moderator

      const teams = memberOf.map(team => {
        for (let moderatedTeam of moderatorOf) {
          if (moderatedTeam.id === team.id) {
            return assoc('moderator', true, team)
          } 
        }
        return team
      })
      return teams
    } else {
      return [];
    }
  })
}