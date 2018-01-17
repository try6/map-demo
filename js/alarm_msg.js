/* 报警记录 */
var msgId = 0;
var msgCount = 0;
//var msgListData = [];
$(function () {
    // createMsg();
});

function createMsg() {
    msgCount++;
        var data = Data.msgList;
        if (data.code == 0) {
            var msgListData = data.result.objs;
            var msglist = $(".alarmRecord ul");
            if (msgId != 0) {
                $.each(msgListData, function (index) {
                    // updateAttentionMsg(this);
                    alarmUpdateStatus(this);
                });
            }
            msgId = msgListData[msgListData.length - 1].msgId;
            //createMsg();
        }
}
//发生报警后同步更新本地“配电箱状态”缓存
//方式2：前端根据boxSn和type修改配电箱状态的cs字段
function alarmUpdateStatus(msgDate) {
    var boxId = msgDate.boxId;
    var boxMethod;
    var icon;
    if (msgDate.method == '10' && msgDate.state == 0) {
        //正常状态
        boxMethod = '01';
    } else if (msgDate.method == '11' && msgDate.state == 1) {
        //报警
        boxMethod = '11';
    } else if ((msgDate.method == '11' && msgDate.state == 0) || (msgDate.method == '10' && msgDate.state == 1)) {
        //预警
        boxMethod = '10';
    }
    // if(msgDate.lo){
    //配电箱已配置点位
    $.each(showBoxList, function () {
        var box = this;
        if (this.realId == boxId) {
            if (boxMethod == 11) {
                icon = new BMap.Icon("image/box3.png", new BMap.Size(18, 27));
                this.marker.setAnimation(BMAP_ANIMATION_BOUNCE);
            } else if (boxMethod == 10) {
                icon = new BMap.Icon("image/box2.png", new BMap.Size(18, 27));
                this.marker.setAnimation(BMAP_ANIMATION_BOUNCE);
            } else {
                icon = new BMap.Icon("image/box1.png", new BMap.Size(18, 27));
            }
            setTimeout(function () {
                box.marker.setAnimation();
            }, 5000);
            this.marker.setIcon(icon);
        }
    });
    $.each(showVirtualList, function () {
        var virtualGroup = this;
        if (this.projectId == msgDate.projectId) {
            //修改虚拟组状态
            if (boxMethod == 11) {
                icon = new BMap.Icon("image/virtual_1101.png", new BMap.Size(32, 46));
                this.marker.setAnimation(BMAP_ANIMATION_BOUNCE);
            } else if (boxMethod == 10) {
                icon = new BMap.Icon("image/virtual_1001.png", new BMap.Size(32, 46));
                this.marker.setAnimation(BMAP_ANIMATION_BOUNCE);
            } else {
                icon = new BMap.Icon("image/virtual_0101.png", new BMap.Size(32, 46));
            }
            setTimeout(function () {
                virtualGroup.marker.setAnimation();
            }, 5000);
            this.marker.setIcon(icon);
        }

    });

    //   }
    //更新本地配电箱状态缓存
    updateLocalBoxStatus(msgDate, boxMethod);
    //更新本地虚拟组状态缓存
    updateLocalVirtualStatus(msgDate, boxMethod);

}

function updateLocalBoxStatus(msgDate, boxMethod) {
    var con = {};
    $.each(localBoxStatusList, function () {
        if (this.id == msgDate.boxId) {
            var cs = pad(this.cs.toString(2), 32);
            var sibt = [];
            for (var i = 16; i >= 0; i--) {
                var j = 2;
                var v2 = cs.substr(i * j, 2);
                sibt.push(v2);
            };
            switch (msgDate.type) {
                case "EM_Temp":
                    sibt[4] = boxMethod;
                    break;
                case "EM_Hum":
                    sibt[5] = boxMethod;
                    break;
                case "ResidualAmmeter":
                    sibt[6] = boxMethod;
                    break;
                case "CommAmmeter":
                    sibt[7] = boxMethod;
                    break;
                case "AZ_Smoke":
                    sibt[8] = boxMethod;
                    break;
            };
            this.cs = parseInt(sibt.reverse().join(''), 2);
            return false;
        }
    });

}

function updateLocalVirtualStatus(msgDate, boxMethod) {
    $.each(localVirtualStatusList, function () {
        if (this.projectId == msgDate.projectId) {
            if (this.reportStatus == "11" && boxMethod == "10") {
                //如果虚拟组处于报警状态,而又有通道发生预警，不改变虚拟组原有状态
                return false;
            }
            this.reportStatus = boxMethod;
            return false;
        }
    });
}