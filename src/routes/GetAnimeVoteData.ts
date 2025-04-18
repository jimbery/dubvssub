export default async function (malID: number): Promise<AnimeVoteData | Error> {
    const baseUrl = import.meta.env.VITE_BASE_URL

    try {
        const data = await fetch(`${baseUrl}/api/anime-vote-data/${malID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!data.ok) {
            throw new Error(JSON.stringify(await data.text()))
        }

        return await data.json()
    } catch (err) {
        return err as Error
    }
}

export type AnimeVoteData = {
    id: number
    Name: string
    DubVote: number
    SubVote: number
    MalID: number
    CreatedAt: string
    UpdatedAt: string
}
