$(function () {
});
var color = ["#888", /*"#549ee2"*/ "#4bd71a", "#ffc268", "#ff4800"];
//点击虚拟组点位 
function createVirtualWindow(virtualPoint) {
    var content = "";
    var div = $("<div>");
    var ul = $("<ul>").attr("id", "windowContent").addClass("inner-container");
    var con = {};
    var v_status = "";
    
        alert("该项目未配置虚拟组！")
        return false;
    
    $.each(localVirtualStatusList, function () {
        if (this.virtualGroupId == virtualPoint.realId) {
            //this.reportStatus = boxMethod;
            v_status = this.reportStatus;
            return false;
        }
    });
    //虚拟组查配电箱列表接口
    //jAjax.query(13, 0, 0, con, function (data, status) {
         var data = Data.virtualGroupList;
        if (data.code == 0) {
            var virtualGroupList = data.result.objs;
            $.each(virtualGroupList, function () {
                var boxlist = this.boxList;
                $.each(boxlist, function (index) {
                    var box = this;
                    var li = $("<li>").attr("id", "box_" + this.boxId).data({
                        "box": this
                    });
                    var img = $("<img>").attr({ "src": "image/box0.png", "id": "img_" + this.boxSn });
                    var textDiv = $("<div>").addClass("text");
                    var spanTitle = $("<a>").text(this.boxName).css({
                        'overflow': 'hidden',
                        'text-overflow': 'ellipsis',
                        'white-space': 'nowrap',
                        'width': '65%',
                        'display': ' inline-block',
                        "cursor": "pointer",
                        "color": "#549ee2"
                    }).attr("title", this.boxName).addClass("boxName").attr("id", this.boxId);
                    textDiv.append(spanTitle).append("<span>");
                    li.append(img).append(textDiv);
                    ul.append(li);

                });

                opts.title = con.virtualGroupName;
                var info = $("<div>").addClass("page");
                var project = $("<span>").text(this.projectName);
                var text;
                var status = $("<span>");
                switch (v_status) {
                    case '01':
                        text = "正常";
                        status.css("color", color[1]);
                        break;
                    case '00':
                        text = "离线";
                        status.css("color", color[0]);
                        break;
                    case '10':
                        text = "预警";
                        status.css("color", color[2]);
                        break;
                    case '11':
                        text = "报警";
                        status.css("color", color[3]);
                        break;
                }
                status.text(text);
                info.append(project).append(status);
                div.append(ul).append(info) //.append(page);
                content = div.html();
                var infoWindow = new BMap.InfoWindow(content, opts, {
                    enableAutoPan: true
                });
                map.openInfoWindow(infoWindow, virtualPoint.point); //开启信息窗口
                setTimeout(function () {
                    //更新虚拟组和配电箱状态，定位点击事件
                    //设置定时器将其加入代码执行队列，保证窗口打开后再执行
                    upDateVirtualWindow(boxlist);
                    $("#windowContent").on("click", ".boxName", function () {
                        var boxId = $(this).attr("id");
                        var hasBoxFlag = false;
                        $.each(pointList, function () {
                            var point = this;
                            if (point.pointType == 1) {
                                if (point.realId == boxId) {
                                    hasBoxFlag = true;
                                    map.closeInfoWindow();
                                    map.setZoom(point.scaleLowerlimit);
                                    map.setCenter(new BMap.Point(point.lo, point.la));
                                    //嵌套setTimeout能保证代码执行顺序，先执行外层
                                    setTimeout(function () {
                                        drawPoint([point]);
                                        createBoxWindow(point);
                                    }, 50);
                                    return false;
                                }
                            }
                        });
                        if (!hasBoxFlag) {
                            alert("该配电箱还未配置点位");
                        }
                    });
                }, 0);
                mask(0);
            });

        }

}

function upDateVirtualWindow(boxList) {
    //更新每一个配电箱的状态
    $.each(boxList, function () {
        var box = this;
        $.each(localBoxStatusList, function () {
            if (this.sn == box.boxSn) {
                var li = $("#" + this.id);
                var img = $("#img_" + this.sn);
                var cs = pad(this.cs.toString(2), 32);
                var sibt = [];
                for (var i = cs.length / 2 - 1; i >= 0; i--) {
                    var j = 2;
                    var v2 = cs.substr(i * j, 2);
                    sibt.push(v2);
                };
                var AlarmFlag = 0;
                var NoticeFlag = 0;

                if (sibt[0] == "00" || sibt[0] == "11") {
                    //离线状态
                    li.css("color", color[0]);
                } else {
                    for (var i = 0; i < sibt.length; i++) {
                        if (i > 3 && i < 9 && i != 5) {
                            if (sibt[i] == 11) {
                                AlarmFlag = 1;
                            } else if (sibt[i] == 10) {
                                NoticeFlag == 1;
                            }
                            if (AlarmFlag) {
                                //配电箱报警
                                img.attr({ "src": "image/box3.png" });
                                li.css("color", color[3]);
                            } else if (NoticeFlag && !AlarmFlag) {
                                //配电箱预警
                                img.attr({ "src": "image/box2.png" });
                                li.css("color", color[2]);
                            } else {
                                //配电箱正常
                                img.attr({ "src": "image/box1.png" });
                                li.css("color", color[1]);
                            }
                        }
                    }
                }
            }

        });
    });
}

