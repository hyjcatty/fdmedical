/**
 * Created by Huang Yuanjie on 2017/10/23.
 */

var geoinfo={
    Longitude:null,
    Latitude:null
};
var client;
var winWidth;
var winHeight;
var maphandler = null;
var soldierlist =[];
var hospitallist=[];
var ambulancelist=[];
var soldierselected =null;
var hospitalselected =null;
var ambulanceselected =null;
var soldierwindowhandler =null;
var hospitalwindowhandler =null;
var ambulancewindowhandler =null;
var soldiermarklist =[];
var hospitalmarklist =[];
var ambulancemarklist =[];
var labellist =[];
var sysinit = false;
$(document).ready(function(){
    get_size();
    geoinfo = getLocation();
    document.documentElement.style.overflow='hidden';

});
window.onload=function(){
    initialize_statistic();
    initialize_config();
    initialize_note();
    initialize_mqtt();

    $(".label_close_button").on('click',function(){
        var id=$(this).attr("id");
        console.log("close button click");
        remove_label(hospital_label);
    });
};

function initialize(){
    $("#ArmyMap").css("width",winWidth);
    $("#ArmyMap").css("height",winHeight+120);
    //get_city(geoinfo.latitude,geoinfo.longitude);
    maphandler = new BMap.Map("ArmyMap",{mapType:BMAP_SATELLITE_MAP});
    //maphandler = new BMap.Map("ArmyMap");
    maphandler.centerAndZoom(new BMap.Point(geoinfo.Longitude,geoinfo.Latitude),15);
    //maphandler.addControl(new BMap.NavigationControl());
/*
    var main_lable = new BMap.Label("",{offset:new BMap.Size(-5000,-5000),                  //label的偏移量，为了让label的中心显示在点上
        position:new BMap.Point(geoinfo.Longitude,geoinfo.Latitude)});                                //label的位置
    main_lable.setStyle({                                   //给label设置样式，任意的CSS都是可以的
        fontSize:"14px",               //字号
        border:"0",                    //边
        height:"10000px",                //高度
        width:"10000px",                 //宽
        textAlign:"center",            //文字水平居中显示
        lineHeight:"120px",            //行高，文字垂直居中显示
        background: "#000000",
        opacity: 0.75
    });
    maphandler.addOverlay(main_lable);*/

    maphandler.enableScrollWheelZoom();



    var tileLayer = new BMap.TileLayer();
    tileLayer.getTilesUrl = function(tileCoord, zoom) {
        var x = tileCoord.x;
        var y = tileCoord.y;
        var url = 'http://127.0.0.1/army/image/black.png';     //根据当前坐标，选取合适的瓦片图
        return url;
    };
    maphandler.addTileLayer(tileLayer);
}
function initialize_statistic(){
    var temp="<div><p class='alarmtext' style='font-size:24px;'><span class='alarmtext'>战场统计</span></p>";
    for(var i=0;i<6;i++){
        temp = temp+"<p class='maintext'>test data:test output1</p>";
    }
    $("#MainStatistic").empty();
    $("#MainStatistic").append(temp);

}
function initialize_guild(data){

    var temp="";
    if(data.error !=0){
        temp=temp+"<li><div><p class='maintext' style='font-size:48px;text-align:center;'><i class='fa fa-empire' ></i></p></div>";
        temp=temp+"<p class='maintext'>获取天气失败</p>";
        temp=temp+"<p class='maintext'><a class='pull-right'><span class='maintext'>more</span></a></p>";
        temp=temp+"</li>";
    }else{
        temp=temp+"<li><div><p class='maintext' style='font-size:48px;text-align:center;'><i class='fa fa-empire' ></i></p></div>";
        temp=temp+"<p class='maintext'>天气：  "+data.results[0].weather_data[0].weather+"</p>";
        temp=temp+"<p class='maintext'>气温：  "+data.results[0].weather_data[0].temperature+"</p>";
        temp=temp+"<p class='maintext'>颗粒物： "+data.results[0].pm25+"</p>";
        temp=temp+"<p class='maintext'><a class='pull-right'><span class='maintext'>more</span></a></p>";
        temp=temp+"</li>";
    }

    $("#MainGuild").empty();
    $("#MainGuild").append(temp);
}

