import xadmin
from xadmin import views
from sohan.models import Staff,Cpu,Disk,Brand,Computer,Position

# 基本的修改
class BaseSetting(object):
    enable_themes = True  # 打开主题功能
    use_bootswatch = True  #


# 默认样式设置
class GlobalSetting(object):
    site_title = 'hanwenlu'  # 头部标签
    site_footer = 'hanwenlu'  # 底部标签
    #menu_style = 'accordion'  # 模板样式

#职位
class PositionAdmin:
    model_icon = 'glyphicon glyphicon-align-justify'  # 图标
    list_display = (
        'id', 'position_name')  # 显示字段

    ordering = ('id',)  # 顺序排序 -id 表述降序

    list_per_page = 25  # 1页显示50

#员工信息
class StaffAdmin:
    model_icon = 'glyphicon glyphicon-user'  # 图标
    list_display = (
        'name', 'sex','phone','department', 'complete_state', 'positions', 'rank', 'user_state','com_time', 'tag')  # 显示字段

    ordering = ('id',)  # 顺序排序 -id 表述降序

    list_per_page = 25  # 1页显示50
    search_fields = [ 'name', 'sex','phone','department', 'rank']  # 搜索字段
    date_hierarchy = 'time_of'  # 详细时间分层筛选
    list_filter = (
         'name', 'sex','department', 'phone', 'positions','complete_state', 'rank', 'user_state','com_time', 'tag')  # 过滤器 显示最最右边

#cpu
class CpuAdmin:
    model_icon = 'fa fa-adjust'  # 图标
    list_display = (
        'id', 'cpu_name')  # 显示字段

    ordering = ('id',)  # 顺序排序 -id 表述降序

    list_per_page = 25  # 1页显示50

#笔记本品牌
class BrandAdmin:
    model_icon = 'glyphicon glyphicon-compressed'  # 图标
    list_display = (
        'id', 'brand_name')  # 显示字段

    ordering = ('id',)  # 顺序排序 -id 表述降序

    list_per_page = 25  # 1页显示50


# 笔记本信息
class ComputerAdmin:
    model_icon = 'glyphicon glyphicon-unchecked'  # 图标
    list_display = ('staff_name','brands','disks','memory','cpus','screen_size','fiven_etwork','mac','os','allot_time','state','tag'
       )  # 显示字段

    ordering = ('id',)  # 顺序排序 -id 表述降序

    list_per_page = 25  # 1页显示50
    search_fields = ['staff_name__name','brands__brand_name','disks__disk_name','memory','cpus__cpu_name','screen_size','fiven_etwork','mac','os','state','tag']  # 搜索字段

    list_filter = (
        'staff_name', 'brands', 'disks', 'memory', 'cpus', 'screen_size', 'fiven_etwork', 'mac', 'os',
        'state', 'tag' )  # 过滤器 显示最最右边

#硬盘组合
class DiskAdmin:

    model_icon = 'glyphicon glyphicon-hdd'  # 图标
    list_display = (
        'id', 'disk_name')  # 显示字段

    ordering = ('id',)  # 顺序排序 -id 表述降序

    list_per_page = 25  # 1页显示50


xadmin.site.register(views.BaseAdminView, BaseSetting)
xadmin.site.register(views.CommAdminView, GlobalSetting)
xadmin.site.register(Position,PositionAdmin)
xadmin.site.register(Staff, StaffAdmin)
xadmin.site.register(Cpu, CpuAdmin)
xadmin.site.register(Brand, BrandAdmin)
xadmin.site.register(Computer ,ComputerAdmin)
xadmin.site.register(Disk ,DiskAdmin)