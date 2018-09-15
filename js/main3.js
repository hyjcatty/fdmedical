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
var ambulanceroute1list=[];
var ambulanceroute2list=[];
var ambulanceroutelist=[];
var ifseekingroute=false;
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
    drawImg(18);
    $(".label_close_button").on('click',function(){
        var id=$(this).attr("id");
        console.log("close button click");
        remove_label(hospital_label);
    });
    var runcycle=setInterval(addroute,250);
    setInterval(function(){  // 添加定时器，每1.5s进行转换
        $("#roll").find("ul:first").animate({
            marginTop:"-40px"
        },500,function(){

            $(this).css({marginTop:"0px"}).find("li:first").appendTo(this);
            $(this).find("li:first").appendTo(this);
        });
    },1500);


    setInterval(function(){ tableInterval();},800);

    setTimeout(function() {
        $(".legendLabel").css("color", "#FFFFFF");
        },3000);
    get_size_and_location();

};
function get_size_and_location(){
    var header_size = $(".navbar:first").height();
    //console.log("Head_height:"+header_size);
    var left_size = $("#leftrow").width();
    $("#leftrow,#MainStatistic,#MainNote").css("top",parseInt(header_size)+15);
    $("#MainStatistic").css("left",parseInt(left_size)+15);
    //console.log("Left_width:"+left_size);
}
function initialize(){
    $("#ArmyMap").css("height",winHeight);//min = 530
    $("#centerblock").css("min-height",winHeight*0.6);//min = 530
    //get_city(geoinfo.latitude,geoinfo.longitude);
    maphandler = new BMap.Map("ArmyMap",{mapType:BMAP_NORMAL_MAP});
    maphandler.setMapStyle({styleJson:[
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": {
                "color": "#021019"
            }
        },
        {
            "featureType": "highway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "highway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#147a92"
            }
        },
        {
            "featureType": "arterial",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "arterial",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#0b3d51"
            }
        },
        {
            "featureType": "local",
            "elementType": "geometry",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "land",
            "elementType": "all",
            "stylers": {
                "color": "#08304b"
            }
        },
        {
            "featureType": "railway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "railway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#08304b"
            }
        },
        {
            "featureType": "subway",
            "elementType": "geometry",
            "stylers": {
                "lightness": -70
            }
        },
        {
            "featureType": "building",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#857f7f"
            }
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "building",
            "elementType": "geometry",
            "stylers": {
                "color": "#022338"
            }
        },
        {
            "featureType": "green",
            "elementType": "geometry",
            "stylers": {
                "color": "#062032"
            }
        },
        {
            "featureType": "boundary",
            "elementType": "all",
            "stylers": {
                "color": "#1e1c1c"
            }
        },
        {
            "featureType": "manmade",
            "elementType": "geometry",
            "stylers": {
                "color": "#022338"
            }
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#2da0c6",
                "visibility": "on"
            }
        }
    ]});
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
        var url = './image/bluelight.png';     //根据当前坐标，选取合适的瓦片图
        return url;
    };
    //maphandler.addTileLayer(tileLayer);
}
function initialize_statistic(){
    var temp="<div><p class='maintext' style='font-size:24px;'><span class='maintext'>战场统计</span></p>" +
        "<table style='margin:10px'><tbody>" +
        "<tr><td><p  class='maintext'>野战医院：</p></td>"+"<td><p  class='maintext'>▓▓▓▓</p></td></tr>"+
        "<tr><td><p  class='maintext'>手术组：</p></td>"+"<td><p  class='maintext'>▓▓▓</p></td></tr>"+
        "<tr><td><p  class='maintext'>重伤救治组：</p></td>"+"<td><p  class='maintext'>▓▓▓▓▓</p></td></tr>"+
        "<tr><td><p  class='maintext'>轻伤处置组：</p></td>"+"<td><p  class='maintext'>▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</p></td></tr>"+
        "<tr><td><p  class='maintext'>主药品库存：</p></td>"+"<td><p  class='maintext'>▓▓▓▓▓▓▓▓▓▓▓▓</p></td></tr>"+
        "<tr><td><p  class='maintext'>伤兵救治率：</p></td>"+"<td><p  class='maintext'>▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</p></td></tr>"+
        "</tbody></table></table>";
    $("#MainStatistic").empty();
    $("#MainStatistic").append(temp);

}
function initialize_guild(data){

    var temp="";
    if(data.error !=0){
        temp=temp+"<div><div><p class='maintext' style='font-size:48px;text-align:center;'><i class='fa fa-empire' ></i></p></div>";
        temp=temp+"<p class='maintext'>获取天气失败</p>";
        temp=temp+"<p class='maintext'><a class='pull-right'><span class='maintext'>more</span></a></p>";
        temp=temp+"</div>";
    }else{
        temp=temp+"<div><div><p class='maintext' style='font-size:48px;text-align:center;'><i class='fa fa-empire' ></i></p></div>";
        temp=temp+"<p class='maintext'>天气：  "+data.results[0].weather_data[0].weather+"</p>";
        temp=temp+"<p class='maintext'>气温：  "+data.results[0].weather_data[0].temperature+"</p>";
        temp=temp+"<p class='maintext'>颗粒物： "+data.results[0].pm25+"</p>";
        temp=temp+"<p class='maintext'><a class='pull-right'><span class='maintext'>more</span></a></p>";
        temp=temp+"</div>";
    }

    $("#MainGuild").empty();
    $("#MainGuild").append(temp);
}

