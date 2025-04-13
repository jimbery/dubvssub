import React, { useState, useEffect } from 'react'
import addVote from '../../routes/AddVote'
import './Vote.css'
import GetAnimeVoteData from '../../routes/GetAnimeVoteData'

interface DubVsSubVoteProps {
    malId: number
}

const DubVsSubVote: React.FC<DubVsSubVoteProps> = ({ malId }) => {
    const [voteType, setVoteType] = useState<'sub' | 'dub' | null>(null)
    const [isVoted, setIsVoted] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [results, setResults] = useState<{ sub: number; dub: number }>({
        sub: 0,
        dub: 0,
    })

    useEffect(() => {
        const fetchVotes = async () => {
            const malID = Number(window.location.pathname.split('/').pop())

            const voteData = await GetAnimeVoteData(malID)
            if (voteData instanceof Error) {
                setResults({ sub: 1, dub: 1 })
                return
            }
            const results = { sub: voteData.SubVote, dub: voteData.DubVote }
            setResults(results)
        }

        fetchVotes()
    }, [malId])

    const handleVote = async () => {
        if (!voteType) {
            setErrorMessage('Please select a vote type')
            return
        }

        try {
            const voteResponse = await addVote(malId, voteType)

            if (voteResponse instanceof Error) {
                setErrorMessage('Error submitting vote')
                console.error(voteResponse)
                return
            }

            setResults((prev) => ({
                ...prev,
                [voteType]: prev[voteType] + 1,
            }))

            setIsVoted(true)
            setErrorMessage('')
        } catch (error) {
            setErrorMessage('Error submitting vote')
            console.error(error)
        }
    }

    const totalVotes = results.sub + results.dub
    const subPercentage = totalVotes ? (results.sub / totalVotes) * 100 : 50
    const dubPercentage = totalVotes ? (results.dub / totalVotes) * 100 : 50

    return (
        <div className="vote-container full-width">
            {errorMessage && (
                <div className="error-message">{errorMessage}</div>
            )}
            <div className="titleBar">
                <h1 className="voteTitle">Vote </h1>
            </div>

            {/* Voting Section */}
            {!isVoted && (
                <>
                    <div className="make-vote">
                        <div className="vote-options">
                            <button
                                onClick={() => setVoteType('sub')}
                                className={`sub ${voteType === 'sub' ? 'selected' : ''}`}
                            >
                                SUB
                            </button>
                            <button
                                onClick={() => setVoteType('dub')}
                                className={`dub ${voteType === 'dub' ? 'selected' : ''}`}
                            >
                                DUB
                            </button>
                        </div>
                        <button onClick={handleVote} className="vote-button">
                            Submit Vote
                        </button>
                    </div>
                </>
            )}

            {/* Results Always Visible */}
            <div className="vote-results">
                <div className="bar-chart">
                    <div
                        className="bar sub-bar"
                        style={{ width: `${subPercentage}%` }}
                    >
                        SUB
                    </div>
                    <div
                        className="bar dub-bar"
                        style={{ width: `${dubPercentage}%` }}
                    >
                        DUB
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DubVsSubVote
