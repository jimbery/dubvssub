export default async function (
    q: string,
): Promise<GetSearchAnimeOutput | Error> {
    q.toLocaleLowerCase
    const searchQuery = q.replace(/ /g, '&nbsp;')

    try {
        const data = await (
            await fetch(`http://localhost:3333/search?q=${searchQuery}`)
        ).json()
        return data
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
