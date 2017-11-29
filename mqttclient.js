/**
 * Created by Huang Yuanjie on 2017/10/24.
 */

var mqtt  = require('mqtt');


var start = true;

var client  = mqtt.connect('mqtt://127.0.0.1',{
    username:'username',
    password:'password',
    clientId:'MQTT_XH_ARMY_SYS'
});

client.on('connect', function () {
    console.log('connected.....');
    client.subscribe('MQTT_XH_ARMY_SYS');

    setInterval(function(){
        if(!start) return;
        client.publish('MQTT_XH_ARMY_UI_Main', buildsoldierinfo());
    },45000);

    setInterval(function(){
        if(!start) return;
        client.publish('MQTT_XH_ARMY_UI_Main', buildhospitalinfo());
    },45000);

    setInterval(function(){
        if(!start) return;
        client.publish('MQTT_XH_ARMY_UI_Main', buildambulanceinfo());
    },45000);
    //client.publish('MQTT_TOPIC_UI_TO_HCU', 'Hello mqtt['+i+']');
});

client.on('message', function (topic, message) {


});
function buildsoldierinfo(){

    var status=[
        "HEATH",
        "WOUNDED",
        "INJURY",
        "DEAD",
        "TREATED"];
    var address=[
        {
            Flag_la:"N",
            Latitude:31.240246,
            Flag_lo:"E",
            Longitude:121.514168
        },
        {
            Flag_la:"N",
            Latitude:31.255719,
            Flag_lo:"E",
            Longitude:121.517700
        },
        {
            Flag_la:"N",
            Latitude:31.223441,
            Flag_lo:"E",
            Longitude:121.442703
        },
        {
            Flag_la:"N",
            Latitude:31.248271,
            Flag_lo:"E",
            Longitude:121.615476
        },
        {
            Flag_la:"N",
            Latitude:31.313004,
            Flag_lo:"E",
            Longitude:121.525701
        },
        {
            Flag_la:"N",
            Latitude:31.382624,
            Flag_lo:"E",
            Longitude:121.501387
        },
        {
            Flag_la:"N",
            Latitude:31.101605,
            Flag_lo:"E",
            Longitude:121.404873
        },
        {
            Flag_la:"N",
            Latitude:31.043827,
            Flag_lo:"E",
            Longitude:121.476450
        },
        {
            Flag_la:"N",
            Latitude:31.088973,
            Flag_lo:"E",
            Longitude:121.295459
        },
        {
            Flag_la:"N",
            Latitude:31.127234,
            Flag_lo:"E",
            Longitude:121.062241
        },
        {
            Flag_la:"N",
            Latitude:31.164430,
            Flag_lo:"E",
            Longitude:121.102934
        },
        {
            Flag_la:"N",
            Latitude:31.218057,
            Flag_lo:"E",
            Longitude:121.297076
        },
        {
            Flag_la:"N",
            Latitude:31.203650,
            Flag_lo:"E",
            Longitude:121.526288
        },
        {
            Flag_la:"N",
            Latitude:31.228283,
            Flag_lo:"E",
            Longitude:121.485388
        },
        {
            Flag_la:"N",
            Latitude:31.256691,
            Flag_lo:"E",
            Longitude:121.475583
        },
        {
            Flag_la:"N",
            Latitude:31.357885,
            Flag_lo:"E",
            Longitude:121.256060
        },
        {
            Flag_la:"N",
            Latitude:30.739094,
            Flag_lo:"E",
            Longitude:121.360693
        },
        {
            Flag_la:"N",
            Latitude:30.900796,
            Flag_lo:"E",
            Longitude:121.933166
        }
    ];
    var soldierlist=[];
    for(var i=0;i<address.length;i++){
    //for(var i=0;i<4;i++){
        for(var j=0;j<8;j++){
            var reportnumber = GetRandomNum(1,6);
            var report=[];
            for(var k=0;k<reportnumber;k++){
                var tempreport={
                    name:"name"+k,
                    detail:"detail"+k
                }
                report.push(tempreport);
            }
            var templabel={
                Name:"Soldier"+i+""+j,
                id:i*100+j,
                status:status[GetRandomNum(0,4)],
                Flag_la:address[i].Flag_la,
                Latitude:address[i].Latitude+GetRandomNum(-50,50)*0.00005,
                Flag_lo:address[i].Flag_lo,
                Longitude:address[i].Longitude+GetRandomNum(-50,50)*0.00005,
                detailinfo:report
            }

            soldierlist.push(templabel);
        }

    }
    var ret={
        action:"XH_ARMY_MEDICAL_SOLDIER_INFO",
        body:soldierlist
    }
    return JSON.stringify(ret);
}

