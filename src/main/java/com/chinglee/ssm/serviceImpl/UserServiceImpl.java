package com.chinglee.ssm.serviceImpl;

import com.chinglee.ssm.mapper.UserMapper;
import com.chinglee.ssm.pojo.User;
import com.chinglee.ssm.pojo.UserExample;
import com.chinglee.ssm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;


public class UserServiceImpl implements UserService {
    @Autowired
    UserMapper userMapper;

    /*
        查询所有员工
     */
    public List<User> getAllUser() {
        return userMapper.selectByExample(null);
    }

    /**
     * 保存员工信息
     * @param user
     */
    public void saveUser(User user) {
        userMapper.insertSelective(user);
    }

    /**
     * 校验用户名是否存在
     * @param userName
     * 数据库没有这条记录，count==0，返回true
     */
    public Boolean checkUserName(String userName) {
        UserExample example=new UserExample();
        UserExample.Criteria criteria=example.createCriteria();
        criteria.andUsernameEqualTo(userName);
        long count=userMapper.countByExample(example);
        return count==0;
    }

    /**
     * 员工更新方法
     * @param user
     */
    public void updateUser(User user) {
        userMapper.updateByPrimaryKeySelective(user);
    }

    /**
     * 员工删除方法（单个）
     * @param id
     */
    public void deleteUser(Integer id) {
        userMapper.deleteByPrimaryKey(id);
    }

    /**
     * 员工批量删除
     * @param useridList
     */
    public void deleteBatchUser(List<Integer> useridList) {
        UserExample example=new UserExample();
        UserExample.Criteria criteria=example.createCriteria();
        criteria.andUseridIn(useridList);
        userMapper.deleteByExample(example);
    }
}
