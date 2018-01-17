/* 统计信息 */
var myChart
$(function () {
    //.height($('.history').height() - 78);
    myChart = echarts.init(document.getElementById('myChart'));
    doDrawDay();

    $(".dataTitle").on('click', function () {
        $(".dataTitle").removeClass("active");
        $(this).addClass("active");

        doDrawDay($(this).text());
    });

    //每五分钟刷新一次
    setInterval(function () {
        $(".dataTitle").removeClass("active");
        $(".dataTitle.today").addClass("active");
        doDrawDay();
    }, 300000)
})

function getCondition() {

    var condition = {};
    var date = new Date;
    condition.time = parseInt(date.getTime() / 1000);
    condition.userToken = userToken;
    return condition;
}

function doDrawDay(text) {
    //$("#myChart").empty();
    var xAxisDataAry = [];
    var yDataAlarm = [];
    var yDataNotice = [];
    var _text = text || "今日";
    var action = _text == "最近七日" ? 11 : 10;
    var data = Data.historyList;
        if (data.code == 0) {
            var stateList = data.result.objs;
            $.each(stateList, function () {
                if (this.method == 10) {
                    xAxisData = setxData(_text, this);
                    yDataNotice.push({
                        value: [xAxisData, this.count]
                    });
                    xAxisDataAry.push(xAxisData);
                } else {
                    yDataAlarm.push(this.count);
                }

            });
            generateCurve(xAxisDataAry, yDataAlarm, yDataNotice);
        } else {
            alert('error code:' + data.code);
        }

}

function renderTime(iTime) {
    var d = new Date(iTime * 1000).toString("HH:mm:ss");
    var s = "";
    if (d.indexOf('NaN') > -1) {
        s = "-";
    } else {
        s = d;
    }
    return s;
    //return iTime != "" ? new Date(iTime*1000).toString("yyyy-MM-dd HH:mm:ss"):"--";
}

function generateCurve(xAxisDataAry, yData1, yData2) {

    option = {
        baseOption: {

            legend: {
                data: ['报警', '预警'],
                textStyle: {
                    color: "#fff"
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxisDataAry,
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            },
            yAxis: { //纵坐标设置
                type: 'value',
                axisLabel: {
                    formatter: '{value} 条'
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            },
            grid: {
                x: '20%',
                backgroundColor: 'rgba(255,127,255,0.5)'
            },
            series: [{
                name: '报警',
                type: 'line',

                data: yData1,
                markPoint: {
                    data: [{
                        type: 'max',
                        name: '最大值'
                    }, {
                        type: 'min',
                        name: '最小值'
                    }]
                },

                itemStyle: {
                    normal: {
                        color: '#e3771e',
                        label: {
                            show: false,
                            formatter: '{b}：{c}',
                            position: 'top',
                            textStyle: {
                                fontWeight: '700',
                                fontSize: '12',
                                color: '#f5bf58'
                            }
                        },
                        lineStyle: {
                            color: '#ff2929',
                            type: 'solid',
                            width: 1
                        }
                    }
                }
            },
            {
                name: '预警',
                type: 'line',
                data: yData2,
                markPoint: {
                    data: [{
                        type: 'max',
                        name: '最大值'
                    }, {
                        type: 'min',
                        name: '最小值'
                    }]
                },
                itemStyle: {
                    normal: {
                        color: '#e3771e',
                        label: {
                            show: false,
                            formatter: '{b}：{c}',
                            position: 'top',
                            textStyle: {
                                fontWeight: '700',
                                fontSize: '12',
                                color: '#f5bf58'
                            }
                        },
                        lineStyle: {
                            color: '#e69c29',
                            type: 'solid',
                            width: 1
                        }
                    }
                }
            }
            ]
        }

    };


    myChart.showLoading({
        'text': '正在加载……'
    });
    myChart.setOption(option);
    myChart.hideLoading();
}

function setxData(text, data) {
    var xAxisData;
    if (text == "今日") {
        xAxisData = data.hour + "时";
    } else {
        xAxisData = data.month + "/" + data.day;
    }
    return xAxisData;
}