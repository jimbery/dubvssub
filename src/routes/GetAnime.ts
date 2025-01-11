export default async function (id: number): Promise<GetAnimeOutput | Error> {
    const baseUrl = process.env.REACT_APP_BASE_URL

    console.log(baseUrl)
    try {
        const data = await fetch(`${baseUrl}/anime/${id}`)
        if (!data.ok) {
            throw new Error(JSON.stringify(await data.text()))
        }
        return await data.json()
    } catch (err) {
        return err as Error
    }
}

export type GetAnimeOutput = {
    Title: string
    Synopsis: string
    MalID: number
    Image: string
    Year: number
    Episodes: number
    Rating: string
    Trailer: string
    Genres: {
        Name: string
    }[]
    Streaming: {
        Name: string
        URL: string
    }[]
}
