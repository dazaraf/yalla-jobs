export async function getEthosProfile(address: string) {
  try {
    const [scoreRes, vouchRes] = await Promise.all([
      fetch(`https://api.ethos.network/api/v2/score/address?address=${address}`),
      fetch(`https://api.ethos.network/api/v2/vouches/address?address=${address}`)
    ])

    const scoreData = scoreRes.ok ? await scoreRes.json() : null
    const vouchData = vouchRes.ok ? await vouchRes.json() : null

    console.log('Ethos API response:', { address, scoreData, vouchData })

    return {
      score: scoreData?.score || null,
      vouchers: vouchData?.vouches?.slice(0, 3).map((v: any) => ({
        address: v.voucherAddress,
        name: v.voucherName || `${v.voucherAddress?.slice(0, 6)}...${v.voucherAddress?.slice(-4)}`
      })) || []
    }
  } catch (error) {
    console.error('Ethos fetch error:', error)
    return { score: null, vouchers: [] }
  }
}