function initialize_config(){
    var temp="";
    temp=temp+"<li><div><p class='maintext' style='font-size:24px;'><i class='fa fa-cog' ></i><span class='maintext'>系统配置</span></p></div>";

    temp=temp+"</li>";
    $("#SysConfig").empty();
    $("#SysConfig").append(temp);
}

function initialize_note(){
    var temp="";
    temp=temp+"<li><div><p class='maintext' style='font-size:24px;'><i class='fa fa-flag' ></i><span class='maintext'>图标说明</span></p></div>";
    temp=temp+"<p class='maintext'><img src='./image/heath_small.png' style='width:16px;hight:16px'></img><span class='maintext' style='margin-left: 25px'>士兵</span></p>";
    temp=temp+"<p class='maintext'><img src='./image/wounded_small.png' style='width:16px;hight:16px'></img><span class='maintext' style='margin-left: 25px'>伤员</span></p>";
    temp=temp+"<p class='maintext'><img src='./image/treated_small.png' style='width:16px;hight:16px'></img><span class='maintext' style='margin-left: 25px'>已治疗</span></p>";
    temp=temp+"<p class='maintext'><img src='./image/injury_small.png' style='width:16px;hight:16px'></img><span class='maintext' style='margin-left: 25px'>重伤</span></p>";
    temp=temp+"<p class='maintext'><img src='./image/dead_small.png' style='width:16px;hight:16px'></img><span class='maintext' style='margin-left: 25px'>死亡</span></p>";
    temp=temp+"<p class='maintext'><img src='./image/ambulance_small.png' style='width:16px;hight:16px'></img><span class='maintext' style='margin-left: 25px'>救护车</span></p>";
    temp=temp+"<p class='maintext'><img src='./image/hospital.png' style='width:24px;hight:24px'></img><span class='maintext' style='margin-left: 17px'>医疗点</span></p>";
    temp=temp+"<p class='maintext'><img src='./image/line_small.png' style='width:16px;hight:16px'></img><span class='maintext' style='margin-left: 25px'>救治路线</span></p>";

    temp=temp+"</li>";
    $("#MainNote").empty();
    $("#MainNote").append(temp);
}


function get_size(){
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
    if (window.innerHeight)
        winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
    {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }
    console.log("winWidth = "+winWidth);
    console.log("winHeight= "+winHeight);
}

function getLocation()
{

    var bmap = new BMap.Map("GuildMap");
    var t_point = new BMap.Point(116.501573, 39.900877);
    bmap.centerAndZoom(t_point,15);
    var geoc = new BMap.Geocoder();
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var coords = {
                latitude:r.point.lat ,longitude:r.point.lng
            };
            var postion = {
                coords:coords
            };
            geoinfo = showPosition(postion);
            geoc.getLocation(new BMap.Point(geoinfo.Longitude, geoinfo.Latitude), function(rs) {

                console.log(rs);
                var addComp = rs.addressComponents;
                var usr_favorate_city = addComp.city;
                console.log("favorate city is "+usr_favorate_city);
                get_pm(usr_favorate_city);
            });


            initialize();
        }else {
            console.log("无法获得当前位置！");
            alert("无法获得当前位置！");
        }
    },{enableHighAccuracy: true});

}
function showPosition(position)
{
    console.log("Latitude: " + position.coords.latitude +
        "Longitude: " + position.coords.longitude);
    //Latitude = (position.coords.latitude);
    //Longitude = (position.coords.longitude);
    return {
        Latitude : (position.coords.latitude),
        Longitude : (position.coords.longitude)
    };
}
function get_pm(city_name){
    var cityname = city_name;
    var url = "http://api.map.baidu.com/telematics/v3/weather?location="+cityname+"&output=json&ak=2Pcn24FAWGTcyW4jsC8O38IyPd0pDZYX";
    $.ajax({
        url: url,
        //dataType: "script",
        scriptCharset: "gbk",
        dataType: 'jsonp',
        crossDomain: true,
        success: function (data) {
            //weather_info = cityname+"今日天气："+data.results[0].weather_data[0].weather+" 气温："+data.results[0].weather_data[0].temperature+" 颗粒物："+data.results[0].pm25;
            console.log(data);
            initialize_guild(data);
            //$("#weather_label").text(weather_info+"    ");
        }
    });
}
function get_city(Latitude,Longitude){
    //var map = new BMap.Map("GuildMap");
    var point = new BMap.Point(Longitude, Latitude);
    var gc = new BMap.Geocoder();
    gc.getLocation(point, function(rs) {
        var addComp = rs.addressComponents;
        console.log(rs.addressComponents);
        var usr_favorate_city = addComp.city;
        console.log("favorate city is "+usr_favorate_city);
        get_pm(usr_favorate_city);
    });
}