function initialize_config(){
    var temp="";
    temp=temp+"<div><div><p class='maintext' style='font-size:24px;'><i class='fa fa-cog' ></i><span class='maintext'>系统配置</span></p></div>";

    temp=temp+"</div>";
    $("#SysConfig").empty();
    $("#SysConfig").append(temp);
}

function initialize_note(){
    var temp="";
    temp=temp+"<div><div><p class='maintext' style='font-size:24px;'><i class='fa fa-flag' ></i><span class='maintext'>图标说明</span></p></div>";
    temp=temp+"<p class='maintext'><img src='./image/heath_small.png' style='width:16px;hight:16px'/><span class='maintext' style='margin-left: 25px'>士兵</span></p>";
    temp=temp+"<p class='maintext'><img src='./image/wounded_small.png' style='width:16px;hight:16px'/><span class='maintext' style='margin-left: 25px'>伤员</span></p>";
    temp=temp+"<p class='maintext'><img src='./image/treated_small.png' style='width:16px;hight:16px'/><span class='maintext' style='margin-left: 25px'>已治疗</span></p>";
    temp=temp+"<p class='maintext'><img src='./image/injury_small.png' style='width:16px;hight:16px'/><span class='maintext' style='margin-left: 25px'>重伤</span></p>";
    temp=temp+"<p class='maintext'><img src='./image/dead_small.png' style='width:16px;hight:16px'/><span class='maintext' style='margin-left: 25px'>死亡</span></p>";
    temp=temp+"<p class='maintext'><img src='./image/ambulance_small.png' style='width:16px;hight:16px'/><span class='maintext' style='margin-left: 25px'>救护车</span></p>";
    temp=temp+"<p class='maintext'><img src='./image/hospital.png' style='width:24px;hight:24px'/><span class='maintext' style='margin-left: 17px'>医疗点</span></p>";
    temp=temp+"<p class='maintext'><img src='./image/line_small.png' style='width:16px;hight:16px'/><span class='maintext' style='margin-left: 25px'>救治路线</span></p>";

    temp=temp+"</div>";
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
    winHeight =window.innerHeight;
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
function clearambulanceroute1(){
    for(var i=0;i<ambulanceroute1list.length;i++){
        maphandler.removeOverlay(ambulanceroute1list[i]);
    }
    ambulanceroute1list=[];
}
function clearambulanceroute2(){
    for(var i=0;i<ambulanceroute2list.length;i++){
        maphandler.removeOverlay(ambulanceroute2list[i]);
    }
    ambulanceroute2list=[];
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
    clearambulanceroute1();
    clearambulanceroute2();
    ambulanceroutelist=ambulancelist;
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
        //maphandler.addOverlay(polyline);
        ambulancemarklist.push({marker:marker,linehandlerlist:polyline});

/*
        var pointArr = [];
        pointArr[0]=linehandlerlist[0];
        pointArr[1]=t_point;
        pointArr[2]=linehandlerlist[linehandlerlist.length-1];
        var options = {
            onSearchComplete: function(results){
                var polyline=null;
                if (driving1.getStatus() == BMAP_STATUS_SUCCESS){
                    console.log("find route 1");
                    var plan = results.getPlan(0);
                    var pts = plan.getRoute(0).getPath();
                    var lineCor = "#1aea0a";
                    var lineSty = "solid";
                    polyline = new BMap.Polyline(pts,{strokeColor:lineCor, strokeWeight:3, strokeOpacity:0.8,strokeStyle:lineSty});
                    maphandler.addOverlay(polyline);
                    ambulanceroute1list.push(polyline);
                }else{
                    console.log("can not find route 1");
                }
            }
        };
        var driving1 = new BMap.DrivingRoute(maphandler,options);
        driving1.search(pointArr[0],pointArr[1]);
        var options2 = {
            onSearchComplete: function(results){
                var polyline = null;
                if (driving2.getStatus() == BMAP_STATUS_SUCCESS){

                    console.log("find route 2");
                    var plan = results.getPlan(0);
                    var pts = plan.getRoute(0).getPath();
                    var lineCor = "red";
                    var lineSty = "dashed";
                    polyline = new BMap.Polyline(pts,{strokeColor:lineCor, strokeWeight:3, strokeOpacity:0.8,strokeStyle:lineSty});
                    maphandler.addOverlay(polyline);

                    ambulanceroute1list.push(polyline);
                }else{
                    console.log("can not find route 2");
                }
            }
        };
        var driving2 = new BMap.DrivingRoute(maphandler,options2);
        driving2.search(pointArr[1],pointArr[2]);*/


    }

}
function addroute(){
    if(ambulanceroutelist.length==0){
        return;
    }
    if(ifseekingroute) return;
    ifseekingroute=true;
    //ar localroute = ambulanceroutelist[0];

    var localroute = ambulanceroutelist.shift();
    var t_point = new BMap.Point(parseFloat(localroute.Longitude),parseFloat(localroute.Latitude));
    var linehandlerlist = [];
    for(var k=0;k<localroute.router.length;k++) {
        linehandlerlist.push(new BMap.Point(parseFloat(localroute.router[k].Longitude),parseFloat(localroute.router[k].Latitude)));
    }
    var pointArr = [];
    pointArr[0]=linehandlerlist[0];
    pointArr[1]=t_point;
    pointArr[2]=linehandlerlist[linehandlerlist.length-1];
    var options = {
        onSearchComplete: function(results){
            var polyline=null;
            if (driving1.getStatus() == BMAP_STATUS_SUCCESS){
                console.log("find route 1");
                var plan = results.getPlan(0);
                var pts = plan.getRoute(0).getPath();
                var lineCor = "#1aea0a";
                var lineSty = "solid";
                polyline = new BMap.Polyline(pts,{strokeColor:lineCor, strokeWeight:3, strokeOpacity:0.8,strokeStyle:lineSty});
                maphandler.addOverlay(polyline);
                ambulanceroute1list.push(polyline);
            }else{
                console.log("can not find route 1");
            }
            var options2 = {
                onSearchComplete: function(results){
                    var polyline = null;
                    if (driving2.getStatus() == BMAP_STATUS_SUCCESS){

                        console.log("find route 2");
                        var plan = results.getPlan(0);
                        var pts = plan.getRoute(0).getPath();
                        var lineCor = "red";
                        var lineSty = "dashed";
                        polyline = new BMap.Polyline(pts,{strokeColor:lineCor, strokeWeight:3, strokeOpacity:0.8,strokeStyle:lineSty});
                        maphandler.addOverlay(polyline);

                        ambulanceroute2list.push(polyline);
                    }else{
                        console.log("can not find route 2");
                    }
                    ifseekingroute=false;
                }
            };
            var driving2 = new BMap.DrivingRoute(maphandler,options2);
            driving2.search(pointArr[1],pointArr[2]);
        }
    };
    var driving1 = new BMap.DrivingRoute(maphandler,options);
    driving1.search(pointArr[0],pointArr[1]);



}

