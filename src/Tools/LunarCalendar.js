/**
 * @1900-2100区间内的公历、农历互转
 * @charset  UTF-8
 * @Author  Jea杨(JJonline@JJonline.Cn), Justin Lee(justindelladam@live.com)
 * @Time    2014-7-21
 * @Time    2016-8-13 Fixed 2033hex、Attribution Annals
 * @Time    2022-10-21 Migrate to react (Justin Lee)
 * @Version 1.0.2
 * @公历转农历：calendar.solar2lunar(1987,11,01); //[you can ignore params of prefix 0]
 * @农历转公历：calendar.lunar2solar(1987,09,10); //[you can ignore params of prefix 0]
 */
class LunarCalendar {
    /**
     * 农历1900-2100的润大小信息表
     * @Array Of Property
     * @return Hex
     */
    static LUNAR_INFO = [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,//1900-1909
        0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,//1910-1919
        0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,//1920-1929
        0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,//1930-1939
        0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,//1940-1949
        0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,//1950-1959
        0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,//1960-1969
        0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,//1970-1979
        0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,//1980-1989
        0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,//1990-1999
        0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,//2000-2009
        0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,//2010-2019
        0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,//2020-2029
        0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,//2030-2039
        0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,//2040-2049
        /**Add By JJonline@JJonline.Cn**/
        0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,//2050-2059
        0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,//2060-2069
        0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,//2070-2079
        0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,//2080-2089
        0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,//2090-2099
        0x0d520//2100
    ];

    /**
     * 公历每个月份的天数普通表
     * @Array Of Property
     * @return Number
     */
    static SOLAR_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    /**
     * 天干地支之天干速查表
     * @Array Of Property trans["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"]
     * @return CHN String
     */
    static TIAN_GAN = ["\u7532", "\u4e59", "\u4e19", "\u4e01", "\u620a", "\u5df1", "\u5e9a", "\u8f9b", "\u58ec", "\u7678"];

    /**
     * 天干地支之地支速查表
     * @Array Of Property
     * @trans["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"]
     * @return CHN String
     */
    static DI_ZHI = ["\u5b50", "\u4e11", "\u5bc5", "\u536f", "\u8fb0", "\u5df3", "\u5348", "\u672a", "\u7533", "\u9149", "\u620c", "\u4ea5"];

    /**
     * 天干地支之地支速查表<=>生肖
     * @Array Of Property
     * @trans["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"]
     * @return CHN String
     */
    static ZODIAC = ["\u9f20", "\u725b", "\u864e", "\u5154", "\u9f99", "\u86c7", "\u9a6c", "\u7f8a", "\u7334", "\u9e21", "\u72d7", "\u732a"];

    /**
     * 24节气速查表
     * @Array Of Property
     * @trans["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"]
     * @return CHN String
     */
    static SOLAR_TERM = ["\u5c0f\u5bd2", "\u5927\u5bd2", "\u7acb\u6625", "\u96e8\u6c34", "\u60ca\u86f0", "\u6625\u5206", "\u6e05\u660e", "\u8c37\u96e8", "\u7acb\u590f", "\u5c0f\u6ee1", "\u8292\u79cd", "\u590f\u81f3", "\u5c0f\u6691", "\u5927\u6691", "\u7acb\u79cb", "\u5904\u6691", "\u767d\u9732", "\u79cb\u5206", "\u5bd2\u9732", "\u971c\u964d", "\u7acb\u51ac", "\u5c0f\u96ea", "\u5927\u96ea", "\u51ac\u81f3"];

