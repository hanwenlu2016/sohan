这是一个开源的web电脑管理系统/python+django+brt4+mysql 写的很low请见谅


1 git 项目之后需要安装依赖库 

pip3 install -r requirements.txt    -i https://pypi.douban.com/simple  #豆瓣源安装 (pip3 install freeze 先安装）

2 建立数据库 sohan 执行sql文件

3 在settings 136行配置日志目录 

4 在settings 配置邮件发送账号 

5 在views.py 183行设置收发邮件账号 

6 启动项目 python3 manage.py runserver 0.0.0.0:8000 
登录账号  admin  密码 sohan2016

7 部署到服务器 Nginx+Uwsgi 自己百度

##################################################################
以下是效果图

![登录](https://github.com/hanwenlu2016/sohan/blob/master/mdgimgs/1.png)

![登录](https://github.com/hanwenlu2016/sohan/blob/master/mdgimgs/0.png)

![登录](https://github.com/hanwenlu2016/sohan/blob/master/mdgimgs/2.png)

![登录](https://github.com/hanwenlu2016/sohan/blob/master/mdgimgs/3.png)

![登录](https://github.com/hanwenlu2016/sohan/blob/master/mdgimgs/4.png)

![登录](https://github.com/hanwenlu2016/sohan/blob/master/mdgimgs/5.png)

