/* 检索区分类查询、排序功能 */

var alarmBox = [];
var noticeBox = [];
var normalBox = [];
$(function () {

    //getProject();


});


//获取项目列表
function getProject(projectName) {
    //jAjax.query(8, 0, 0, con, function (data, status, jqXHR) {
        var ul = $("#leftWrap .list").empty();
        var data = Data.projectList;
        projectList = data.result.objs;
        $.each(projectList, function () {
            var li = $("<li>").data('projectId', this.projectId);
            ul.append(li);
            var name = $("<div>").addClass("listTitle").text(this.projectName);
            var img = $("<img>").addClass("img").attr("src", "image/project.png");
            li.append(img).append(name);

        });

}