function  drawImg(useryear){

    function range(s,e){
        var res =[];

        while(s!==e){
            res.push(s);
            if(s<e) s++;
            else s--;
            //s<e?(s++):(s--);
        }
        res.push(e); // or  res.push(s)
        return res;
    }

    var yearRange = range(14,35);


    var sick  = '0.003575   0.00371    0.00386    0.004025   0.00622    0.00844    0.009685   0.010965   0.014285   0.02665   0.05105   0.07605   0.10715    0.11773    0.100008345   0.07000899    0.05000968    0.020010435   0.0200113 0.01801232    0.01701353    0.01601496    ';

    var sickData = sick.split(/\s+/).map(function(item){return +item;});

    var BLUE = 'rgb(67,135,255)', FONT_COLOR = '#ffffff' , TOOL_COLOR = '#000000';

    var ctx = mychart.getContext('2d');

    var gradient = ctx.createLinearGradient(0,0,0,200);

    gradient.addColorStop(0,'rgba(50,101,191,0.75)');
    gradient.addColorStop(0.3,'rgba(50,101,191,0.5)');
    gradient.addColorStop(0.6,'rgba(50,101,191,0.25)');
    gradient.addColorStop(1,'rgba(50,101,191,0)');

    var linechartdata = {
        labels:yearRange,
        datasets:[{
            label:'阵亡率',
            data:sickData,
            backgroundColor: gradient,
            borderColor:BLUE,
            pointBackgroundColor: 'transparent',
            pointBorderColor: 'transparent',
            pointHoverBackgroundColor: 'rgba(0,0,0, .5)',
            borderWidth:2,
            lineTension:0,
        }]
    };


    var drawTooltip = function(year,chartbody){
        var realyear = year - 14;

        return function(){

            var label__year = '年龄：' + year + '岁', label__sick = '伤亡率：' + (100 * sickData[+realyear]).toFixed(1,10) + '%';

            var model = chartbody.chart.controller.getDatasetMeta(0).data[realyear]._model;

            var ctx = chartbody.chart.ctx;

            ctx.lineWidth = 2;

            ctx.strokeStyle = 'rgba(67,135,255,.4)';

            ctx.fillStyle = '#fff';

            ctx.beginPath();

            ctx.arc(model.x,model.y,6,0,2*Math.PI);

            ctx.closePath();

            ctx.stroke();

            ctx.fill();

            ctx.lineWidth = 3;

            ctx.strokeStyle = BLUE + '';

            ctx.beginPath();

            ctx.arc(model.x,model.y,3.5,0,2*Math.PI);

            ctx.closePath();

            ctx.stroke();

            ctx.strokeStyle = TOOL_COLOR;

            ctx.fillStyle = TOOL_COLOR;

            var rectX = model.x, rectY = model.y - 20;

            var rectWidth = 40, rectHeight = 30;

            var cornerRadius = 10, margin = 5, dist = 30;

            ctx.lineJoin = 'round';

            ctx.lineWidth = cornerRadius;

            ctx.strokeRect(rectX -2 * dist,rectY - dist , rectWidth + dist, rectHeight );

            ctx.fillRect(rectX  - 2 * dist,rectY - dist , rectWidth  + dist, rectHeight );

            ctx.font = '700 12px PingFangSC-Regular';

            ctx.fillStyle = FONT_COLOR;

            ctx.fillText(label__year,rectX -2 * dist,rectY - (dist/2) - margin);

            ctx.fillText(label__sick,rectX -2 * dist,rectY - (dist/2) + 2.5 * margin);

        };



    };




    var options = {
        animation:{
            easing:'easeInOutCubic',
            duration:100,
            onComplete:function(){
                var that = this;
                setTimeout(drawTooltip(useryear,that),100);
                $('#mychart').click(function(e) {
                    $('.chart--root').css('pointer-events','none');
                });

            }
        },
        tooltips: {
            enabled:false
        },
        layout: { padding: { top:10, left: 17, bottom: 15, right: 20 } },
        scales:{
            xAxes:[{
                borderColor:'transparent',
                ticks:{
                    fontColor:'#999',
                    fontFamily:'PingFangSC-Regular',
                    fontSize:10,
                    // maxTicksLimit:5,
                    autoSkip:false,
                    maxRotation:0,
                    callback:function(value){
                        if(value === 20 || value=== 40 ||value === 60 || value === 80 || value === 100){
                            return value + '岁';
                        }
                        else if(value===1){
                            return '年龄';
                        }
                        else return '';
                    },


                },
                gridLines:{
                    display:false,
                },

            }],
            yAxes:[{
                type:'linear',
                gridLines:{
                    color:'#e5e9f2',
                    lineWidth:0.5,
                    drawTicks:false,
                    drawBorder:false,
                    zeroLineColor:'transparent'
                },
                ticks:{
                    fontColor:'#999',
                    fontFamily:'PingFangSC-Regular',
                    fontSize:10,
                    maxTicksLimit:5,
                    callback:function(value){
                        return Math.round(+value*100)+'%';
                    }
                }
            }]
        },
        legend:{
            display:false,

        },
        elements:{
            point: {
                radius:0
            },
            line:{
                capBezierPoints:false,
            }
        }

    };



    var myline = new Chart(ctx,{
        type: 'line',
        data: linechartdata,
        options: options

    });

}

