export default async function (
    q: string,
): Promise<GetSearchAnimeOutput | Error> {
    const baseUrl = import.meta.env.VITE_BASE_URL

    const searchQuery = q.toLocaleLowerCase().replace(/ /g, '&nbsp;')

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
