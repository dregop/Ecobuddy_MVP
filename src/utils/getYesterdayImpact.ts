export const getYesterdayImpact = async (userId: string): Promise<number | undefined> => {
  try {
    const response = await fetch(`${process.env.API_URL}/daily-impact/${userId}/yesterday`);
    const data = await response.json();
    return data?.dailyImpact;
  } catch (error) {
    console.error('[getYesterdayImpact] Failed:', error);
    return undefined;
  }
};