function initialize_mqtt(){
    client = mqtt.connect('ws://127.0.0.1:3000/mqtt' ,{
        username:"username",
        password:"password",
        clientId:"MQTT_XH_ARMY_UI_Main"
    });
    client.on('connect', function () {

        console.log('mqtt connect :)');
        client.subscribe('MQTT_XH_ARMY_UI_Main');
    });
    client.on("error", function (error) {
        console.log(error.toString());
        window.alert("Lost connect to hcu, please contact administrator!");
    });
    client.on("message", function (topic, payload) {
        //console.log('收到topic = ' + topic + ' 消息: ' + payload.toString());
        var ret = JSON.parse(payload.toString());
        switch(ret.action)
        {

            case "XH_ARMY_MEDICAL_SOLDIER_INFO":

                render_soldier(ret.body);
                break;
            case "XH_ARMY_MEDICAL_HOSPITAL_INFO":
                render_hospital(ret.body);
                break;
            case "XH_ARMY_MEDICAL_AMBULANCE_INFO":
                //console.log(ret);
                render_ambulance(ret.body);
                break;
            /*case "XH_ARMY_MEDICAL_INFO":
                render_all(ret.data);
                break;*/
            default:
                return;
        }
    });
}
function render_all(data){
    render_soldier(data.soldier.soldierinfo);
    //render_hospital(data.hospital.hospitalinfo);
    //render_ambulance(data.ambulance.ambulanceinfo);
}
function settoplabel(labelkey){
    for(var i=0;i<labellist.length;i++){
        if(labellist[i].key == labelkey){
            labellist[i].label.setZIndex(99);
        }else{
            labellist[i].label.setZIndex(1);
        }
    }
}
function setdownlabel(){
    for(var i=0;i<labellist.length;i++){
            labellist[i].label.setStyle({zIndex:"1"});
    }
}
function search_label(label_key){
    var ret = null;
    for(var i=0;i<labellist.length;i++){
        if(labellist[i].key == label_key){
            ret = labellist[i].label;

        }
    }
    return ret;
}
function remove_label(label_key){
    for(var i=0;i<labellist.length;i++){
        if(labellist[i].key == label_key){
            var templabel = labellist[i].label;
            labellist.splice(i,1);
            maphandler.removeOverlay(templabel);
            return;
        }
    }
}




function render_soldier(data){
    console.log(data);
    soldierlist = data;
    if(maphandler === null){
        return;
    }
    addsoldier(data);

    flash_soldier_label(soldierlist);
}
function render_hospital(data){
    console.log("0");
    hospitallist=data;
    console.log("length:"+data.length);
    console.log("length:"+hospitallist.length);
    console.log(hospitallist);
    if(maphandler === null){
        return;
    }
    addhospital(data);

    flash_hospital_label(hospitallist);
}
function render_ambulance(data){
    ambulancelist=data;
    if(maphandler === null){
        return;
    }
    addambulance(data);
    flash_ambulance_label(ambulancelist);
}

