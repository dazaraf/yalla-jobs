export async function getEthosProfile(address: string) {
  try {
    const [scoreRes, vouchRes] = await Promise.all([
      fetch(`https://api.ethos.network/api/v1/score/${address}`),
      fetch(`https://api.ethos.network/api/v1/vouches/${address}`)
    ])

    const scoreData = scoreRes.ok ? await scoreRes.json() : null
    const vouchData = vouchRes.ok ? await vouchRes.json() : null

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