    /**
     * 1900-2100各年的24节气日期速查表
     * @Array Of Property
     * @return 0x string For splice
     */
    static SOLAR_TERM_INFO = ['9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa', '9778397bd19801ec9210c965cc920e', '97b6b97bd19801ec95f8c965cc920f', '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd197c36c9210c9274c91aa', '97b6b97bd19801ec95f8c965cc920e', '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec95f8c965cc920e', '97bcf97c3598082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd097bd07f595b0b6fc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '9778397bd19801ec9210c9274c920e', '97b6b97bd19801ec95f8c965cc920f', '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e', '97b6b97bd19801ec95f8c965cc920f', '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bd07f1487f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c91aa', '97b6b97bd197c36c9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e', '97b6b7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36b0b70c9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c91aa', '97b6b7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '977837f0e37f149b0723b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c35b0b6fc9210c8dc2', '977837f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc9210c8dc2', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0723b06bd', '7f07e7f0e37f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f595b0b0bb0b6fb0722', '7f0e37f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e37f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f149b0723b0787b0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0723b06bd', '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0723b06bd', '7f07e7f0e37f14998083b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14898082b0723b02d5', '7f07e7f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66aa89801e9808297c35', '665f67f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66a449801e9808297c35', '665f67f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e36665b66a449801e9808297c35', '665f67f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e26665b66a449801e9808297c35', '665f67f0e37f1489801eb072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722'];


    /**
     * 数字转中文速查表
     * @Array Of Property
     * @trans ['日','一','二','三','四','五','六','七','八','九','十']
     * @return CHN String
     */
    static NUM_WEEKDAY_2_CHN = ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341"];


    /**
     * 日期转农历称呼速查表
     * @Array Of Property
     * @trans ['初','十','廿','卅']
     * @return CHN String
     */
    static DATE_2_CHN = ["\u521d", "\u5341", "\u5eff", "\u5345"];


    /**
     * 月份转农历称呼速查表
     * @Array Of Property
     * @trans ['正','一','二','三','四','五','六','七','八','九','十','冬','腊']
     * @return CHN String
     */
    static MONTH_2_CHN = ["\u6b63", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341", "\u51ac", "\u814a"];

    /**
     * 返回农历 yyyy 年一整年的总天数
     * @param yyyy Lunar Year
     * @return Number
     * @eg:var count = calendar.lYearDays(1987) ;//count=387
     */
    static countDaysOfLunarYear(yyyy) {
        let sum = 348;
        for (let i = 0x8000; i > 0x8; i >>= 1) {
            sum += (this.LUNAR_INFO[yyyy - 1900] & i) ? 1 : 0;
        }
        return (sum + this.countLeapDaysOfLunarYear(yyyy));
    }

    /**
     * 返回农历 yyyy 年闰月是哪个月；若y年没有闰月 则返回0
     * @param yyyy Lunar Year
     * @return Number (0-12)
     * @eg:var leapMonth = calendar.leapMonth(1987) ;//leapMonth=6
     */
    static leapMonthOfLunarYear(yyyy) { //闰字编码 \u95f0
        return (this.LUNAR_INFO[yyyy - 1900] & 0xf);
    }


    /**
     * 返回农历 yyyy 年闰月的天数 若该年没有闰月则返回0
     * @param yyyy Lunar Year
     * @return Number (0、29、30)
     * @eg:var leapMonthDay = calendar.leapDays(1987) ;//leapMonthDay=29
     */
    static countLeapDaysOfLunarYear(yyyy) {
        if (!this.leapMonthOfLunarYear(yyyy)) {
            return 0;
        }
        return ((this.LUNAR_INFO[yyyy - 1900] & 0x10000) ? 30 : 29);
    }

    /**
     * 返回农历 yyyy 年 mm 月（非闰月）的总天数
     * 计算 mm 为闰月时的天数请使用 countLeapDaysOfLunarYear 方法
     * @param yyyy Lunar Year
     * @param mm Lunar Month
     * @return Number (-1、29、30)
     * @eg:var MonthDay = calendar.monthDays(1987,9) ;//MonthDay=29
     */
    static countLeapDaysOfLunarMonth(yyyy, mm) {
        //月份参数从1至12，参数错误返回-1
        if (mm > 12 || mm < 1) {
            return -1
        }
        return ((this.LUNAR_INFO[yyyy - 1900] & (0x10000 >> mm)) ? 30 : 29);
    }

    /**
     * 返回公历(!)y年m月的天数
     * @param yyyy Lunar Year
     * @param mm Lunar Month
     * @return Number (-1、28、29、30、31)
     * @eg:var solarMonthDay = calendar.leapDays(1987) ;//solarMonthDay=30
     */
    static countSolarDaysOfYearMonth(yyyy, mm) {
        //若参数错误 返回-1
        if (mm > 12 || mm < 1) {
            return -1
        }
        if (mm === 2) {
            //2月份的闰平规律测算后确认返回28或29
            return (((yyyy % 4 === 0) && (yyyy % 100 !== 0) || (yyyy % 400 === 0)) ? 29 : 28);
        } else {
            return (this.SOLAR_MONTH[mm - 1]);
        }
    }

    /**
     * 农历年份转换为干支纪年
     * @param yyyy 农历年的年份数
     * @return CHN String
     */
    static toGanZhiYear(yyyy) {
        let ganKey = (yyyy - 3) % 10;
        let zhiKey = (yyyy - 3) % 12;
        //如果余数为0则为最后一个天干
        if (ganKey === 0) ganKey = 10;
        //如果余数为0则为最后一个地支
        if (zhiKey === 0) zhiKey = 12;
        return this.TIAN_GAN[ganKey - 1] + this.DI_ZHI[zhiKey - 1];
    }

    /**
     * 公历月、日判断所属星座
     * @param mm [description]
     * @param dd [description]
     * @return CHN String
     */
    static toAstro(mm, dd) {
        const s = "\u9b54\u7faf\u6c34\u74f6\u53cc\u9c7c\u767d\u7f8a\u91d1\u725b\u53cc\u5b50\u5de8\u87f9\u72ee\u5b50\u5904\u5973\u5929\u79e4\u5929\u874e\u5c04\u624b\u9b54\u7faf";
        const arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
        //星座
        return s.substring(mm * 2 - (dd < arr[mm - 1] ? 2 : 0), mm * 2 - (dd < arr[mm - 1] ? 2 : 0) + 2) + "\u5ea7";
    }

    /**
     * 传入 offset 偏移量返回干支
     * @param offset 相对甲子的偏移量
     * @return CHN String
     */
    static toGanZhi(offset) {
        return this.TIAN_GAN[offset % 10] + this.DI_ZHI[offset % 12];
    }

    /**
     * 传入公历(!) yyyy 年获得该年第n个节气的公历日期
     * @param yyyy 公历年(1900-2100)；
     * @param n 二十四节气中的第几个节气(1~24)；从n=1(小寒)算起
     * @return day Number
     * @eg:var _24 = calendar.getTerm(1987,3) ;//_24=4;意即1987年2月4日立春
     */
    static getSolarTerm(yyyy, n) {
        if (yyyy < 1900 || yyyy > 2100) {
            return -1;
        }
        if (n < 1 || n > 24) {
            return -1;
        }
        const table = this.SOLAR_TERM_INFO[yyyy - 1900];
        const info = [parseInt('0x' + table.substring(0, 5)).toString(), parseInt('0x' + table.substring(5, 10)).toString(), parseInt('0x' + table.substring(10, 15)).toString(), parseInt('0x' + table.substring(15, 20)).toString(), parseInt('0x' + table.substring(20, 25)).toString(), parseInt('0x' + table.substring(25, 30)).toString()];
        const calDay = [info[0].substring(0, 1), info[0].substring(1, 3), info[0].substring(3, 4), info[0].substring(4, 6),
            info[0].substring(0, 1), info[0].substring(1, 3), info[0].substring(3, 4), info[0].substring(4, 6),
            info[0].substring(0, 1), info[0].substring(1, 3), info[0].substring(3, 4), info[0].substring(4, 6),
            info[0].substring(0, 1), info[0].substring(1, 3), info[0].substring(3, 4), info[0].substring(4, 6),
            info[0].substring(0, 1), info[0].substring(1, 3), info[0].substring(3, 4), info[0].substring(4, 6),
            info[0].substring(0, 1), info[0].substring(1, 3), info[0].substring(3, 4), info[0].substring(4, 6)];
        return parseInt(calDay[n - 1]);
    }

    /**
     * 传入农历数字月份返回汉语通俗表示法
     * @param mm Lunar month
     * @return CHN String
     * @eg:var cnMonth = calendar.toChinaMonth(12) ;//cnMonth='腊月'
     */
    static toChnMonth(mm) {
        //若参数错误 返回-1
        if (mm > 12 || mm < 1) {
            return -1
        }
        let s = this.MONTH_2_CHN[mm - 1];
        //加上月字
        // 月 => \u6708
        s += "\u6708";
        return s;
    }

    /**
     * 传入农历日期数字返回汉字表示法
     * @param dd Lunar day
     * @return CHN String
     * @eg:var cnDay = calendar.toChinaDay(21) ;//cnMonth='廿一'
     */
    static toChnDay(dd) {
        //日 => \u65e5
        switch (dd) {
            case 10:
                return '\u521d\u5341';
            case 20:
                return '\u4e8c\u5341';
            case 30:
                return '\u4e09\u5341';
            default :
                return this.DATE_2_CHN[Math.floor(dd / 10)] + this.NUM_WEEKDAY_2_CHN[dd % 10];
        }
    }

    /**
     * 年份转生肖[!仅能大致转换] => 精确划分生肖分界线是“立春”
     * @param yyyy year
     * @return CHN String
     * @eg:var zodiac = calendar.getAnimal(1997) ;//zodiac='牛'
     */
    static getZodiac(yyyy) {
        return this.ZODIAC[(yyyy - 4) % 12]
    }

    /**
     * 传入公历年月日获得详细的公历、农历object信息 <=>JSON
     * 参数区间1900.1.31~2100.12.31
     * @param yyyy solar year
     * @param mm solar month
     * @param dd solar day
     * @return JSON object
     * @eg:console.log(calendar.solar2lunar(1987,11,01));
     */
    static solarToLunar(yyyy, mm, dd) {
        let dateGiven;
        //年份限定、上限
        if (yyyy < 1900 || yyyy > 2100) {
            return -1;
        }
        //下限
        if (yyyy === 1900 && mm === 1 && dd < 31) {
            return -1;
        }
        //未传参  获得当天
        if (!yyyy) {
            dateGiven = new Date();
        } else {
            dateGiven = new Date(yyyy, parseInt(mm) - 1, dd);
        }
        let i, leap, temp = 0;
        //修正ymd参数
        yyyy = dateGiven.getFullYear();
        mm = dateGiven.getMonth() + 1;
        dd = dateGiven.getDate();
        let offset = (Date.UTC(dateGiven.getFullYear(), dateGiven.getMonth(), dateGiven.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
        for (i = 1900; i < 2101 && offset > 0; i++) {
            temp = this.countDaysOfLunarYear(i);
            offset -= temp;
        }
        if (offset < 0) {
            offset += temp;
            i--;
        }

        //是否今天
        let dateToday = new Date(), isToday = false;
        if (dateToday.getFullYear() === yyyy && dateToday.getMonth() + 1 === mm && dateToday.getDate() === dd) {
            isToday = true;
        }
        //星期几
        let weekNum = dateGiven.getDay(), weekNumChn = this.NUM_WEEKDAY_2_CHN[weekNum];
        if (weekNum === 0) {
            //数字表示周几顺应天朝周一开始的惯例
            weekNum = 7;
        }
        //农历年
        const yyyyLunar = i;

        //闰哪个月
        leap = this.leapMonthOfLunarYear(i);
        let isLeap = false;

        //效验闰月
        for (i = 1; i < 13 && offset > 0; i++) {
            //闰月
            if (leap > 0 && i === (leap + 1) && isLeap === false) {
                --i;
                isLeap = true;
                temp = this.countLeapDaysOfLunarYear(yyyyLunar); //计算农历闰月天数
            } else {
                temp = this.countLeapDaysOfLunarMonth(yyyyLunar, i);//计算农历普通月天数
            }
            //解除闰月
            if (isLeap === true && i === (leap + 1)) {
                isLeap = false;
            }
            offset -= temp;
        }

        if (offset === 0 && leap > 0 && i === leap + 1) if (isLeap) {
            isLeap = false;
        } else {
            isLeap = true;
            --i;
        }
        if (offset < 0) {
            offset += temp;
            --i;
        }
        //农历月
        const mmLunar = i;
        //农历日
        const ddLunar = offset + 1;

        //天干地支处理
        const sm = mm - 1;
        const yyGanZhi = this.toGanZhiYear(yyyyLunar);

        //月柱 1900年1月小寒以前为 丙子月(60进制12)
        //返回当月「节」为几日开始
        const firstNode = this.getSolarTerm(yyyyLunar, (mm * 2 - 1));
        //返回当月「节」为几日开始
        const secondNode = this.getSolarTerm(yyyyLunar, (mm * 2));

        //依据12节气修正干支月
        let mmGanZhi = this.toGanZhi((yyyy - 1900) * 12 + mm + 11);
        if (dd >= firstNode) {
            mmGanZhi = this.toGanZhi((yyyy - 1900) * 12 + mm + 12);
        }

        //传入的日期的节气与否
        let isTerm = false;
        let solarTerm = null;
        if (firstNode === dd) {
            isTerm = true;
            solarTerm = this.SOLAR_TERM[mm * 2 - 2];
        }
        if (secondNode === dd) {
            isTerm = true;
            solarTerm = this.SOLAR_TERM[mm * 2 - 1];
        }
        //日柱 当月一日与 1900/1/1 相差天数
        let dayCyclical = Date.UTC(yyyy, sm, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10;
        let ddGanZhi = this.toGanZhi(dayCyclical + dd - 1);
        //该日期所属的星座
        const astro = this.toAstro(mm, dd);

        return {
            'yyyyLunar': yyyyLunar,
            'mmLunar': mmLunar,
            'ddLunar': ddLunar,
            'zodiac': this.getZodiac(yyyyLunar),
            'mmChn': (isLeap ? "\u95f0" : '') + this.toChnMonth(mmLunar),
            'ddChn': this.toChnDay(ddLunar),
            'yyyy': yyyy,
            'mm': mm,
            'dd': dd,
            'gzYear': yyGanZhi,
            'gzMonth': mmGanZhi,
            'gzDay': ddGanZhi,
            'isToday': isToday,
            'isLeap': isLeap,
            'weekNum': weekNum,
            'weekNumChn': "\u661f\u671f" + weekNumChn,
            'isTerm': isTerm,
            'solarTerm': solarTerm,
            'astro': astro
        };
    }

    /**
     * 农历赚公历
     * 参数区间1900.1.31~2100.12.1
     * @param yyyy  lunar year
     * @param mm lunar month
     * @param dd  lunar day
     * @param isLeapMonth  lunar month is leap or not.
     * @return JSON object
     * @eg:console.log(calendar.lunar2solar(1987,9,10));
     */
    static lunarToSolar(yyyy, mm, dd, isLeapMonth) {
        isLeapMonth = !!isLeapMonth;
        const leapMonth = this.leapMonthOfLunarYear(yyyy);
        //传参要求计算该闰月公历 但该年得出的闰月与传参的月份并不同
        if (isLeapMonth && (leapMonth !== mm)) {
            return -1;
        }
        //超出了最大极限值
        if (yyyy === 2100 && mm === 12 && dd > 1 || yyyy === 1900 && mm === 1 && dd < 31) {
            return -1;
        }
        const day = this.countLeapDaysOfLunarMonth(yyyy, mm);
        let _day = day;
        //bugFix 2016-9-25
        //if month is leap, _day use leapDays method
        if (isLeapMonth) {
            _day = this.countLeapDaysOfLunarYear(yyyy, mm);
        }
        //参数合法性效验
        if (yyyy < 1900 || yyyy > 2100 || dd > _day) {
            return -1;
        }

        //计算农历的时间差
        let offset = 0;
        for (let i = 1900; i < yyyy; i++) {
            offset += this.countDaysOfLunarYear(i);
        }
        let leap = 0, added = false;
        for (let i = 1; i < mm; i++) {
            leap = this.leapMonthOfLunarYear(yyyy);
            //处理闰月
            if (!added) {
                if (leap <= i && leap > 0) {
                    offset += this.countLeapDaysOfLunarYear(yyyy);
                    added = true;
                }
            }
            offset += this.countLeapDaysOfLunarMonth(yyyy, i);
        }
        //转换闰月农历 需补充该年闰月的前一个月的时差
        if (isLeapMonth) {
            offset += day;
        }
        //1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
        const stamp = Date.UTC(1900, 1, 30, 0, 0, 0);
        const offsetDate = new Date((offset + dd - 31) * 86400000 + stamp);
        const yyyyCalc = offsetDate.getUTCFullYear();
        const mmCalc = offsetDate.getUTCMonth() + 1;
        const ddCalc = offsetDate.getUTCDate();

        return {
            'yyyy': yyyyCalc,
            'mm': mmCalc,
            'dd': ddCalc
        };
    }
}

export default LunarCalendar;