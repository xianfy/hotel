function json2url(json) {
    //{a:1,b:2}
    var res='';
    var arr=[]; //'a=1' 'b=2'
    json.t=Math.random();
    for(var key in json){
        arr.push(key+'='+json[key])
    }
    res=arr.join('&');
    return res;
}

function ajax(json) {
    if(!json){
        alert('需要传值');
        return
    }
    //默认值的设定
    if(!json.url){
        alert('后台的地址必填项');
        return
    }
    json.type=json.type || 'get';
    json.data=json.data || {};

    //1、创建一个ajax对象
    var oAjax=new XMLHttpRequest();
    //.toLowerCase() 转换成小写
    switch (json.type.toLowerCase()){
        case 'get':
            //2、创建链接   oAjax.open('请求的方式','请求的地址',是否异步)
            oAjax.open('get',json.url+'?'+json2url(json.data),true)
            //3、发送
            oAjax.send();
            break;
        case 'post':
            //2、创建链接   oAjax.open('请求的方式','请求的地址',是否异步)
            oAjax.open('post',json.url,true);
            //请求头的类型
            oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            //3、发送
            oAjax.send(json2url(json.data));
            break;
    }

    //4.等待接收消息
    oAjax.onreadystatechange=function () {
        if(oAjax.readyState==4){//通讯已经完成，数据全部接收
            if(oAjax.status>=200 && oAjax.status<300 || oAjax.status==304){//网络状态是成功
                /*console.log(oAjax.responseText)*/
                json.success && json.success(oAjax.responseText);
            }else{
                json.error && json.error(oAjax.status);
            }
        }
    }
}