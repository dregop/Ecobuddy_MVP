export const calculateStreakDays = async (userId: string): Promise<number> => {
  try {
    const response = await fetch(`${process.env.API_URL}/daily-impact/${userId}`);
    const impacts = await response.json(); // tableau trié par date descendante
    const today = new Date().toISOString().slice(0, 10);
    let streak = 0;

    for (const { date } of impacts) {
      const impactDate = new Date(date).toISOString().slice(0, 10);
      if (impactDate === today || isYesterday(impactDate, streak)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  } catch (e) {
    console.error('[calculateStreakDays] Error:', e);
    return 0;
  }
};

const isYesterday = (dateString: string, offset: number): boolean => {
  const today = new Date();
  const expected = new Date(today);
  expected.setDate(today.getDate() - offset);
  return dateString === expected.toISOString().slice(0, 10);
};
