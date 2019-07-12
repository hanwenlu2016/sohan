from django.urls import path, re_path
from sohan.views import LoginView, LogoutView, EntryQuery, QuitQuery, StockQuery,InfoQuery
from sohan import views

urlpatterns = [
    path('accounts/login/', LoginView.as_view(), name="login"),  # 使用@login_required需要设置登录函数
    path('', views.index, name="index"),  # 主页
    path('logout/', LogoutView.as_view(), name="logout"),  # 登出
    path('entry/', views.entry, name='entry'),  # 用户信息-入职
    path('entry_add/', views.entry_add, name='entry_add'),  # 用户信息-增加
    path('entry_add_position/', views.entry_add_position, name='entry_add_position'),  # 用户信息-编辑 -增加职位
    path('edit_user_entry/', views.edit_user_entry, name='edit_user_entry'),  # 用户信息-编辑用户
    path('quit/', views.quit, name='quit'),  # 离职信息
    path('info/', views.comp_info, name='info'),  # 电脑信息登记
    path('info_add/', views.info_add, name='info_add'),  # 电脑信息 库存信息分配电脑
    path('stock/', views.comp_stock, name='stock'),  # 电脑信息 库存信息
    path('comp_stock_add/', views.comp_stock_add, name='comp_stock_add'),  #  库存信息 采购入库
    path('try/', views.comp_try, name='try'),  # 电脑信息 异常电脑
    path('user_entry_query/', EntryQuery.as_view(), name='entry_query'),  # 用户信息入职 查询
    path('user_quit_query/', QuitQuery.as_view(), name='quit_query'),  # 用户信息离职 查询
    path('comp_quit_info/', InfoQuery.as_view(), name='quit_info'),#电脑信息查询
    path('comp_quit_stock/', StockQuery.as_view(), name='quit_stock'), #库存信息查询
]


handler403 = views.permission_denied
handler404 = views.page_not_found
handler500 = views.page_error