function addKeyFrame(){
    var ulObj = $("#roll ul"),  //获取ul对象
        length = $("#roll li").length,  //获取li数组长度
        per = 100 / (length / 2 * 2 );  //计算中间间隔百分比
    // 拼接字符串
    var keyframes = '\@keyframes ani{';
    for(var i = 0 ; i<=length ; i++ ){
        keyframes+='${i * per}%{margin-top: ${i % 2 == 0 ? -i * 20 : -(i - 1) * 20}px;}';
    }
    keyframes+='}';
    var liFirst = $("#roll li:first"),   //获取第一个元素
        liSec = liFirst.next();    //获取第二个元素
    ulObj.append(liFirst.clone()).append(liSec.clone());   //将两个元素插入到ul里面
    $("<style>").attr("type","text/css").html(keyframes).appendTo($("head"));    //创建style标签把关键帧插入到头部
    ulObj.css("animation","ani 5s linear infinite");  //给ul添加css3动画
}
function change(table){
    var row = table.insertRow(table.rows.length);//在table的最后增加一行,table.rows.length是表格的总行数
    for(j=0;j<table.rows[0].cells.length;j++){//循环第一行的所有单元格的数据，让其加到最后新加的一行数据中（注意下标是从0开始的）
        var cell = row.insertCell(j);//给新插入的行中添加单元格
        cell.height = "24px";//一个单元格的高度，跟css样式中的line-height高度一样
        cell.innerHTML = table.rows[0].cells[j].innerHTML;//设置新单元格的内容，这个根据需要，自己设置
    }
    table.deleteRow(0);//删除table的第一行
}
function tableInterval(){
    var table = document.getElementById("floattable");//获得表格
    change(table);//执行表格change函数，删除第一行，最后增加一行，类似行滚动
}