function createBoxWindow(box) {
    var content = "";
    var div = $("<div>").attr("id", 'windowDiv');
    var ul = $("<ul>").attr("id", "windowContent").addClass("inner-container");
    var con = {};
    var boxName = box.pointName || box.boxName;
    var boxId = box.realId || box.boxId;
          var data = Data.chanstatus;
        if (data.code == 0) {
            var chanstatus = data.result.sub;

            $.each(chanstatus, function () {
                var li = $("<li>");
                if (this.type) {
                    var img = $("<img>").attr("src", "image/" + this.type + "_00.png").css({ "width": "30px" });//默认离线图标
                    var textDiv = $("<div>").addClass("text");
                    var spanTitle = $("<span>").text(this.cn);
                    var spanValue = $("<span>").text("--");
                    var spanState = $("<span>").text("离线");
                    var text = '';
                    var state = this.s;
                    var b = pad(state.toString(2), 32);
                    var sbit0 = b.substr(b.length - 1, 1);
                    var sbit1 = b.substr(b.length - 3, 2);
                    var unitAry = {
                        ResidualAmmeter: "mA",
                        CommAmmeter0: "W",
                        EM_Temp: "℃",
                        EM_Hum: "%",
                        AmpereMeter: "A"
                    };
                    if (sbit0 == 0) {
                        //离线或无效
                        spanState.remove();
                    } else {
                        if (this.type == 'PowerBreaker' || this.type == 'PowerRelease') {
                            //导通、断路、离线三种状态
                            spanValue.remove();
                            switch (sbit1) {
                                case "00":
                                    spanState.text("");
                                    break;
                                case "10":
                                    spanState.text("导通").css({
                                        "color": level[0]
                                    });
                                    img.attr({
                                        "src": "image/" + this.type + "_" + sbit1 + ".png"
                                    });
                                    break;
                                case "01":
                                    spanState.text("断路").css({
                                        "color": level[3]
                                    });
                                    break;
                            }
                        } else if (this.type == 'AZ_Smoke' || this.type == "CommAlarmBell") {
                            //报警、正常、离线三种状态
                            spanValue.remove();
                            switch (sbit1) {
                                case "00":
                                    spanState.text('');
                                    break;
                                case "01":
                                    spanState.text("正常").css({
                                        "color": level[0]
                                    });
                                    img.attr({
                                        "src": "image/" + this.type + "_01.png"
                                    });
                                    break;
                                case "10":
                                case "11":
                                    spanState.text("报警").css({
                                        "color": level[2]
                                    });
                                    img.attr({
                                        "src": "image/" + this.type + "_11.png"
                                    });
                                    break;
                            }

                        } else {
                            //报警、预警、正常、离线三种状态
                            spanValue.text(this.as + unitAry[this.type]);
                            switch (sbit1) {
                                case "00":
                                    spanState.text('');
                                    break;
                                case "01":
                                    spanState.text("正常").css({
                                        "color": level[0]
                                    });
                                    break;
                                case "10":
                                    spanState.text("预警").css({
                                        "color": level[1]
                                    });
                                    break;
                                case "11":
                                    spanState.text("报警").css({
                                        "color": level[2]
                                    });
                                    break;
                            }
                            img.attr({
                                "src": "image/" + this.type + "_" + sbit1 + ".png"
                            });
                        }
                    }
                }

                textDiv.append(spanTitle).append(spanValue).append(spanState);
                li.append(img).append(textDiv);
                ul.append(li);
            });
            opts.title = box.pointName;
            var pageHtml = "<div class='page'><span id='" + box.sn + "' onClick = 'showContacter(this)'>紧急联系人</span><span  onClick = 'showHisData(this)' id = " + boxId + " data='" + boxName + "'>历史数据</span></div>            "
            div.append(ul);
            content = div.html() + pageHtml;
            //  map.panTo(new BMap.Point(box.lo, box.la)); //移动到该点
            var infoWindow = new BMap.InfoWindow(content, opts, {
                enableAutoPan: true
            });
            map.openInfoWindow(infoWindow, box.point);
        }
}
