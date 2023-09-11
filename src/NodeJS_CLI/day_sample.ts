// Day.jsのサンプル
import dayjs, * as dj from 'dayjs';

// 基本
{
    const date: dj.Dayjs = dayjs("2023-09-11");
    console.log(date);

    const dateStr: string = date.format("YYYY/MM/DD");
    console.log(dateStr);

    const nowDate: dj.Dayjs = dayjs();
    console.log(nowDate);
}