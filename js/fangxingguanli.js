layui.use('element', function(){
    var element = layui.element;
});

var oAddBtn = document.querySelector('.addBtn');
var oAddBox = document.querySelector('#alert');
var oEditBox =document.querySelector('#editBox');
var oSearchInp = document.querySelector('.searchInp');
var tbody =document.querySelector('tbody');
var oSearchBtn = document.querySelector('.seachBtn');
var laypage;
var page=1;
// var num=10;
var num=8;
var id;
var addRoomName=document.querySelector('.addRoomName');
var addRoomPrice=document.querySelector('.addRoomPrice');
var addRoomMsg=document.querySelector('.addRoomMsg');

var editName=document.querySelector('.editName');
var editPrice=document.querySelector('.editPrice');
var editMsg=document.querySelector('.editMsg');
layui.use('form', function(){
    var form = layui.form;
    //监听提交
    form.on('submit(formDemo)', function(data){
        layer.msg(JSON.stringify(data.field));
        return false;
    });
});

//获取数据的函数
function getCon() {
    $.ajax({
        url:'/api/hotel/roomType/roomTypeSearch',//后台地址
        type:'post',
        data:{
            name: oSearchInp.value,
            page:page,
            num:num
        },
        success:function (result) {
            var res = JSON.parse(result);
            console.log(res);
            tbody.innerHTML='';//将整个页面的数据清空
            for (var i=0;i<res.data.length;i++){
                //父级.appendChild(子级) 向父级的最后面添加子级
                var otr = document.createElement('tr');
                otr.dataset.id=res.data[i].id;
                otr.innerHTML=`<td>${res.data[i].name}</td>
            <td>${res.data[i].price}</td>
            <td>${res.data[i].msg}</td>
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
                    count:res.number,//res.total, //数据总数，从服务端得到
                    curr:page,
                    jump:function (obj, first) {
                        //obj包含了当前分页的所有参数，比如：
                        console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                        page = obj.curr;
                        //getCon();
                        console.log(first);
                        //首次不执行
                        if (!first) {
                            //do something
                            getCon();
                        }
                    }
                })
            })
        }
    })


}

//新增
oAddBtn.onclick=function(){

        layer.open({
            title:'新增房间',
            type: 1,
            content:$(oAddBox),
            area: ['500px', '400px'],
            btn: ['确定','取消'],
            yes:function (index, layero) {
                window.location.reload();
                $.ajax({
                    url:'/api/hotel/roomType/roomTypeAdd',//后台地址
                    type:'post',
                    data:{
                        name:addRoomName.value,
                        price:addRoomPrice.value,
                        msg:addRoomMsg.value
                    },
                    success:function (res) {
                        // console.log(res);
                        if (res.code==200){
                            getCon();
                            window.location.href=window.location.href;
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
        editName.value = oParent.children[0].innerHTML;
        editPrice.value = oParent.children[1].innerHTML;
        editMsg.value = oParent.children[2].innerHTML;

        layer.open({
            type: 1,
            title: '编辑房型',
            area: ['600px', '360px'],
            content: $(oEditBox),
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                window.location.reload();
                $.ajax({
                    url: '/api/hotel/roomType/roomTypeEdit',
                    type: 'post',
                    data: {
                        id: id,
                        name: editName.value,
                        price: editPrice.value,
                        msg: editMsg.value
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            alert('修改成功')
                            getCon()
                            location.reload(true);
                        }
                    }

                })
                //alert('修改成功')
                layer.close(index);

            },
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
                window.location.reload();
                $.ajax({
                    url:'/api/hotel/roomType/roomTypeDel',//后台地址
                    type:'post',
                    data:{
                        roomTypeId:id
                    },
                    success:function (res) {
                        if (res.code==200){
                            alert('删除成功！');
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