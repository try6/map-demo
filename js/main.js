var map = new BMap.Map("allmap", {
    enableMapClick: false
});
var level = ["#549ee2", "#ffc268", "#ff4800", "#636363"];
//var ajaxUrl = "../aehy/simple_query";
//var jAjax = new jsonAjax(ajaxUrl);
var pointCenter = new BMap.Point(120.4555, 30.4523); //设置中心点
var city = '杭州市';
map.centerAndZoom(pointCenter, 11); //中心轴 
map.enableScrollWheelZoom(true);
var markers = [];
var arrayPoint = []; //在视图中绘制的point对象
//var userToken = "BC3054087281A301E9133E855E5517EA#5a60e853";
var Data;

//
var pointList = []; //用户下所有的点位
var pointVirtuaList = []; //用户下所有的虚拟组点位 
var projectPointList = []; //一个项目下的地图点位,包含虚拟点和配电箱点
var showPointList = []; //在视图中绘制的点，包含虚拟点和配电箱点

var showVirtualList = []; //视图中绘制的虚拟点
var showBoxList = []; //视图中绘制的配电箱
var showView = {}; //当前视图区域


var localBoxList = []; //本地缓存boxlist数据
var localBoxStatusList = []; //本地缓存boxstatus数据
var localVirtualStatusList = []; //本地缓存boxstatus数据

var opts = {
    width: 400, // 信息窗口宽度
    height: 350, // 信息窗口高度
    title: "通道状态", // 信息窗口标题
    // enableMessage: true //设置允许信息窗发送短息
    enableCloseOnClick: true,
    //enableAutoPan:true
};


$(function () {

    mockData(); //模拟数据
    // getPointList(); //加载所有配电箱列点位
    getBoxStateList(); //用户下所有配电箱状态缓存;
    setInterval(function () {
        getBoxStateList();
    }, 30000) //定时更新状态，每5分钟刷新一次
    mask(1);

    //信息区隐藏和显示按钮
    $(".sideBtn").on("click", function () {
        var widthR = $("#rightWrap").width();
        var widthT = ($(".sideBtn>div").outerWidth()) / 2;
        if ($("#rightWrap").css('right') == '0px') {
            $("#rightWrap").animate({
                'right': -widthR + "px"
            }, 200);
            $(".triangle").css({
                'border-color': 'transparent #165dc0 transparent transparent',
                "left": 3 - widthT + "px"
            });
        } else {
            $("#rightWrap").animate({
                'right': 0
            }, 200);
            $(".triangle").css({
                'border-color': 'transparent transparent transparent #165dc0',
                "left": "3px"
            });
        }
    });
    //输入框有内容时，delete-icon消失
    $('.search input').on('propertychange input', function () {
        if ($(this).val()) {
            $(".search .delete-icon").css("display", "block");
        }
    });
    //清空输入框icon
    $(".search .delete-icon").click(function () {
        $('.search input').val("");
        $("#leftWrap .content").css("display", "none");
        $(this).css("display", "none");
    });
    // 搜索查询项目
    $(document).keypress(function (e) {
        if (e.which == 13) {
            $(".search .search-icon").trigger("click");
        };
    });
    $(".search .search-icon").on("click", function () {
        //  map.clearOverlays();
        $(".search .delete-icon").css("display", "block");
        $("#leftWrap .content").css("display", "block");
        map.closeInfoWindow();
        // pointList = [];
        getProject($('.search input').val());
        // getPointList();
    });
    //项目查询点位
    $(".list").on('click', 'li', function () {
        //map.clearOverlays();
        // getPointList(parseInt($(this).attr("id")));
        getProjectPointList(parseInt($(this).data("projectId")));
    });
});

