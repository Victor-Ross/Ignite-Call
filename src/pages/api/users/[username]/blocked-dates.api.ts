import { prisma } from '@/src/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const username = String(req.query.username);
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ message: 'Year or month not specified' });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(400).json({ message: 'User does not exist' });
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  });

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !availableWeekDays.some(
      (availableWeekDay) => availableWeekDay.week_day === weekDay
    );
  });

  const convertMonth = month.length === 1 ? `0${month}` : month;

  const blockedDatesRaw = await prisma.$queryRaw<Array<{ date: number }>>`
    select 
      extract(day from s.date) as date,
      count(s.date) as amount,
      ((uti.time_end_in_minutes - uti.time_start_in_minutes) / 60) as size
    from 
      schedulings s
    left join
      user_time_intervals uti
    on
      uti.week_day = weekday(date_add(s.date, interval 1 day))
    where
      s.user_id = ${user.id}
      and date_format(s.date, '%Y-%m') = ${`${year}-${convertMonth}`}
    group by
      extract(day from s.date),
      ((uti.time_end_in_minutes - uti.time_start_in_minutes) / 60)
    having
      amount >= size
  `;

  const blockedDates = blockedDatesRaw.map((item) => item.date);

  return res.json({ blockedWeekDays, blockedDates });
}
