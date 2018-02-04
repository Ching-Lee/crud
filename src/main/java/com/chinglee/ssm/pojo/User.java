package com.chinglee.ssm.pojo;

import javax.validation.constraints.Pattern;

public class User {
    private Integer userid;

    @Pattern(regexp = "^[a-zA-Z0-9\\u2E80-\\u9FFF]{2,16}$",message = "姓名是2-16位中英文、数字")
    private String username;

    @Pattern(regexp = "^[a-zA-Z0-9_-]{6,18}$",message = "密码是6-18位英文、数字")
    private String password;

    private String permission;

    private String department;

    @Pattern(regexp = "^[a-zA-Z0-9]{3,18}$",message = "工号是3-18位英文、数字")
    private String worknumber;

    private String sex;

    public Integer getUserid() {
        return userid;
    }

    public void setUserid(Integer userid) {
        this.userid = userid;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username == null ? null : username.trim();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission == null ? null : permission.trim();
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department == null ? null : department.trim();
    }

    public String getWorknumber() {
        return worknumber;
    }

    public void setWorknumber(String worknumber) {
        this.worknumber = worknumber == null ? null : worknumber.trim();
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex == null ? null : sex.trim();
    }

    @Override
    public String toString() {
        return "User{" +
                "userid=" + userid +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", permission='" + permission + '\'' +
                ", department='" + department + '\'' +
                ", worknumber='" + worknumber + '\'' +
                ", sex='" + sex + '\'' +
                '}';
    }
}