//缓存获取所有点位，显示虚拟点位
function getPointList(id) {
    pointList = [];
    pointVirtuaList = [];
    pointboxList = [];
    var myCity = new BMap.LocalCity();
    myCity.get(function (result) {
        city = result.name;
        //con.city = city;
        var data = Data.projectPointList;
        if (data.code == 0) {
            pointList = data.result.objs;
            $.each(pointList, function () {
                if (this.pointType == 2) {
                    pointVirtuaList.push(this);
                } else {
                    pointboxList.push(this);
                }
            });
            arrayPoint = [];
            getShowPoint(pointList);
            map.setViewport(arrayPoint);
            map.addEventListener("moveend", function () {
                move(pointList);
            });
            map.addEventListener("zoomend", function () {
                changeZoom(pointList);
            });
            createMsg();

        }
    });
}

//创建本地缓存_配电箱状态
function getBoxStateList(sn) {

    var data = Data.boxStatusList;
    if (data.code == 0) {
        localBoxStatusList = data.result.cataStateList;
        getlocalVirtualStatusList();
    }
}
//创建本地缓存_虚拟组状态
function getlocalVirtualStatusList() {
    var data = Data.VirtualStatusList;
    if (data.code == 0) {
        localVirtualStatusList = data.result.virtualGroupList;
        getPointList();
    }
}

function getProjectPointList(id) {
    // var _arrayPoint = [];
    var zoom;
    var center;
    var _this;
    $.each(pointVirtuaList, function () {
        if (this.pointType == 2) {
            if (this.projectId == id) {
                center = new BMap.Point(this.lo, this.la);
                zoom = this.scaleLowerlimit;
                _this = this;
            }
        }
    });
    map.setZoom(zoom);
    map.panTo(center);
    setTimeout(function () {
        createVirtualWindow(_this)
    }, 100);
}


function getShowPoint(pointList) {
    showBoxList = [];
    showVirtualList = [];
    showPointList = [];
    var currentView = {
        'southWest': map.getBounds().getSouthWest(),
        'northEast': map.getBounds().getNorthEast()
    }
    setShowView(currentView);
    var pointMore = [];
    var pointArray = [];
    $.each(pointList, function () {
        if (this.lo > showView.leftBottom.lng && this.lo < showView.rightTop.lng && this.la > showView.leftBottom.lat && this.la < showView.rightTop.lat) {
            var zoom = map.getZoom();
            if (this.scaleLowerlimit >= zoom && this.scaleUpperlimit <= zoom) {
                showPointList.push(this);
            }
        }
    });
    var count = 0;
    if (showPointList.length > 50) {
        setTimeout(function fn() {
            var page = [];
            if (count < showPointList.length) {
                setTimeout(fn, 500);
                var i = count + 50;
                if (i > showPointList.length) {
                    i = showPointList.length;
                }
                for (var k = count; k < i; k++) {
                    page.push(showPointList[k]);
                }
                drawPoint(page);
                count += 50;
            } else {
                return false;
            }
        }, 500);
    } else {
        drawPoint(showPointList);
    }


    mask(0);
}

function upDateShowPoint(point) {
    if (point.pointType == 1) {
        showBoxList.push(point);
        var icon = new BMap.Icon("image/box1.png", new BMap.Size(32, 46));
        point.marker.setIcon(icon);
        updateBoxStatus(point);
    } else {
        showVirtualList.push(point);
        var icon = new BMap.Icon("image/virtual_0101.png", new BMap.Size(32, 46));
        point.marker.setIcon(icon);
        point.status = 01;
        updateVirtualStatus(point);
    }
}

function updateBoxStatus(box) {
    $.each(localBoxStatusList, function () {
        if (box.sn == this.sn) {
            var cs = pad(this.cs.toString(2), 32);
            var sibt = [];
            for (var i = cs.length / 2 - 1; i >= 0; i--) {
                var j = 2;
                var v2 = cs.substr(i * j, 2);
                sibt.push(v2);
            };
            var AlarmFlag = 0;
            var NoticeFlag = 0;
            var myIcon; //= new BMap.Icon("image/box0.png", new BMap.Size(18, 27));

            if (sibt[0] == "00" || sibt[0] == "11") {
                myIcon = new BMap.Icon("image/box0.png", new BMap.Size(18, 27));
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
                            myIcon = new BMap.Icon("image/box3.png", new BMap.Size(18, 27));
                            // box.marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                        } else if (NoticeFlag && !AlarmFlag) {
                            //配电箱预警
                            myIcon = new BMap.Icon("image/box2.png", new BMap.Size(18, 27));
                            // box.marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                        } else {
                            //配电箱正常
                            myIcon = new BMap.Icon("image/box1.png", new BMap.Size(18, 27));
                        }
                    }
                }
            }


            box.marker.setIcon(myIcon);
        }
    })
}

