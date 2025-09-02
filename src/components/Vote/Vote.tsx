import React, { useState, useEffect } from 'react'
import addVote from '../../api/add-vote'
import './Vote.css'
import GetAnimeVoteData from '../../api/get-anime-vote-data'

interface DubVsSubVoteProps {
    malId: number
}

interface VoteResults {
    sub: number
    dub: number
}

const DubVsSubVote: React.FC<DubVsSubVoteProps> = ({ malId }) => {
    const [voteType, setVoteType] = useState<'sub' | 'dub' | null>(null)
    const [isVoted, setIsVoted] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [results, setResults] = useState<VoteResults>({ sub: 0, dub: 0 })

    useEffect(() => {
        const fetchVotes = async () => {
            const malID = Number(window.location.pathname.split('/').pop())
            const voteData = await GetAnimeVoteData(malID)

            if (voteData instanceof Error) {
                setResults({ sub: 1, dub: 1 })
                return
            }

            setResults({ sub: voteData.SubVote, dub: voteData.DubVote })
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

            setResults((prev) => ({ ...prev, [voteType]: prev[voteType] + 1 }))
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

    const renderError = () =>
        errorMessage && (
            <div className="error-message" data-testid="errorMessage">
                {errorMessage}
            </div>
        )

    const renderVotingOptions = () => (
        <div className="vote-options" data-testid="voteOptionsContainer">
            <button
                onClick={() => setVoteType('sub')}
                className={`sub ${voteType === 'sub' ? 'selected' : ''}`}
                data-testid="subButton"
            >
                SUB
            </button>
            <button
                onClick={() => setVoteType('dub')}
                className={`dub ${voteType === 'dub' ? 'selected' : ''}`}
                data-testid="dubButton"
            >
                DUB
            </button>
        </div>
    )

    const renderVotingSection = () =>
        !isVoted && (
            <div className="make-vote" data-testid="voteContainer">
                {renderVotingOptions()}
                <button
                    onClick={handleVote}
                    className="vote-button"
                    data-testid="voteButton"
                >
                    Submit Vote
                </button>
            </div>
        )

    const renderResultsBar = () => (
        <div className="bar-chart" data-testid="barChart">
            <div
                className="bar sub-bar"
                style={{ width: `${subPercentage}%` }}
                data-testid="subPercentageBar"
            >
                SUB
            </div>
            <div
                className="bar dub-bar"
                style={{ width: `${dubPercentage}%` }}
                data-testid="dubPercentageBar"
            >
                DUB
            </div>
        </div>
    )

    const renderResultsSection = () => (
        <div className="vote-results" data-testid="voteResults">
            {renderResultsBar()}
        </div>
    )

    return (
        <div className="vote-container full-width">
            {renderError()}

            <div className="titleBar" data-testid="titleBar">
                <h1 className="voteTitle" data-testid="voteTitle">
                    Vote
                </h1>
            </div>

            {renderVotingSection()}
            {renderResultsSection()}
        </div>
    )
}

export default DubVsSubVote
