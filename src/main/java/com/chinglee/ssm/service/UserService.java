package com.chinglee.ssm.service;

import com.chinglee.ssm.pojo.User;

import java.util.List;

/**
 * Created by Administrator on 2017/11/15 0015.
 */
public interface UserService {
    public List<User> getAllUser();

    void saveUser(User user);

    Boolean checkUserName(String userName);

    void updateUser(User user);

    void deleteUser(Integer id);

    void deleteBatchUser(List<Integer> useridList);
}