function updateVirtualStatus(virtualGroup) {
    $.each(localVirtualStatusList, function () {
        if (this.projectId == virtualGroup.projectId) {
            var text = 01;
            if (this.onLineStatus != '00' && this.onLineStatus != "11") {
                var icon = new BMap.Icon("image/virtual_" + this.reportStatus + this.onLineStatus + ".png", new BMap.Size(32, 46));
                switch (this.reportStatus) {
                    case "10":
                        text = 10;
                        //  virtualGroup.marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                        break;
                    case "11":
                        text = 11
                        // virtualGroup.marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                        break;
                }
            } else {
                var icon = new BMap.Icon("image/virtual_0000.png", new BMap.Size(32, 46));
                text = 00;
            }
            virtualGroup.marker.setIcon(icon);
            virtualGroup.status = text;
        }
    });
}

function move(pointList) {
    var currentView = {
        'southWest': map.getBounds().getSouthWest(),
        'northEast': map.getBounds().getNorthEast()
    }
    //alert("showView:"); 
    if (needReloadShowView(showView, currentView)) {
        map.clearOverlays();
        getShowPoint(pointList);
    }
}

function changeZoom(pointList) {
    // var showPointList = [];
    map.clearOverlays();
    console.log(map.getZoom());

    getShowPoint(pointList);
}

function drawPoint(pointList) {
    $.each(pointList, function () {
        var point = this;
        var point = this;
        point.point = new BMap.Point(point.lo, point.la);
        point.marker = new BMap.Marker(point.point);
        if (point.pointType == 2) {
            var label = new BMap.Label(point.pointName, {
                offset: new BMap.Size(0, 50)
            });
            point.marker.setLabel(label);
        }
        point.marker.data = point;
        addClickHandler(point);
        upDateShowPoint(point);
        map.addOverlay(point.marker);
    });
}

function clickAndUpdateStatus(pointList) {
    $.each(pointList, function () {});
}

function setShowView(currentView) {
    var zoom = map.getZoom();
    if (zoom < 17) {
        showView = {
            'leftBottom': {
                lng: currentView.southWest.lng - 1,
                lat: currentView.southWest.lat - 1
            },
            "rightTop": {
                lng: currentView.northEast.lng + 1,
                lat: currentView.northEast.lat + 1
            }
        }
    } else {
        showView = {
            'leftBottom': {
                lng: currentView.southWest.lng - 0.004,
                lat: currentView.southWest.lat - 0.004
            },
            "rightTop": {
                lng: currentView.northEast.lng + 0.004,
                lat: currentView.northEast.lat + 0.004
            }
        }
    }
}

function addClickHandler(box) {
    var marker = box.marker;
    marker.addEventListener("click", function () {
        openInfo(box);
    });
}

function openInfo(box) {
    if (box.pointType == 1) {
        createBoxWindow(box);
    } else {
        createVirtualWindow(box);
    }
}

function needReloadShowView(loadView, currentView) {
    if (loadView.leftBottom.lng > currentView.southWest.lng ||
        loadView.leftBottom.lat > currentView.southWest.lat ||
        loadView.rightTop.lng < currentView.northEast.lng ||
        loadView.rightTop.lat < currentView.northEast.lat) {
        //当前区域移出加载区
        return true;
    } else {
        return false;
    }
}

function pad(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}
//加载状态，loading
function mask(status) {
    if (status) {
        //status为1时loading出现
        $(".mask").css("display", "block");
    } else {
        //status为0时loading隐藏
        $(".mask").css("display", "none");
    }
}