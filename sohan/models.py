from django.db import models
from django.contrib.auth.models import AbstractUser
import django.utils.timezone as timezone


# AUTH_USER_MODEL = "APP名.UserProfile" 继承需要设置
class UserProfile(AbstractUser):
    # 继承AbstractUser
    class Meta:
        verbose_name = '用户信息'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.username


# 职位
class Position(models.Model):
    position_name = models.CharField(max_length=10, verbose_name='职位')

    class Meta:
        db_table = 'position'
        verbose_name = '职位'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.position_name


# 员工信息
class Staff(models.Model):
    name = models.CharField(max_length=10, verbose_name='姓名')

    sex = models.CharField(max_length=10, choices=(('1', '男'), ('2', '女')), default='1', verbose_name='性别')

    phone = models.CharField(max_length=11, verbose_name='手机号码')

    department = models.CharField(max_length=10,
                                  choices=(
                                      ('1', '行政部'), ('2', '产品部'), ('3', '运营商业务部'), ('4', '充值业务部'), ('5', '财务部'),
                                      ('6', '智能饮水业务部'), (('7', '其它部门'))),
                                  verbose_name='部门')
    positions = models.ForeignKey(Position, on_delete=models.CASCADE, verbose_name='职位')

    rank = models.CharField(max_length=10, choices=(
        ('1', 'P1B'), ('2', 'P1A'), ('3', 'P2B'), ('4', 'P2A'), ('5', 'P3B'), ('6', 'P3A'), ('7', 'P4B'),
        ('8', 'P4A'), ('9', 'P5B'), ('10', 'P5A'), ('11', 'P6B'), ('12', 'P6A'), ('13', '未评级'),
        ('14', 'boss')), default='null', verbose_name='职级')

    user_state = models.CharField(max_length=10, choices=(('1', '在职'), ('2', '离职')), default='1',
                                  verbose_name='在职状态')

    com_time = models.DateTimeField(verbose_name='入职时间', default=timezone.now)
    out_time = models.DateTimeField(verbose_name='离职时间', auto_now=True)

    complete_state = models.BooleanField(verbose_name='分配状态', default=False)  # 默认是没有分配

    tag = models.TextField(default='正常入职', verbose_name='备注')


    class Meta:
        db_table = 'staff'
        verbose_name = '员工信息'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name


# 笔记本品牌
class Brand(models.Model):
    brand_name = models.CharField(max_length=50, verbose_name='品牌型号')

    class Meta:
        db_table = 'brand'
        verbose_name = '品牌型号'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.brand_name


# CPU
class Cpu(models.Model):
    cpu_name = models.CharField(max_length=50, verbose_name='CPU型号')

    class Meta:
        db_table = 'cpu'
        verbose_name = 'CPU型号'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.cpu_name


# 硬盘组合
class Disk(models.Model):
    disk_name = models.CharField(max_length=50, verbose_name='硬盘组合')

    class Meta:
        db_table = 'disk'
        verbose_name = '硬盘组合'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.disk_name

# 笔记本信息
class Computer(models.Model):
    staff_name = models.ForeignKey(Staff, on_delete=models.CASCADE, verbose_name='员工信息')

    brands = models.ForeignKey(Brand, on_delete=models.CASCADE, verbose_name='电脑型号')

    disks = models.ForeignKey(Disk, on_delete=models.CASCADE, verbose_name='硬盘组合')

    memory = models.CharField(max_length=10,
                              choices=(
                                  ('4G', '4G'), ('6G', '6G'), ('8G', '8G'),('10G','10G'),('12G','12G'),('16G', '16G'), ('32G', '32G'),
                                  ('64G', '64G'),
                                  ('other', '其他'),),
                              verbose_name='内存大小')

    cpus = models.ForeignKey(Cpu, on_delete=models.CASCADE, verbose_name='cpu型号')

    screen_size = models.CharField(max_length=10,
                                   choices=(
                                       ('1', '12.5寸'), ('2', '13寸'), ('3', '14寸'), ('4', '15.6寸'), ('5', '22寸'),
                                       ('6', '24寸'), ('7', '32寸'), ('other', '其他')), default='3',
                                   verbose_name='屏幕尺寸')

    fiven_etwork = models.CharField(max_length=10, choices=(('no', '否'), ('yes', '是')), default='yes',
                                    verbose_name='5G网卡')

    mac = models.CharField(max_length=50, verbose_name='mac地址')

    os = models.CharField(max_length=10,
                          choices=(('1', 'win7_x32'), ('2', 'win7_x64'), ('3', 'win10_x64'), ('4', 'windons_2008_x64'),
                                   ('5', 'windons_2012_r2_x64'), ('6', 'ubuntu'), ('7', 'centos'), ('8', 'macos'),
                                   ('9', '其他')),default='3',
                          verbose_name='操作系统')

    allot_time = models.DateTimeField(verbose_name='分配时间', default=timezone.now)
    allot_times =  models.DateTimeField(verbose_name='修改时间', auto_now=True)

    state = models.CharField(max_length=10, choices=(('1', '使用中'), ('2', '空闲中'), ('3', '异常中')), default='1', verbose_name='状态')

    tag = models.TextField(default='使用1台', verbose_name='备注')

    class Meta:
        db_table = 'computer'
        verbose_name = '电脑信息'
        verbose_name_plural = verbose_name

    def __str__(self):
        return '电脑信息'  # 不可以返回外键
