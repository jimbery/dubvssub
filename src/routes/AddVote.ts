export default async function (
    malID: number,
    vote: 'sub' | 'dub',
): Promise<AnimeVoteData | Error> {
    const baseUrl = import.meta.env.VITE_BASE_URL

    try {
        const voteData = {
            mal_id: malID,
            vote_type: vote,
        }

        const data = await fetch(`${baseUrl}/api/add-vote`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(voteData),
        })

        if (!data.ok) {
            throw new Error(JSON.stringify(await data.text()))
        }

        return await data.json()
    } catch (err) {
        return err as Error
    }
}

type AnimeVoteData = {
    id: number
    Name: string
    DubVote: number
    SubVote: number
    MalID: number
    CreatedAt: string
    UpdatedAt: string
}
