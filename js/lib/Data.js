function mockData() {
    //模拟数据
    var Random = Mock.Random;
    Data = Mock.mock({
        "contacter": {
            "code": 0,
            "result": {
                "contacter": "联系人姓名",
                "contacterPhone": 12333333333,
                "poisition": "小华"
            }
        },
        "msgList": {
            "code": "0",
            "result": {
                "objs|2": [{
                    "msgId|+1": 1,
                    "boxName": "配电箱名称",
                    "boxSn": "MA27YMYQ1A00126",
                    "method": '11',
                    "time": 1510021921,
                    'state': 1,
                    "content": "@string",
                    "projectId": "7"
                }]
            }
        },
        'projectPointList': {
            'code': 0,
            "result": {
                "objs|4-10": [{
                    'realId|1-199': 1,
                    "lo|119-121.5": 119,
                    "la|29-31.5": 29,
                    "pointType|1-2": 1,
                    "pointName": "点位名称",
                    "scaleLowerlimit|9-19": 19,
                    "scaleUpperlimit|3-8": 3,
                    "city": "杭州",
                    "pointId|+1": 1,
                    'projectId|1-3': 1
                }]
            }
        },
        'chanList': {
            'code': 0,
            "result": {
                "objs|2-5": [{
                    'chanId|+1': 1,
                    "chanName": '通道名称',
                    "sn": "@string",
                    "boxName": "配电箱名称",
                    "type": "EM_Temp",
                }]
            }
        },
        "chanstatus": {
            'code': 0,
            'result': {
                'sub|1-5': [{
                    's': 1,
                    'as|1-200': 2,
                    "type": "EM_Temp",
                    "i|+1": 1,
                    "cn":"测试板剩余电流11"

                }]
            }
        },
        'virtualGroupList': {
            "code": 0,
            "result": {
                'objs|1-10': [{
                    "projectId|1-100": 1,
                    "projectName": "项目名称",
                    "virtualGroupId|1-100": 1,
                    "virtualGroupName": "虚拟组名称",
                    "lo|119-121.5": 119,
                    "la|29-31.5": 29,
                    "boxList|10-100": [{
                        "boxId|1-100": 1,
                        "boxName|": "配电箱名称",
                        "boxSn": '328319154A0002W'
                    }]
                }]
            }
        },
        "boxStatusList": {
            'code': 0,
            "result": {
                'cataStateList|15': [{
                    "sn|1-100": 1,
                    'id|+1':1,
                    "cs": "MA27YMYQ1A00004"
                }]
            }
        },
        "VirtualStatusList": {
            "code": 0,
            "result": {
                "virtualGroupList|10": [{
                    "virtualGroupId|1-10": 1,
                    "virtuaStatus": 1001,
                    "onlineStatus": 10,
                    "reportStatus": 11,
                    'projectId|1-10': 1
                }],
            }
        },
        "projectList": {
            "code": 0,
            "result": {
                "objs|1-19": [{
                    'projectId|1-2': 1,
                    "projectName": "项目名称"

                }]
            }
        },
        "chanAlarmCount": {
            'code': 0,
            'result': {
                "objs|2-10": [{
                    "chanType": "ResidualAmmeter",
                    "reportCount|1-20": 1,
                    "reportType": 11
                }]
            }
        },
        "chanAlarmDetials": {
            'code': 0,
            'result': {
                "objs|2-10": [{
                    "boxId|1-20": 1,
                    "boxName": '配电箱名称',
                    "boxSn": "328319154A0002W",
                    "chanName": "测试板剩余电流11",
                    "chanType": "ResidualAmmeter",
                    "reportTime": "1513908001",
                    "reportType": 11
                }]
            }
        },
        "chanOnlineCount": {
            'code': 0,
            'result': {
                "obj|2-10": [{
                    "partialOffLineStatusNum": 11,
                    "offLineStatusNum": 11
                }]
            }
        },
        "chanOnlineDetials": {
            'code': 0,
            'result': {
                "obj|2-10": [{
                    "boxId|1-20": 1,
                    "boxName": '配电箱名称',
                    "boxSn": "328319154A0002W",
                }]
            }
        },
        "historyList":{
            'code':0,
            'result':{
                'objs|12':[{
                    'count|3-20':1,
                    'day|1-30':1,
                    'hour|0-23':1,
                    'method|10':10,
                    'statisticsId|+1':0,
                    'year':2018,
                    "month":1
                }]
            }
        }
    })
    //Random.integer(0, 3);
    Random.string(5);
}
