export default async function (
    q: string,
): Promise<GetSearchAnimeOutput | Error> {
    const baseUrl = process.env.REACT_APP_BASE_URL

    q.toLocaleLowerCase
    const searchQuery = q.replace(/ /g, '&nbsp;')

    try {
        const data = await fetch(`${baseUrl}/api/search?q=${searchQuery}`)
        if (!data.ok) {
            throw new Error(JSON.stringify(await data.text()))
        }
        return data.json()
    } catch (err) {
        return err as Error
    }
}

export type GetSearchAnimeOutput = {
    Pagination: {
        Count: number
        Total: number
    }
    Data: {
        Title: string
        Synopsis: string
        MalID: number
        Image: string
    }[]
}