function buildhospitalinfo(){
    var address=[
        {
            Flag_la:"N",
            Latitude:31.240246,
            Flag_lo:"E",
            Longitude:121.514168
        },
        {
            Flag_la:"N",
            Latitude:31.255719,
            Flag_lo:"E",
            Longitude:121.517700
        },
        {
            Flag_la:"N",
            Latitude:31.223441,
            Flag_lo:"E",
            Longitude:121.442703
        },
        {
            Flag_la:"N",
            Latitude:31.248271,
            Flag_lo:"E",
            Longitude:121.615476
        },
        {
            Flag_la:"N",
            Latitude:31.313004,
            Flag_lo:"E",
            Longitude:121.525701
        },
        {
            Flag_la:"N",
            Latitude:31.382624,
            Flag_lo:"E",
            Longitude:121.501387
        },
        {
            Flag_la:"N",
            Latitude:31.101605,
            Flag_lo:"E",
            Longitude:121.404873
        },
        {
            Flag_la:"N",
            Latitude:31.043827,
            Flag_lo:"E",
            Longitude:121.476450
        },
        {
            Flag_la:"N",
            Latitude:31.088973,
            Flag_lo:"E",
            Longitude:121.295459
        },
        {
            Flag_la:"N",
            Latitude:31.127234,
            Flag_lo:"E",
            Longitude:121.062241
        },
        {
            Flag_la:"N",
            Latitude:31.164430,
            Flag_lo:"E",
            Longitude:121.102934
        },
        {
            Flag_la:"N",
            Latitude:31.218057,
            Flag_lo:"E",
            Longitude:121.297076
        },
        {
            Flag_la:"N",
            Latitude:31.203650,
            Flag_lo:"E",
            Longitude:121.526288
        },
        {
            Flag_la:"N",
            Latitude:31.228283,
            Flag_lo:"E",
            Longitude:121.485388
        },
        {
            Flag_la:"N",
            Latitude:31.256691,
            Flag_lo:"E",
            Longitude:121.475583
        },
        {
            Flag_la:"N",
            Latitude:31.357885,
            Flag_lo:"E",
            Longitude:121.256060
        },
        {
            Flag_la:"N",
            Latitude:30.739094,
            Flag_lo:"E",
            Longitude:121.360693
        },
        {
            Flag_la:"N",
            Latitude:30.900796,
            Flag_lo:"E",
            Longitude:121.933166
        }
    ];
    var hospitallist=[];
    for(var i=0;i<address.length;i++){
    //for(var i=0;i<4;i++){
            var reportnumber = GetRandomNum(1,6);
            var report=[];
            for(var k=0;k<reportnumber;k++){
                var tempreport={
                    name:"name"+k,
                    detail:"detail"+k
                }
                report.push(tempreport);
            }
            var templabel={
                Name:"Hosp"+i,
                id:"H"+i*100,
                Flag_la:address[i].Flag_la,
                Latitude:address[i].Latitude,
                Flag_lo:address[i].Flag_lo,
                Longitude:address[i].Longitude,
                detailinfo:report
            }


        hospitallist.push(templabel);
    }

    var hospital = {
        action:"XH_ARMY_MEDICAL_HOSPITAL_INFO",
        body:hospitallist
    }
    return JSON.stringify(hospital);
}
function buildambulanceinfo(){
    var address=[
        {
            Flag_la:"N",
            Latitude:31.240246,
            Flag_lo:"E",
            Longitude:121.514168
        },
        {
            Flag_la:"N",
            Latitude:31.255719,
            Flag_lo:"E",
            Longitude:121.517700
        },
        {
            Flag_la:"N",
            Latitude:31.223441,
            Flag_lo:"E",
            Longitude:121.442703
        },
        {
            Flag_la:"N",
            Latitude:31.248271,
            Flag_lo:"E",
            Longitude:121.615476
        },
        {
            Flag_la:"N",
            Latitude:31.313004,
            Flag_lo:"E",
            Longitude:121.525701
        },
        {
            Flag_la:"N",
            Latitude:31.382624,
            Flag_lo:"E",
            Longitude:121.501387
        },
        {
            Flag_la:"N",
            Latitude:31.101605,
            Flag_lo:"E",
            Longitude:121.404873
        },
        {
            Flag_la:"N",
            Latitude:31.043827,
            Flag_lo:"E",
            Longitude:121.476450
        },
        {
            Flag_la:"N",
            Latitude:31.088973,
            Flag_lo:"E",
            Longitude:121.295459
        },
        {
            Flag_la:"N",
            Latitude:31.127234,
            Flag_lo:"E",
            Longitude:121.062241
        },
        {
            Flag_la:"N",
            Latitude:31.164430,
            Flag_lo:"E",
            Longitude:121.102934
        },
        {
            Flag_la:"N",
            Latitude:31.218057,
            Flag_lo:"E",
            Longitude:121.297076
        },
        {
            Flag_la:"N",
            Latitude:31.203650,
            Flag_lo:"E",
            Longitude:121.526288
        },
        {
            Flag_la:"N",
            Latitude:31.228283,
            Flag_lo:"E",
            Longitude:121.485388
        },
        {
            Flag_la:"N",
            Latitude:31.256691,
            Flag_lo:"E",
            Longitude:121.475583
        },
        {
            Flag_la:"N",
            Latitude:31.357885,
            Flag_lo:"E",
            Longitude:121.256060
        },
        {
            Flag_la:"N",
            Latitude:30.739094,
            Flag_lo:"E",
            Longitude:121.360693
        },
        {
            Flag_la:"N",
            Latitude:30.900796,
            Flag_lo:"E",
            Longitude:121.933166
        }
    ];

    var ambulancelist=[];
    for(var i=0;i<address.length;i++){
    //for(var i=0;i<4;i++){
        var reportnumber = GetRandomNum(1,6);
        var routernumber = GetRandomNum(2,4);
        var report=[];
        for(var k=0;k<reportnumber;k++){
            var tempreport={
                name:"name"+k,
                detail:"detail"+k
            }
            report.push(tempreport);
        }
        var routerlist=[];
        for(var k=0;k<routernumber;k++){
            var routerstep;
            if(k==0){

            }
            if(k==0){
                routerstep=address[i];
            }else{
                routerstep={
                    Flag_la:address[i].Flag_la,
                    Latitude:routerlist[k-1].Latitude+GetRandomNum(-50,50)*0.0001,
                    Flag_lo:address[i].Flag_lo,
                    Longitude:routerlist[k-1].Longitude+GetRandomNum(-50,50)*0.0001
                }
            }
            routerlist.push(routerstep);
        }
        var choicedrouter = GetRandomNum(1,routernumber-1);
        //console.log("Router list length ="+routernumber+",choiced routernumber="+choicedrouter);
        var a_lo=routerlist[choicedrouter].Longitude+(routerlist[choicedrouter-1].Longitude-routerlist[choicedrouter].Longitude)*Math.random();
        var a_la=routerlist[choicedrouter].Latitude+(routerlist[choicedrouter-1].Latitude-routerlist[choicedrouter].Latitude)*Math.random();
        var templabel={
            Name:"Ambulance"+i,
            id:"A"+i*100,
            Flag_la:address[i].Flag_la,
            Latitude:a_la,
            Flag_lo:address[i].Flag_lo,
            Longitude:a_lo,
            detailinfo:report,
            router:routerlist
        }
        ambulancelist.push(templabel);
    }

    var ret = {
        action:"XH_ARMY_MEDICAL_AMBULANCE_INFO",
        body:ambulancelist
    }
    return JSON.stringify(ret);
}
function GetRandomNum(Min,Max)
{
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}