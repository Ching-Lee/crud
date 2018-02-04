package com.chinglee.ssm.controller;

import com.chinglee.ssm.pojo.Msg;
import com.chinglee.ssm.pojo.User;
import com.chinglee.ssm.service.UserService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 处理员工的增删改查
 */

@Controller
public class UserController {
     @Autowired
    private UserService userService;

    /**
     * 使用Ajax方式，返回json数据,获得所有数据库用户信息
     * @param pn
     * @return
     * 需要引入jackson包
     */
    @RequestMapping(value = "/users",method = RequestMethod.GET)
    @ResponseBody
    public Msg getUsersWithJson(@RequestParam(value = "pn",defaultValue="1")Integer pn){
        //这是一个分页查询
        //引入PageHelp分页插件
        //在查询之前只需要调用，传入页码，以及每页的大小
        PageHelper.startPage(pn,8);
        //startPage后面紧跟的查询就是分页查询
        List<User> userList= userService.getAllUser();
        //使用pageInfo包装查询后的结果，只需要将pageInfo交给页面就行了。
        //封装了详细的分页信息,传入连续显示的页数
        PageInfo pageInfo=new PageInfo(userList,5);
        return Msg.sucess().add("pageInfo",pageInfo);
    }

    /**
     * 用户保存
     * @return
     */
   @RequestMapping(value = "/users",method = RequestMethod.POST)
   @ResponseBody
   public Msg saveUser(@Valid User user, BindingResult result){
       if(result.hasErrors()){
          //校验失败，返回失败，模态框中显示失败
           Map<String,Object> map=new HashMap<String,Object>();
           List<FieldError> errors=result.getFieldErrors();
           for(FieldError fieldError:errors){
               System.out.println("错误的字段名"+fieldError.getField());
               System.out.println("错误信息"+fieldError.getDefaultMessage());
               map.put(fieldError.getField(),fieldError.getDefaultMessage());
           }
           return Msg.fail().add("errorFields",map);
       }else {
           userService.saveUser(user);
           return Msg.sucess();
       }

   }

    /**
     * 校验用户名
     */
    @RequestMapping(value = "/checkUser")
    @ResponseBody
    public Msg checkUserName(@RequestParam("userName") String userName){
        boolean b=userService.checkUserName(userName);
        if(b){
            return Msg.sucess();
        }else {
           return Msg.fail();
        }

    }

    /**
     * 修改员工信息（更新）
     */

    @RequestMapping(value = "/users/{userid}",method = RequestMethod.PUT)
    @ResponseBody
    public Msg updateUser(User user){
        System.out.print(user);
        userService.updateUser(user);
         return Msg.sucess();
     }


    /**
     * 删除员工信息
     *
     */
    @RequestMapping(value = "/users/{del_idstr}",method = RequestMethod.DELETE)
    @ResponseBody
    public Msg deleteUser(@PathVariable("del_idstr")String del_idstr){
        //批量删除
        if(del_idstr.contains("-")){
            List<Integer> useridList=new ArrayList<Integer>();
          String[] str_ids=del_idstr.split("-");
          for(String id_str:str_ids){
              useridList.add(Integer.parseInt(id_str));
          }
          userService.deleteBatchUser(useridList);
        }
        //单个删除
        else {
            Integer userid=Integer.parseInt(del_idstr);
            userService.deleteUser(userid);
        }

        return Msg.sucess();
    }


}
