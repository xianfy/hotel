layui.use('element', function(){
    var element = layui.element;
});
layui.use('form', function(){
    form = layui.form;
    //监听提交
    form.on('submit(formDemo)', function(data){
        $("form#formAdd input[type='radio']:checked").each(function(){
            data.field[$(this).attr('name')] = $(this).attr('title')
        });
        layer.msg(JSON.stringify(data.field));
        return false;
    });
    form.on('radio(filter)', function(data){
        // $('.editradio input').removeAttr('checked');
        // $(data.elem).attr('checked','checked')
        console.log(data.elem); //得到radio原始DOM对象
        console.log(data.value); //被点击的radio的value值
        console.log(data.title);
        console.log(data.elem[data.elem.radio].dataset);
        console.log(data.elem[data.elem.radioValue].value);
    });
    form.on('select(filter)', function(data){
        console.log(data.elem); //得到select原始DOM对象
        console.log(data.value); //得到被选中的值
        console.log(data.othis); //得到美化后的DOM对象
        console.log(data.elem[data.elem.select].dataset.idx);
        console.log(data.elem[data.elem.selectedIndex].text);
    });

});
var oAddBtn = document.querySelector('.addBtn');
var oAddBox = document.querySelector('#alert');
var oEditBox =document.querySelector('#editBox');
var oSearchInp = document.querySelector('.searchInp');
var tbody =document.querySelector('tbody');
var oSearchBtn = document.querySelector('.searchBtn');

var laypage;
var page=1;
// var num=10;
var num=8;
var id;
var from;
var addRoomId=document.querySelector('.addRoomId');
var addRoomName=document.querySelector('.addRoomName');

var editId=document.querySelector('.editId');
var editName=document.querySelector('.editName');


//获取数据的函数
function getCon() {
    $.ajax({
        url:'/api/hotel/room/roomSearch',//后台地址
        type:'post',
        data:{
            number:num,
            page:page,
            num:oSearchInp.value,
        },
        success:function (result) {
            var res = JSON.parse(result);
            console.log(res);
            tbody.innerHTML='';//将整个页面的数据清空
            for (var  i=0;i<res.list.length;i++){//添加页面元素
                //console.log(res.list[i]);
                //父级.appendChild(子级) 向父级的最后面添加子级
                var otr = document.createElement('tr');
                otr.dataset.id=res.list[i].id;
                var str;
                if (res.list[i].isUse==0){
                     str="上架"
                }else{
                     str="下架"
                }
                otr.innerHTML=`<td>${res.list[i].roomType.name}</td>
            <td>${res.list[i].num}</td>
            <td>${str}  
                <!-- <form class="layui-form" action="">
                <input type="checkbox" name="zzz" lay-skin="switch" lay-text="上架|下架" ${res.list[i].isUse==0? "checked":''}
                 </form>-->
                </td>
            <td>
                <button type="button" class="layui-btn  editBtn">编辑</button>
                <button type="button" class="layui-btn layui-btn-danger delBtn">删除</button>
            </td>`;
                tbody.appendChild(otr);
            }

            layui.use('laypage',function () {
                laypage=layui.laypage;
                //执行一个laypage实例
                laypage.render({
                    elem: 'pageBar',//注意，这里的 test1 是 ID，不用加 # 号
                    count: res.data, //数据总数，从服务端得到
                    curr:page,
                    jump:function (obj, first) {
                        //obj包含了当前分页的所有参数，比如：
                        console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                        page = obj.curr;
                        console.log(first);
                        if (!first) {
                            getCon();

                        }
                    }
                })
            })
            layui.use('form', function(){
                form = layui.form;})
        }
    })
}

//获取数据库的房型数据
function room_type(){
    $.ajax({
        url:'/api/hotel/roomType/roomTypeSearchAll',
        type:'get',
        data:{
            id:id,
            name:name
        },
        success:function (result) {
            var res =JSON.parse(result)
            console.log(res);
            // addRoomName.innerHTML='';
            for(var i=0;i<res.data.length;i++){
                var otr =document.createElement('option');
                otr.value=res.data[i].id;
                otr.text=res.data[i].name
                addRoomName.appendChild(otr);
            }
            for(var i=0;i<res.data.length;i++){
                var otr =document.createElement('option');
                otr.value=res.data[i].id;
                otr.text=res.data[i].name
                // addRoomName.appendChild(otr);
                editName.appendChild(otr);
            }
        }
    })
}

room_type();
// room_type1();

//新增
oAddBtn.onclick=function(){
    layer.open({
        title:'新增房间',
        type: 1,
        content:$(oAddBox),
        area: ['500px', '400px'],
        btn: ['确定','取消'],
        yes:function (index, layero) {
            var isuseChecked = $('.roomRadio input[name="isuse"]:checked').val()
            location.reload();
            $.ajax({
                url:'/api/hotel/room/roomAdd',//后台地址
                type:'post',
                data:{
                    num:addRoomId.value,//房间编号
                    state:2,       //默认发送2即空闲
                    roomTypeId:addRoomName.value,  //房型号的id
                    isUse:isuseChecked //房间上、下架
                },
                success:function (res) {
                    // console.log(res);
                    if (res.code==200){

                        getCon();
                    }
                }
            })
            // alert('点击添加了');
            layer.close(index);
        }
    })
}

//编辑
tbody.addEventListener('click',function (ev) {
    var oParent = ev.target.parentNode.parentNode
    if (ev.target.className == 'layui-btn  editBtn') {
        id = ev.target.parentNode.parentNode.dataset.id;
        editId.value = oParent.children[1].innerHTML;
        editName.value = oParent.children[0].innerHTML;

        layer.open({
            type: 1,
            title: '编辑房型',
            area: ['600px', '360px'],
            content: $(oEditBox),
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                var isuseChecked = $('.editradio input[name="isuse"]:checked').val()
                location.reload();
                $.ajax({
                    url: '/api/hotel/room/roomEdit',
                    type: 'post',
                    data: {
                        id: id,   //房间主键
                        num: editId.value,  //房间编号
                        roomTypeId: editName.value, //房型号的id
                        isUse:isuseChecked,
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            getCon();
                        }

                    }
                })
                layer.close(index);
            }
        });
    }
});
//删除
tbody.addEventListener('click',function (ev) {
    id =ev.target.parentNode.parentNode.dataset.id;
    if(ev.target.className=='layui-btn layui-btn-danger delBtn'){
        layer.open({
            type:0,
            title: '删除房型',
            content: '确定要删除此房型吗?',
            btn: ['确定','取消'],
            yes:function (index,layero){
                location.reload();
                $.ajax({
                    url:'/api/hotel/room/roomDel',//后台地址
                    type:'post',
                    data:{
                        id:id
                    },
                    success:function (res) {
                        if (res.code==200){
                            getCon();
                        }
                    }
                });
                layer.close(index);
            }
        })
    }

})

//获取第一页数据;发送ajax
getCon();


//点击搜索的时候
oSearchBtn.onclick =function () {
    getCon();
}