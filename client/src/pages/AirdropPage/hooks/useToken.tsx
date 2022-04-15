import { Token } from 'src/entities/common.entities'
import { useEffect, useState } from "react"

const useToken = () => {
  const [selectedToken, setSelectedToken] = useState('')
  const [tokens, setTokens] = useState<Token[]>([])
  useEffect(() => {

  }, [])
  return {
    selectedToken,
    tokens,
    setSelectedToken
  }
}

export default useToken