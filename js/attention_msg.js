/* 重点关注 */
var Type = [{
    typeName: "剩余电流",
    type: "ResidualAmmeter"
}, {
    typeName: "温度",
    type: "EM_Temp"
}, {
    typeName: "湿度",
    type: "EM_Hum"
}, {
    typeName: "烟感",
    type: "AZ_Smoke"
}, {
    typeName: "剩余电量",
    type: "AmpereMeter"
}, {
    typeName: "断路器",
    type: "PowerRelease"
}]

var attentionBoxList = [];
var chanDetail_datalist_gridContent = []; //表格属性
var chanDetailCondition = {};
$(function () {
    createAttention();
    $("#rightWrap .attention").on("click", "li", function () {
        $("#attentionDetials").empty();
        var data = $(this).data("data");
        if (data) {
            $("#alarmDetails").data("data", data);
        }

    });
});


function getAlarmType(td, data) {
    if (data.reportType == '1') {
        $(td).text("预警");
    } else if (data.reportType == '2') {
        $(td).text("报警");
    } else if (data.reportType == '3') {
        $(td).text("部分离线");
    } else {
        $(td).text("全部离线");
    }
}

function getChanName(td, data) {
    if ($("#alarmDetails").data("data").reportType == '4') {
        $(td).text("全部离线");
    } else {
        var text = "";
        $.each(data.chanList, function () {
            text += this.chanName + ","
        });
        $(td).text(text);
    }
}

function getOperate(td, data) {
    $(td).empty();
    $location = $('<a/>', {
        'class': 'submit',
        'style': 'padding:0 5px;cursor:pointer'
    }).text('定位');

    $location.click(function () {
        openWindow(data);
        //  createBoxWindow(data);
    });
    $(td).append($location);
}

function openWindow(data) {
    var allOverlay = map.getOverlays();
    var flag = {
        "inShowList": false, //界面显示的中是否有选择的点位标识
        "inPointList": false, //界面所有点中是否有选择的点位标识
    }
    $.each(showPointList, function () {
        if (this.realId == data.boxId) {
            //当前视图存在选择的配电箱,直接打开窗口
            $('#alarmDetails').modal("hide");
            createBoxWindow(this);
            flag.inShowList = true;
            return false;
        }
    });
    if (!flag.inShowList) {
        //选择的配电箱不在当前showList中,遍历所有的点将这个配电箱找出
        $.each(pointList, function () {
            if (this.pointType == 1) {
                if (this.realId == data.boxId) {
                    flag.inPointList = true;
                    var point = this;
                    $('#alarmDetails').modal("hide");
                    map.setZoom(point.scaleUpperlimit);
                    map.setCenter(new BMap.Point(point.lo, point.la));
                    setTimeout(function () {
                        drawPoint([point]);
                        createBoxWindow(point);
                    }, 200);
                    return false;
                }
            }
        });
    }
    if (!flag.inShowList && !flag.inPointList) {
        //选择的配电箱未配置点位
        alert("您选择的配电箱未配置点位，定位失败！");
    }
}

function queryDetails() {
    $('#attentionDetials').doQuery(null, chanDetailCondition);
}

function getdetailCondition(data) {
    var con = {};
    con.userToken = userToken;
    con.attentionType = data.attentionType;
    con.reportType = data.reportType;

    return con;
}

function createAttention() {

    var type = [{
        typeName: "剩余电流报警通道：",
        reportType: "2",
        attentionType: "ResidualAmmeter"
    }, {
        typeName: "剩余电流预警通道：",
        reportType: "1",
        attentionType: "ResidualAmmeter"
    }, {
        typeName: "温度报警通道：",
        reportType: "2",
        attentionType: "EM_Temp"
    }, {
        typeName: "温度预警通道：",
        reportType: "1",
        attentionType: "EM_Temp"
    }, {
        typeName: "烟感报警通道：",
        reportType: "2",
        attentionType: "AZ_Smoke"
    }, {
        typeName: "总线通讯异常配电箱：",
        reportType: "4",
        attentionType: "offLineStaus"
    }, {
        typeName: "网络通讯异常配电箱：",
        reportType: "3",
        attentionType: "partialOffLineStaus"
    }]
    $.each(type, function () {
        //先创建5个列表
        var chanAlarm = this;
        var li = $("<li>").addClass("status").attr("id", this.attentionType + this.reportType);
        var text = $("<span>").text(this.typeName);
        var msg = $("<span>").text('0个').addClass('count');
        var btn = $("<span>").text("查询").css({
            'float': 'right',
            'margin-right': '70px',
            "font-weight": "none"
        });
        li.append(text).append(msg).append(btn);
        $(".attention .content ul").append(li);
        updateAttentionMsg(chanAlarm);
        setInterval(function () {
            //每五分钟刷新一次
            updateAttentionMsg(chanAlarm);
        }, 50000)

    });

}

function updateAttentionMsg(chanAlarm) {
         var data = Data.chanAlarmCount
        if (data.code == 0) {
            var chanAlarmCount = data.result.objs;
            $.each(chanAlarmCount, function () {
                //根据类型和报警字段匹配
                var alarmCount = this;
                if (chanAlarm.attentionType == alarmCount.attentionType) {
                    var _li = $("#" + alarmCount.attentionType + alarmCount.reportType).data("data", alarmCount);
                    var count = $("#" + alarmCount.attentionType + alarmCount.reportType + " .count");
                    if (alarmCount.reportType == 2) {
                        //报警
                        count.text(alarmCount.reportCount + '个').addClass("alarm");
                    } else if (alarmCount.reportType == 1) {
                        //预警
                        count.text(alarmCount.reportCount + '个').addClass("notice");
                    } else {
                        count.text(alarmCount.reportCount + '个');
                    }
                }
            });
        }
}