function make_soldier_label_key(soldier){
    return "Soldier_"+soldier.id+"_"+soldier.Name;
}
function flash_soldier_label(soldier_list){
    for(var i=0;i<soldier_list.length;i++){
        var soldier_label = search_label(make_soldier_label_key(soldier_list[i]));
        if(soldier_label !== null){
            console.log("find open label, key="+make_soldier_label_key(soldier_list[i]));
            soldierselected = soldier_list[i];
            buildsoldierlabel();
        }
    }
}

function get_select_soldier(title){
    var temp = title.split(":");
    for(var i=0;i<soldierlist.length;i++){
        if(soldierlist[i].id == temp[0]){
            soldierselected = soldierlist[i];
            return;
        }
    }
    soldierselected = null;
    return;
}
function removesoldiermarker(title){
    for(var i=0;i<soldiermarklist.length;i++){
        if(soldiermarklist[i].getTitle() == title){
            var marker = soldiermarklist[i];
            soldiermarklist.splice(i,1);
            maphandler.removeOverlay(marker);

        }
    }
}
function buildsoldierlabel(){
    if(soldierselected===null) return null;
    var soldier_label = search_label("Soldier_"+soldierselected.id+"_"+soldierselected.Name);
    var temp="";
    var i;
    if(soldier_label === null){
        console.log("SHow label");
        temp = "<div style='padding: 10px;min-width:150px'><div class='pull-left' style='margin-top:5px'><b class='maintext' style='font-size: 18px;font-weight: bold'>战斗单位</b></div><div class='pull-right' style='margin-top: -5px;margin-right: -7px'><a class='maintext label_close_button'  id='Soldier_"+
            soldierselected.id+"_"+soldierselected.Name+
            "' >[x]</a></div><li id='Soldier_"+
            soldierselected.id+"_"+soldierselected.Name+
            "_Content' style='margin-top: 10px;'><div><p class='maintext'>id:"+
            soldierselected.id+"</p>";
        temp =  temp+"<p class='maintext'>name:"+soldierselected.Name+"</p>";
        temp =  temp+"<p class='maintext'>详细信息：</p>";
        for(i=0;i<soldierselected.detailinfo.length;i++){
            temp =  temp+"<p class='maintext'>"+soldierselected.detailinfo[i].name+":"+soldierselected.detailinfo[i].detail+"</p>";
        }

        temp=temp+"</div></li></div>";
        soldier_label = new BMap.Label(temp,{offset:new BMap.Size(24,-32),                //label的偏移量，为了让label的中心显示在点上
            position:new BMap.Point(parseFloat(soldierselected.Longitude),parseFloat(soldierselected.Latitude))});                                //label的位置
        soldier_label.setStyle({                                   //给label设置样式，任意的CSS都是可以的
            fontSize:"14px",               //字号
            border:"0",                 //宽
            textAlign:"left",            //文字水平居中显示
            lineHeight:"10px",            //行高，文字垂直居中显示
            background: "#000000",
            opacity: 0.8
        });
        soldier_label.addEventListener("click", function(){
            console.log("click on soldier_label");
            setdownlabel();
            this.setStyle({zIndex:"100"});
        });
        maphandler.addOverlay(soldier_label);
        labellist.push({
            key:"Soldier_"+soldierselected.id+"_"+soldierselected.Name,
            label:soldier_label
        });

        $(".label_close_button").on('click',function(){
            var id=$(this).attr("id");
            console.log("close button click");
            remove_label(id);
        });
    }else{
        soldier_label.setPosition(new BMap.Point(parseFloat(soldierselected.Longitude),parseFloat(soldierselected.Latitude)));
        console.log("flash label");
        temp = "<div><p class='maintext'>id:"+
            soldierselected.id+"</p>";
        temp =  temp+"<p class='maintext'>name:"+soldierselected.Name+"</p>";
        temp =  temp+"<p class='maintext'>详细信息：</p>";
        for(i=0;i<soldierselected.detailinfo.length;i++){
            temp =  temp+"<p class='maintext'>"+soldierselected.detailinfo[i].name+":"+soldierselected.detailinfo[i].detail+"</p>";
        }
        temp=temp+"</div>";
        $("#Soldier_"+
            soldierselected.id+"_"+soldierselected.Name+
            "_Content").empty();
        $("#Soldier_"+
            soldierselected.id+"_"+soldierselected.Name+
            "_Content").append(temp);
    }
}
function addsoldier(soldier){
    // 创建图标对象

    soldier_mark_click = function(){
        get_select_soldier(this.getTitle());
        if(soldierselected == null) return;
        buildsoldierlabel();
        /*
        get_select_soldier(this.getTitle());
        var sContent = this.getTitle();
        var infoWindow = new BMap.InfoWindow(sContent,{offset:new BMap.Size(0,-23),width:300,height:300});
        //infoWindow.setWidth(600);
        //infoWindow.setHeight(500);
        soldierwindowhandler = infoWindow;
        this.openInfoWindow(infoWindow);
        infoWindow.addEventListener("close",function(){
            if(soldierwindowhandler == this) soldierwindowhandler = null;
        });*/
    };
    //console.log(soldierlist.length);
    for(var i=0;i<soldierlist.length;i++){
        var myIcon;
        switch(soldierlist[i].status)
        {
            case "HEATH":
                myIcon=new BMap.Icon("./image/heath_small.png", new BMap.Size(16, 16));
                break;
            case "DEAD":
                myIcon=new BMap.Icon("./image/dead_small.png", new BMap.Size(16, 16));
                break;
            case "TREATED":
                myIcon=new BMap.Icon("./image/treated_small.png", new BMap.Size(16, 16));
                break;
            case "INJURY":
                myIcon=new BMap.Icon("./image/injury_small.png", new BMap.Size(16, 16));
                break;
            case "WOUNDED":
                myIcon=new BMap.Icon("./image/wounded_small.png", new BMap.Size(16, 16));
                break;
            default:
                return;
        }


        var soldier_point = new BMap.Point(parseFloat(soldierlist[i].Longitude),parseFloat(soldierlist[i].Latitude));
        var soldier_marker = new BMap.Marker(soldier_point, {icon: myIcon,zIndex:10});
        soldier_marker.setTop(true);
        soldier_marker.setTitle(soldierlist[i].id+":"+soldierlist[i].Name);
        removesoldiermarker(soldierlist[i].id+":"+soldierlist[i].Name);
        maphandler.addOverlay(soldier_marker);

        soldier_marker.addEventListener("click", soldier_mark_click);
        soldiermarklist.push(soldier_marker);
    }

}
function make_hospital_label_key(hospital){
    return "Hospital_"+hospital.id+"_"+hospital.Name;
}
function flash_hospital_label(hospital_list){
    for(var i=0;i<hospital_list.length;i++){
        var hospital_label = search_label(make_hospital_label_key(hospital_list[i]));
        if(hospital_label !== null){
            console.log("find open label, key="+make_hospital_label_key(hospital_list[i]));
            hospitalselected = hospital_list[i];
            buildhospitallabel();
        }
    }
}
function get_select_hospital(title){
    var temp = title.split(":");
    for(var i=0;i<hospitallist.length;i++){
        if(hospitallist[i].id == temp[0]){
            hospitalselected = hospitallist[i];
            return;
        }
    }
    hospitalselected = null;
    return;
}
function removehospitalmarker(title){
    for(var i=0;i<hospitalmarklist.length;i++){
        if(hospitalmarklist[i].getTitle() == title){
            var marker = hospitalmarklist[i];
            hospitalmarklist.splice(i,1);
            maphandler.removeOverlay(marker);

        }
    }
}
function buildhospitallabel(){
    if(hospitalselected===null) return null;
    var hospital_label = search_label("Hospital_"+hospitalselected.id+"_"+hospitalselected.Name);
    var temp="";
    var i;
    if(hospital_label === null){
        console.log("SHow label");
        temp = "<div style='padding: 10px;min-width:150px'><div class='pull-left' style='margin-top:5px'><b class='maintext' style='font-size: 18px;font-weight: bold'>战地医院</b></div><div class='pull-right' style='margin-top: -5px;margin-right: -7px'><a class='maintext label_close_button'  id='Hospital_"+
            hospitalselected.id+"_"+hospitalselected.Name+
            "' >[x]</a></div><li id='Hospital_"+
            hospitalselected.id+"_"+hospitalselected.Name+
            "_Content' style='margin-top: 10px;'><div><p class='maintext'>id:"+
            hospitalselected.id+"</p>";
        temp =  temp+"<p class='maintext'>name:"+hospitalselected.Name+"</p>";
        temp =  temp+"<p class='maintext'>详细信息：</p>";
        for(i=0;i<hospitalselected.detailinfo.length;i++){
            temp =  temp+"<p class='maintext'>"+hospitalselected.detailinfo[i].name+":"+hospitalselected.detailinfo[i].detail+"</p>";
        }

        temp=temp+"</div></li></div>";
        hospital_label = new BMap.Label(temp,{offset:new BMap.Size(24,-32),                //label的偏移量，为了让label的中心显示在点上
            position:new BMap.Point(parseFloat(hospitalselected.Longitude),parseFloat(hospitalselected.Latitude))});                                //label的位置
        hospital_label.setStyle({                                   //给label设置样式，任意的CSS都是可以的
            fontSize:"14px",               //字号
            border:"0",                 //宽
            textAlign:"left",            //文字水平居中显示
            lineHeight:"10px",            //行高，文字垂直居中显示
            background: "#000000",
            opacity: 0.8
        });

        maphandler.addOverlay(hospital_label);
        labellist.push({
            key:"Hospital_"+hospitalselected.id+"_"+hospitalselected.Name,
            label:hospital_label
        });

        $(".label_close_button").on('click',function(){
            var id=$(this).attr("id");
            console.log("close button click");
            remove_label(id);
        });
    }else{
        hospital_label.setPosition(new BMap.Point(parseFloat(hospitalselected.Longitude),parseFloat(hospitalselected.Latitude)));
        console.log("flash label");
        temp = "<div><p class='maintext'>id:"+
            hospitalselected.id+"</p>";
        temp =  temp+"<p class='maintext'>name:"+hospitalselected.Name+"</p>";
        temp =  temp+"<p class='maintext'>详细信息：</p>";
        for(i=0;i<hospitalselected.detailinfo.length;i++){
            temp =  temp+"<p class='maintext'>"+hospitalselected.detailinfo[i].name+":"+hospitalselected.detailinfo[i].detail+"</p>";
        }
        temp=temp+"</div>";
        $("#Hospital_"+
            hospitalselected.id+"_"+hospitalselected.Name+
            "_Content").empty();
        $("#Hospital_"+
            hospitalselected.id+"_"+hospitalselected.Name+
            "_Content").append(temp);
    }
}
function addhospital(hospital){
    // 创建图标对象
    //console.log("1");
    var hospitalIcon=new BMap.Icon("./image/hospital.png", new BMap.Size(32, 32));
    hospital_mark_click = function(){
        get_select_hospital(this.getTitle());
        if(hospitalselected == null) return;
        buildhospitallabel();
        /*
        var hospital_lable = new BMap.Label("<a class='maintext'>"+hospitalselected.id+":"+hospitalselected.Name+"</a>",{offset:new BMap.Size(-60,-60),                  //label的偏移量，为了让label的中心显示在点上
            position:new BMap.Point(parseFloat(hospitalselected.Longitude),parseFloat(hospitalselected.Latitude))});                                //label的位置
        hospital_lable.setStyle({                                   //给label设置样式，任意的CSS都是可以的
            fontSize:"14px",               //字号
            border:"0",                    //边
            height:"120px",                //高度
            width:"125px",                 //宽
            textAlign:"center",            //文字水平居中显示
            lineHeight:"120px",            //行高，文字垂直居中显示
            background: "#000000",
            opacity: 0.9
        });*/

    };


    for(var i=0;i<hospitallist.length;i++){
        //console.log("i="+i);

        var hospital_point = new BMap.Point(parseFloat(hospitallist[i].Longitude),parseFloat(hospitallist[i].Latitude));
        var hospital_marker = new BMap.Marker(hospital_point, {icon: hospitalIcon,zIndex:30});
        hospital_marker.setTitle(hospitallist[i].id+":"+hospitallist[i].Name);

        hospital_marker.setZIndex(20);
        //maphandler.addOverlay(hospital_lable);
        //hospital_marker.setTitle("<p class='maintext'>"+hospitallist[i].id+":"+hospitallist[i].Name+"</p>");
        removehospitalmarker(hospitallist[i].id+":"+hospitallist[i].Name);
        maphandler.addOverlay(hospital_marker);

        hospital_marker.addEventListener("click", hospital_mark_click);
        hospitalmarklist.push(hospital_marker);

    }

}
function make_ambulance_label_key(ambulance){
    return "Ambulance_"+ambulance.id+"_"+ambulance.Name;
}
function flash_ambulance_label(ambulance_list){
    for(var i=0;i<ambulance_list.length;i++){
        //var localkey=make_ambulance_label_key(ambulance_list[i]);
        var ambulance_label = search_label(make_ambulance_label_key(ambulance_list[i]));
        if(ambulance_label !== null){
            console.log("find open label, key="+make_ambulance_label_key(ambulance_list[i]));
            ambulanceselected = ambulance_list[i];
            buildambulancelabel();
        }
    }
}
function get_select_ambulance(title){
    var temp = title.split(":");
    for(var i=0;i<ambulancelist.length;i++){
        if(ambulancelist[i].id == temp[0]){
            ambulanceselected = ambulancelist[i];
            return;
        }
    }
    ambulanceselected = null;
    return;
}
function removeambulancemarker(title){
    for(var i=0;i<ambulancemarklist.length;i++){
        if(ambulancemarklist[i].marker.getTitle() == title){
            var marker = ambulancemarklist[i];
            ambulancemarklist.splice(i,1);
            maphandler.removeOverlay(marker.marker);
            maphandler.removeOverlay(marker.linehandlerlist);
        }
    }
}
function buildambulancelabel(){
    if(ambulanceselected===null) return null;
    var ambulance_label = search_label("Ambulance_"+ambulanceselected.id+"_"+ambulanceselected.Name);
    var temp="";
    var i;
    if(ambulance_label === null){
        console.log("SHow label");
        temp = "<div style='padding: 10px;min-width:150px'><div class='pull-left' style='margin-top:5px'><b class='maintext' style='font-size: 18px;font-weight: bold'>救护单位</b></div><div class='pull-right' style='margin-top: -5px;margin-right: -7px'><a class='maintext label_close_button'  id='Ambulance_"+
            ambulanceselected.id+"_"+ambulanceselected.Name+
            "' >[x]</a></div><li id='Ambulance_"+
            ambulanceselected.id+"_"+ambulanceselected.Name+
            "_Content' style='margin-top: 10px;'><div><p class='maintext'>id:"+
            ambulanceselected.id+"</p>";
        temp =  temp+"<p class='maintext'>name:"+ambulanceselected.Name+"</p>";
        temp =  temp+"<p class='maintext'>详细信息：</p>";
        for(i=0;i<ambulanceselected.detailinfo.length;i++){
            temp =  temp+"<p class='maintext'>"+ambulanceselected.detailinfo[i].name+":"+ambulanceselected.detailinfo[i].detail+"</p>";
        }

        temp=temp+"</div></li></div>";
        ambulance_label = new BMap.Label(temp,{offset:new BMap.Size(24,-32),                //label的偏移量，为了让label的中心显示在点上
            position:new BMap.Point(parseFloat(ambulanceselected.Longitude),parseFloat(ambulanceselected.Latitude))});                                //label的位置
        ambulance_label.setStyle({                                   //给label设置样式，任意的CSS都是可以的
            fontSize:"14px",               //字号
            border:"0",                 //宽
            textAlign:"left",            //文字水平居中显示
            lineHeight:"10px",            //行高，文字垂直居中显示
            background: "#000000",
            opacity: 0.8
        });

        maphandler.addOverlay(ambulance_label);
        labellist.push({
            key:"Ambulance_"+ambulanceselected.id+"_"+ambulanceselected.Name,
            label:ambulance_label
        });

        $(".label_close_button").on('click',function(){
            var id=$(this).attr("id");
            console.log("close button click");
            remove_label(id);
        });
    }else{
        ambulance_label.setPosition(new BMap.Point(parseFloat(ambulanceselected.Longitude),parseFloat(ambulanceselected.Latitude)));
        console.log("flash label");
        temp = "<div><p class='maintext'>id:"+
            ambulanceselected.id+"</p>";
        temp =  temp+"<p class='maintext'>name:"+ambulanceselected.Name+"</p>";
        temp =  temp+"<p class='maintext'>详细信息：</p>";
        for(i=0;i<ambulanceselected.detailinfo.length;i++){
            temp =  temp+"<p class='maintext'>"+ambulanceselected.detailinfo[i].name+":"+ambulanceselected.detailinfo[i].detail+"</p>";
        }
        temp=temp+"</div>";
        $("#Ambulance_"+
            ambulanceselected.id+"_"+ambulanceselected.Name+
            "_Content").empty();
        $("#Ambulance_"+
            ambulanceselected.id+"_"+ambulanceselected.Name+
            "_Content").append(temp);
    }
}
function addambulance(ambulance){
    // 创建图标对象

    ambulance_mark_click = function(){
        get_select_ambulance(this.getTitle());
        if(ambulanceselected == null) return;
        buildambulancelabel();
        /*
         get_select_soldier(this.getTitle());
         var sContent = this.getTitle();
         var infoWindow = new BMap.InfoWindow(sContent,{offset:new BMap.Size(0,-23),width:300,height:300});
         //infoWindow.setWidth(600);
         //infoWindow.setHeight(500);
         soldierwindowhandler = infoWindow;
         this.openInfoWindow(infoWindow);
         infoWindow.addEventListener("close",function(){
         if(soldierwindowhandler == this) soldierwindowhandler = null;
         });*/
    };
    for(var i=0;i<ambulancelist.length;i++){
        var myIcon=new BMap.Icon("./image/ambulance_small.png", new BMap.Size(16, 16));
        var t_point = new BMap.Point(parseFloat(ambulancelist[i].Longitude),parseFloat(ambulancelist[i].Latitude));
        var marker = new BMap.Marker(t_point, {icon: myIcon,zIndex:40});
        marker.setTitle(ambulancelist[i].id+":"+ambulancelist[i].Name);
        removeambulancemarker(ambulancelist[i].id+":"+ambulancelist[i].Name);
        marker.setZIndex({zIndex:30});
        maphandler.addOverlay(marker);

        marker.addEventListener("click", ambulance_mark_click);
        //console.log(ambulancelist[i]);
        var linehandlerlist = [];
        for(var k=0;k<ambulancelist[i].router.length;k++) {
            linehandlerlist.push(new BMap.Point(parseFloat(ambulancelist[i].router[k].Longitude),parseFloat(ambulancelist[i].router[k].Latitude)));
        }
        //console.log("lines points:"+linehandlerlist.length);
        var polyline = new BMap.Polyline(
            linehandlerlist,
            {strokeColor:"#ADFF2F",//设置颜色
            strokeWeight:3, //宽度
            strokeOpacity:1});//透明度
        //polyline.setZIndex(20);
        maphandler.addOverlay(polyline);
        ambulancemarklist.push({marker:marker,linehandlerlist:polyline});
    }

}