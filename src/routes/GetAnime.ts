export default async function (
    id: number,
): Promise<GetSearchAnimeOutput | Error> {
    try {
        const data = await fetch(`http://localhost:3333/anime/${id}`)
        if (!data.ok) {
            throw new Error(JSON.stringify(await data.text()))
        }
        return data.json()
    } catch (err) {
        return err as Error
    }
}

export type GetSearchAnimeOutput = {
    Title: string
    Synopsis: string
    MalID: number
    Image: string
}
