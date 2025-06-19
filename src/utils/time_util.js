function _unix_to_datetime(ts, formatx) {
    if (!/^\d{10}$/.test(ts)) {
        return null;
    }
    if(formatx === undefined || formatx === null) {
        formatx = 'Y-m-d H:i:s';
    }
    let unixTimestamp = new Date(ts * 1000);
    return _date_format(unixTimestamp, formatx);
}

function _time() {
    return Math.round(new Date().getTime() / 1000)
}

function _to_ts(dt) {
    return Math.round(new Date(dt).getTime() / 1000)
}

function _now() {
    return _date_format(new Date())
}

function _today() {
    return new Date(_date_format(new Date(), 'Y-m-d'));
}

function strToday() {
    return _date_format(new Date(), 'Y-m-d');
}

function _date_format(date, format) {
    let Y = date.getFullYear() + '';
    let y = Y.substr(2, 2);
    let m = _add_zero(date.getMonth() + 1);
    let d = _add_zero(date.getDate());

    let hour = date.getHours();
    let H = _add_zero(hour);
    let h = _add_zero(hour > 12 ? hour - 12 : hour);
    let i = _add_zero(date.getMinutes());
    let s = _add_zero(date.getSeconds());

    if (!format) {
        return Y + '-' + m + '-' + d + ' ' + H + ':' + i + ':' + s;
    }
    return format.replace('Y', Y).replace('y', y).replace('m', m).replace('d', d)
        .replace('H', H).replace('h', h).replace('i', i).replace('s', s);
}

function _add_zero(n) {
    return (n > 9 ? '' : '0') + n
}

function _date(str) {
    let d = new Date(str);
    return (_date_format(d)).substr(0, 10);
}

function _day(str) {
    let d = new Date(str);
    return d.getDate();
}

function _hour(str) {
    let d = new Date(str);
    return d.getHours();
}

function _get_weekday(date, cn) {
    let num = date.getDay();
    if (!cn) {
        return num;
    }
    let weekdays = [
        '周日',
        '周一',
        '周二',
        '周三',
        '周四',
        '周五',
        '周六',
    ];
    return weekdays[num];
}

function _date_diff(a, b) {
    let ad = new Date(a);
    let bd = new Date(b);
    let _m_sec = ad - bd;
    let _sec = parseInt(_m_sec / 1000);
    let _minute = parseInt(_sec / 60);
    let _hour = parseInt(_minute / 60);
    let _day = parseInt(_hour / 24);
    return {
        day: _day,
        hour: _hour,
        minute: _minute,
        second: _sec,
        msec: _m_sec
    };
}

function _date_add(date, interval, unit) {
    let start = date.getTime();
    switch (unit) {
        case 0 : {
            return new Date(start + interval * 86400 * 1000)
        }
        case 1 : {
            return new Date(start + interval * 3600 * 1000)
        }
        case 2 : {
            return new Date(start + interval * 60 * 1000)
        }
        case 3 : {
            return new Date(start + interval * 1000)
        }
        default: {
            throw new Error('错误的日期格式');
        }
    }
}

function _convert_dt(dt) {
    if(!dt) {
        return '-';
    }
    let a = new Date();
    let o = _date_diff(a, dt)
    if (o.second < 60) {
        return '小于1分钟'
    }
    if (o.second < 300) {
        return '小于5分钟'
    }
    if (o.second < 600) {
        return '小于10分钟'
    }
    if (o.second < 3600) {
        return '小于1小时'
    }
    if (o.second < 86400) {
        return o.hour + '小时前'
    }
    return o.day + '天前'

}

export default {
    convertDt: _convert_dt,
    add_zero: _add_zero,
    now: _now,
    today: _today,
    strToday: strToday,
    date_format: _date_format,
    date: _date,
    day: _day,
    hour: _hour,
    date_diff: _date_diff,
    time: _time,
    to_ts: _to_ts,
    date_add: _date_add,
    get_weekday: _get_weekday,
    unix_to_datetime: _unix_to_datetime,
    units: {
        day: 0,
        hour: 1,
        minute: 2,
        second: 3,
        month: 4,
        year: 5
    },
    weekdaysCN: [
        '星期天',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
    ],
    weekdaysCN1: [
        '周日',
        '周一',
        '周二',
        '周三',
        '周四',
        '周五',
        '周六',
    ],
    weekdaysCN2: [
        '日曜日',
        '月曜日',
        '火曜日',
        '水曜日',
        '木曜日',
        '金曜日',
        '土曜日',
    ],
};
