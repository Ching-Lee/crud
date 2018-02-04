//1.页面加载完成之后发送Ajax请求，要到分页数据

$(function () {
    var totalRecord,currentPage;
    //显示第一页
    to_page(1);
    //添加员工
    addUser();
    //修改用户
    reviseUser();
    //单个删除用户
    deleteUser();
    //批量删除
    deleteSomeUser();




    /**
     * 1.实现用户信息展示
     * @param pn
     */
   //显示员工信息
    function to_page(pn) {
        $.ajax({
            url: "/users.action",
            data: "pn=" + pn,
            type: "GET",
            success: function (result) {
                //1.解析并显示员工数据
                build_users_table(result);
                //2.解析并显示分页信息
                build_page_info(result);
                //3.解析并显示分页条数据
                build_page_nav(result);

            }
        })
    }
    //解析并显示员工数据表
    function build_users_table(result) {
        //清空table表格
        $("#users_table tbody").empty();
        var users = result.extend.pageInfo.list;
        //遍历元素users
        $.each(users, function (index, item) {
            var checkBox=$("<td><input type='checkbox' class='check_item'/></td>");
            var userId = $("<td></td>").append(item.userid);
            var userName = $("<td></td>").append(item.username);
            var password = $("<td></td>").append(item.password);
            var permission = $("<td></td>").append(item.permission);
            var depatment = $("<td></td>").append(item.department);
            var worknumber = $("<td></td>").append(item.worknumber);
            var sex = $("<td></td>").append(item.sex);

            var button1 = $("<button></button>").addClass("btn btn-primary btn-sm edit_btn").append($("<span></span>").addClass("glyphicon glyphicon-pencil").attr("aria-hidden", true)).append("编辑");
            var button2 = $("<button></button>").addClass("tn btn-danger btn-sm delete_btn").append($("<span></span>").addClass("glyphicon glyphicon-trash").attr("aria-hidden", true)).append("删除");
            var td_btn = $("<td></td>").append(button1).append(" ").append(button2);
            $("<tr></tr>").append(checkBox).append(userId).append(userName).append(sex).append(worknumber).append(depatment)
                .append(permission).append(password).append(td_btn ).appendTo("#users_table tbody");

        })
    }

//解析显示分页信息
    function build_page_info(result) {
        $("#page_info_area").empty();
        $("#page_info_area").append("当前" + result.extend.pageInfo.pageNum + "页,总共" + result.extend.pageInfo.pages +
            "页，总共" + result.extend.pageInfo.total + "条记录");
        totalRecord = result.extend.pageInfo.total;
        currentPage=result.extend.pageInfo.pageNum;
    }

//解析显示分页导航条
    function build_page_nav(result) {
        $("#page_nav_area").empty();
        var ul = $("<ul></ul>>").addClass("pagination");
        var firstPageLi = $("<li></li>").append($("<a></a>").append("首页").attr("href", "#"));
        var prePageLi = $("<li></li>").append($("<a></a>").append("&laquo;").attr("href", "#"));
        var nextPageLi = $("<li></li>").append($("<a></a>").append("&raquo;").attr("href", "#"));
        var lastPageLi = $("<li></li>").append($("<a></a>").append("末页").attr("href", "#"));
        //如果没有前一页，前一页和首页就不能点
        if (result.extend.pageInfo.hasPreviousPage == false) {
            firstPageLi.addClass("disabled");
            prePageLi.addClass("disabled");
        } else {
            //首页
            firstPageLi.click(function () {
                to_page(1);
            });
            prePageLi.click(function () {
                to_page(result.extend.pageInfo.pageNum - 1);
            });
        }
        if (result.extend.pageInfo.hasNextPage == false) {
            nextPageLi.addClass("disabled");
            lastPageLi.addClass("disabled");
        } else {
            //构建点击事件

            nextPageLi.click(function () {
                to_page(result.extend.pageInfo.pageNum + 1);
            });
            lastPageLi.click(function () {
                to_page(result.extend.pageInfo.lastPage);
            })
        }
        //添加首页和前一页
        ul.append(firstPageLi).append(prePageLi);
        //遍历添加页码
        $.each(result.extend.pageInfo.navigatepageNums, function (index, item) {
            var numLi = $("<li></li>").append($("<a></a>").append(item).attr("href", "#"));
            //如果是当前选中页面，添加active标识
            if (result.extend.pageInfo.pageNum == item) {
                numLi.addClass("active");
            }
            //给每个页码添加点击就跳转
            numLi.click(function () {
                to_page(item);
            });
            ul.append(numLi);
        });
        //添加下一页和末页
        ul.append(nextPageLi).append(lastPageLi);
        var navEle = $("<nav></nav>").append(ul);
        navEle.appendTo("#page_nav_area");


    }






    /**
     * 2.实现新增功能
     * @returns {boolean}
     */
    function addUser() {

        //为新增按钮添加modal
        $("#user_add_modal_btn").click(function () {
            //清除表单数据
            $("#userAddModal form")[0].reset();
            $("#userName_add_input").next("span").text("");
            $("#userAddModal").modal({
                backdrop: "static"
            })
        });

        //校验该用户是否存在,如果存在就不能添加该用户
        $("#userName_add_input").change(function () {
            var userName = $("#userName_add_input").val();
            //发送Ajax请求校验姓名是否可用
            $.ajax({
                url: "/checkUser.action",
                data: "userName=" + userName,
                type: "GET",
                success: function (result) {
                    //表示成功，用户名可用
                    if (result.code == 100) {
                        show_validate_msg($("#userName_add_input"), "success", "");
                        //为保存按钮添加属性
                        $("#user_save_btn").attr("ajax-va", "success");
                    } else if (result.code == 200) {
                        show_validate_msg($("#userName_add_input"), "error", "该员工姓名已存在");
                        $("#user_save_btn").attr("ajax-va", "error");
                    }
                }
            })
        });

        //保存用户信息
        $("#user_save_btn").click(function () {
            //先校验表单信息
            if (!validate_form( $("#userName_add_input"),$("#userPassword_add_input"),$("#worknumber_add_input"))) {
                return false;
            }
            //1.判断之前的ajax用户名校验是否成功
            if ($(this).attr("ajax-va") == "error") {
                return false;
            }
            //2.发送ajax请求保存员工
            $.ajax({
                url: "/users.action",
                type: "POST",
                data: $("#userAddModal form").serialize(),
                success: function (result) {
                    //员工保存成功(后端校验)
                    if (result.code == 100) {
                        //1.关闭modal框
                        $("#userAddModal").modal('hide');
                        //2.来到最后一页，显示刚才保存的数据
                        to_page(totalRecord);
                    } else {
                        //显示失败信息(后端校验)
                        if (result.extend.errorFields.username != undefined) {
                            show_validate_msg($("#userName_add_input"), "error", result.extend.errorFields.username);
                        }
                        if (result.extend.errorFields.password != undefined) {
                            show_validate_msg($("#userPassword_add_input"), "error", result.extend.errorFields.password);
                        }
                        if (result.extend.errorFields.worknumber != undefined) {
                            show_validate_msg($("#worknumber_add_input"), "error", result.extend.errorFields.worknumber);
                        }

                    }

                }
            });
        });

    }

    //校验表单信息是否满足正则要求
    function validate_form(Name_ele,password_ele,worknumber_ele) {
        //1.拿到要校验的数据，使用正则表达式
        //校验姓名
        var userName = Name_ele.val();
        //|(^[\u2E80-\u9FFF]{2,5})
        var regName = /^[a-zA-Z0-9\u2E80-\u9FFF]{2,16}$/;
        //如果验证失败
        if (!regName.test(userName)) {
            show_validate_msg(Name_ele, "error", "姓名2-16位中英文、数字");
            return false;
        } else {
            show_validate_msg(Name_ele, "success", "");
        }
        //检验密码
        var password = password_ele.val();
        var regPass = /^[a-zA-Z0-9_-]{6,18}$/;
        if (!regPass.test(password)) {
            show_validate_msg(password_ele, "error", "密码是6-18位英文、数字");
            return false;
        } else {
            show_validate_msg(password_ele, "success", "");
        }

        //检验工号
        var workNumber =worknumber_ele.val();
        var regWork = /^[a-zA-Z0-9]{3,18}$/;
        if (!regWork.test(workNumber)) {
            show_validate_msg(worknumber_ele, "error", "工号是3-18位英文、数字");
            return false;
        } else {
            show_validate_msg(worknumber_ele, "success", "");
        }
        return true;
    }
    //显示校验提示信息
    function show_validate_msg(ele, status, msg) {
        //清除当前元素校验状态
        $(ele).parent().removeClass("has-error has-success");
        $(ele).next("span").text("");
        if (status == "error") {
            ele.parent().addClass("has-error");
            ele.next("span").text(msg);
        } else if (status == "success") {
            ele.parent().addClass("has-success");
            ele.next("span").text(msg);
        }

    }


    /**
     * 3.修改用户
     */
    function reviseUser() {
        //为编辑按钮绑定弹出modal框事件
        //1.因为在按钮创建之前就绑定了click，所以用普通click方法绑定不上

        $(document).on("click",".edit_btn",function () {
            //清除表单数据
            $("#userReviseModal form")[0].reset();
            $("#userName_revise_input").next("span").text("");

           //修改框中用户信息回显
           var id= $(this).parent().parent().children("td").eq(1).text();
           //将id的值传递给修改按钮的属性，方便发送Ajax请求
            $("#user_revise_btn").attr("edit-id",id);
           var name=$(this).parent().parent().children("td").eq(2).text();
           var sex=$(this).parent().parent().children("td").eq(3).text();
           var worknumber=$(this).parent().parent().children("td").eq(4).text();
           var depart=$(this).parent().parent().children("td").eq(5).text();
           var permission=$(this).parent().parent().children("td").eq(6).text();
           var password=$(this).parent().parent().children("td").eq(7).text();
            $("#userName_revise_input").val(name);
            $("#worknumber_revise_input").val(worknumber);
            $("#department_revise_input").val(depart);
            $("#userPassword_revise_input").val(password);
            $("#userReviseModal input[name=sex]").val([sex]);
            $("#userReviseModal input[name=permission]").val([permission]);
            $("#userReviseModal").modal({
                backdrop: "static"
            })
        });
        //2.为模态框中的修改按钮绑定事件，更新员工信息
        $("#user_revise_btn").click(function () {
          //1.更新之前进行表单验证,验证没通过就直接返回
            if(!validate_form( $("#userName_revise_input"),$("#userPassword_revise_input"),$("#worknumber_revise_input"))){
                return false;
            }
            //2.验证通过后发送ajax请求保存更新的员工数据
            //如果要直接发送PUT之类的请求
            //在WEB.xml配置HttpPutFormContentFilter过滤器即可
            //这里未使用如上所述方法
            $.ajax({
                url:"/users/"+$(this).attr("edit-id")+".action",
                type:"POST",
                data:$("#userReviseModal form").serialize()+"&_method=PUT",
                success:function (result) {
                    //1.关闭modal框
                    $("#userReviseModal").modal('hide');
                    //2.来到当前页，显示刚才保存的数据
                    to_page(currentPage);
                    
                }
            })

        })
    }


    /**
     * 4.删除用户
     */
    function deleteUser() {
        $(document).on("click",".delete_btn",function () {
            //1.弹出确认删除对话框
            var username=$(this).parents("tr").find("td:eq(2)").text();
            var userid=$(this).parents("tr").find("td:eq(1)").text();
            if(confirm("确认删除【"+username+"】吗？")){
                //确认，发送ajax请求删除
                $.ajax({
                    url:"/users/"+userid+".action",
                    type:"DELETE",
                    success:function (result) {
                        alert(result.message);
                        to_page(currentPage);
                    }
                })


            }
        })
    }


    /**
     * 5.批量删除
     */
    function deleteSomeUser() {
        //1.实现全选全不选
        //attr获取checked是undefined
        //对于dom原生的属性要用prop读取和修改
        $("#check_all").click(function () {
            $(".check_item").prop("checked",$(this).prop("checked"));
        })

        //check_item
        $(document).on("click",".check_item",function () {
            //判断当前选中的条目个数
           var flag= $(".check_item:checked").length==$(".check_item").length;
           $("#check_all").prop("checked",flag);
        })

        //为批量删除按钮添加点击事件
        $("#user_delete_all_btn").click(function () {
            var userNames="";
            var del_idstr="";
            $.each($(".check_item:checked"),function () {
               userNames+=$(this).parents("tr").find("td:eq(2)").text()+",";
               //组装员工id字符串
                del_idstr+=$(this).parents("tr").find("td:eq(1)").text()+"-";
            });
            userNames=userNames.substring(0,userNames.length-1);
            del_idstr=del_idstr.substring(0,del_idstr.length-1);
            if(confirm("确认删除【"+userNames+"】吗")){
                //发送Ajax请求
                $.ajax({
                    url:"/users/"+del_idstr+".action",
                    type:"DELETE",
                    success:function (result) {
                        alert(result.message);
                        to_page(currentPage);
                    }

                });
            }

        })

    }


});