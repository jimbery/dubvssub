export default async function (
    q: string,
): Promise<GetSearchAnimeOutput | Error> {
    q.toLocaleLowerCase
    const searchQuery = q.replace(/ /g, '&nbsp;')

    try {
        const data = await await fetch(
            `http://localhost:3333/search?q=${searchQuery}`,
        )
        if (!data.ok) {
            throw new Error(JSON.stringify(await data.text()))
        }
        return data.json()
    } catch (err) {
        console.log(err)
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
