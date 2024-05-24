import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'

import {
  LeaderboardContainer,
  LoadingViewContainer,
  ErrorMessage,
} from './styledComponents'
import LeaderboardTable from '../LeaderboardTable'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Leaderboard = () => {
  const [apiResponse, setApiResponse] = useState({
    status: apiStatusConstants.initial,
    data: null,
    errorMsg: null,
  }) //hooks method used to update status, data and errorMsg and render component

  useEffect(() => {
    const getLeaderboardData = async () => {
      setApiResponse({
        status: apiStatusConstants.inProgress,
        data: null,
        errorMsg: null,
      })

      const url = 'https://apis.ccbp.in/leaderboard'
      const options = {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU',
        },
      }
      const response = await fetch(url, options)
      const responseData = await response.json()
      if (response.ok) {
        const leaderboardData = responseData.leaderboard_data
        const formattedLeaderboardData = leaderboardData.map(eachData => ({
          id: eachData.id,
          language: eachData.language,
          name: eachData.name,
          profileImageUrl: eachData.profile_image_url,
          rank: eachData.rank,
          score: eachData.score,
          timeSpent: eachData.time_spent,
        }))
        setApiResponse(prevState => ({
          ...prevState,
          status: apiStatusConstants.success,
          data: formattedLeaderboardData,
        }))
      } else {
        setApiResponse(prevState => ({
          ...prevState,
          status: apiStatusConstants.failure,
          errorMsg: responseData.error_msg,
        }))
      }
    }

    getLeaderboardData() //using functional call method is advisable in useEffect component for async operations...
  }, []) //[] indicates empty dependency and only one time api call while app opening.

  const renderFailureView = () => {
    const {errorMsg} = apiResponse
    return <ErrorMessage>{errorMsg}</ErrorMessage>
  }

  const renderSuccessView = () => {
    const {data} = apiResponse

    return <LeaderboardTable leaderboardData={data} />
  }

  const renderLoadingView = () => (
    <LoadingViewContainer>
      <Loader type='ThreeDots' color='#ffffff' height='50' width='50' />
    </LoadingViewContainer>
  )

  const renderLeaderboard = () => {
    const {status} = apiResponse

    switch (status) {
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return <LeaderboardContainer>{renderLeaderboard()}</LeaderboardContainer>
}

export default Leaderboard
