from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from sohan.forms import LoginForm
from django.http import HttpResponse, HttpResponseRedirect
from django.views.generic.base import View
from django.urls import reverse
from sohan.models import Staff, Position, Computer, Brand, Cpu, Disk
from django.contrib.auth.decorators import login_required
import django.utils.timezone as timezone
from sohan.paging import pages  # 导入自定义分页函数
from django.core.mail import send_mail
from django.db.models import Q

import logging

log = logging.getLogger('sourceDns.webdns.views')


def email_if(x):
    if x == 1:
        return '行政部'
    elif x == 2:
        return '产品部'
    elif x == 3:
        return '运营商业务部'
    elif x == 4:
        return '充值业务部'
    elif x == 5:
        return '财务部'
    elif x == 6:
        return '智能饮水业务部'
    else:
        return '其他'


# 获取访问ip
def get_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]  # 所以这里是真实的ip

    else:
        ip = request.META.get('REMOTE_ADDR')  # 这里获得代理ip
    return ip


# 登录
class LoginView(View):
    def get(self, request):
        return render(request, "login.html", {})

    def post(self, request):
        login_form = LoginForm(request.POST)  # 验证表单
        if login_form.is_valid():
            user_name = request.POST.get("username", "")
            pass_word = request.POST.get("password", "")
            user = authenticate(username=user_name, password=pass_word)
            if user is not None:
                if user.is_active:  # 验证账户
                    login(request, user)
                    log.info('{} 已登录 , 登录IP: {}'.format(user, get_ip(request)))
                    return HttpResponseRedirect(reverse("index"))
            else:
                return render(request, "login.html", {"msg": "用户名或密码错误！"})


        else:
            return render(request, "login.html", {"login_form": login_form})


# 登出
class LogoutView(View):
    def get(self, request):
        logout(request)
        return HttpResponseRedirect(reverse("login"))


# 首页
@login_required
def index(request):
    # 柱形图数据
    department_count1 = Staff.objects.filter(department='1')
    department_count2 = Staff.objects.filter(department='2')
    department_count3 = Staff.objects.filter(department='3')
    department_count4 = Staff.objects.filter(department='4')
    department_count5 = Staff.objects.filter(department='5')
    department_count6 = Staff.objects.filter(department='6')

    ThinkPad_x1 = Computer.objects.filter(brands__brand_name='ThinkPad-x1').count()
    ThinkPad_t460p = Computer.objects.filter(brands__brand_name='ThinkPad-t460p').count()
    ThinkPad_430 = Computer.objects.filter(brands__brand_name='ThinkPad-t430').count()
    ThinkPad_t440p = Computer.objects.filter(brands__brand_name='ThinkPad-T440p').count()
    ThinkPad_430s = Computer.objects.filter(brands__brand_name='ThinkPad-t430s').count()
    ThinkPad_x220 = Computer.objects.filter(brands__brand_name='ThinkPad-x220').count()
    ThinkPad_e430 = Computer.objects.filter(brands__brand_name='ThinkPad-e430').count()
    ThinkPad_e430c = Computer.objects.filter(brands__brand_name='ThinkPad-e430c').count()
    dell_x1 = Computer.objects.filter(brands__brand_name='dell-x1').count()
    pc = Computer.objects.filter(brands__brand_name='台式').count()
    ThinkPad_e550 = Computer.objects.filter(brands__brand_name='ThinkPad-e550').count()
    k29 = Computer.objects.filter(brands__brand_name='联想K29').count()
    imac = Computer.objects.filter(brands__brand_name='Imac').count()

    cmp_num = int(ThinkPad_x1) + int(ThinkPad_t460p) + int(ThinkPad_430) + int(ThinkPad_t440p) + int(
        ThinkPad_430s) + int(ThinkPad_x220) + int(ThinkPad_e430) + int(ThinkPad_e430c) + int(dell_x1) + int(pc) + int(
        ThinkPad_e550) + int(k29) + int(imac)

    return render(request, 'index.html',
                  {'department_count1': department_count1, 'department_count2': department_count2,
                   'department_count3': department_count3, 'department_count4': department_count4,
                   'department_count5': department_count5, 'department_count6': department_count6,
                   'ThinkPad_x1': ThinkPad_x1, 'ThinkPad_t460p': ThinkPad_t460p, 'ThinkPad_430': ThinkPad_430,
                   'ThinkPad_t440p': ThinkPad_t440p, 'ThinkPad_430s': ThinkPad_430s, 'ThinkPad_x220': ThinkPad_x220,
                   'ThinkPad_e430': ThinkPad_e430, 'ThinkPad_e430c': ThinkPad_e430c, 'dell_x1': dell_x1, 'pc': pc,
                   'ThinkPad_e550': ThinkPad_e550, 'k29': k29, 'imac': imac, 'cmp_num': cmp_num})


# 入职信息 + 分页
@login_required
def entry(request):
    # 查询出在职的信息 1就是在职的
    entrys = pages(request, Staff.objects.filter(user_state='1').exclude(id=153)[::-1])

    # 获取请求的页数 实现自动翻页序号自动增加
    current_page = request.GET.get('page')
    if current_page != None:
        page_id = int(current_page)
        strat = (page_id - 1) * 10
        return render(request, 'user_entry.html', {'entrys': entrys, 'strat': strat})
    return render(request, 'user_entry.html', {'entrys': entrys, })


# 用户信息 -入职查询
class EntryQuery(View):
    def post(self, request):
        # 获取查询字段
        name = request.POST.get('name')
        # 完全查询匹配
        # query = Staff.objects.filter(Q(name=name) | Q(department=name) | Q(sex=name) | Q(phone=name)
        #                              | Q(rank=name)).filter(user_state='1')

        # 模糊查询批配置
        q = Staff.objects.filter(user_state='1').filter(
            Q(name__icontains=name) | Q(department=name) | Q(sex=name) | Q(phone=name)
                                          | Q(rank=name)
            )
        return render(request, 'user_entry_query.html', {'query': q})


# 用户信息 -离职查询
class QuitQuery(View):
    def post(self, request):
        # 获取查询字段
        name = str(request.POST.get('name')).replace(' ', '')
        # 查询出改名字并且等于离职的
        quits = Staff.objects.filter(Q(name=name) | Q(department=name) | Q(sex=name) | Q(phone=name)
                                     | Q(rank=name)).filter(user_state='2')
        return render(request, 'user_quit_query.html', {'quits': quits})


# 入职新增
@login_required
def entry_add(request):
    if request.method == 'POST':
        name1 = request.POST.get('name1')
        name2 = request.POST.get('name2')
        name3 = request.POST.get('name3')
        name4 = request.POST.get('name4')
        name5 = request.POST.get('name5')
        name6 = request.POST.get('name6')
        name7 = request.POST.get('name7')
        name8 = timezone.now()
        name9 = request.POST.get('name9')
        t = Position.objects.get(position_name=name5)  # 查询前台获取的数据是否在数据库中，是的话直接提交该Id

        s = Staff(name=name1, sex=name2, phone=name3, department=name4, positions_id=t.id, rank=name6, user_state=name7,
                  com_time=name8, tag=name9, complete_state=False)
        s.save()
        # 如果提交成功就发送邮件
        if s.save:
            send_mail('新入职信息', '您好！新同事入职！请分配电脑！【员工:{}  部门:{}  职位:{}】 '.format(name1, email_if(int(name4)), name5),
                      'sohan_computer@hotmail.com', ['xx@163.com'], fail_silently=False)

        return redirect('entry')

    else:
        entrys = Staff.objects.all()
        p = Position.objects.all()
        ti = timezone.now()
        return render(request, 'user_entry_add.html', {'entrys': entrys, 'p': p, 'ti': ti})


# 编辑
@login_required
def edit_user_entry(request):
    if request.method == 'POST':
        edit_id = request.GET.get('id')
        edit_obj = Staff.objects.get(id=edit_id)

        # 前端获取9个参数
        new_name1 = request.POST.get('name1')
        new_name2 = request.POST.get('name2')
        new_name3 = request.POST.get('name3')
        new_name4 = request.POST.get('name4')
        new_name5 = request.POST.get('name5')
        new_name6 = request.POST.get('name6')
        new_name7 = request.POST.get('name7')
        new_name8 = timezone.now()
        new_name9 = request.POST.get('name9')

        t = Position.objects.get(position_name=new_name5)

        # 新值修改数据库
        edit_obj.name = new_name1
        edit_obj.sex = new_name2
        edit_obj.phone = new_name3
        edit_obj.department = new_name4
        edit_obj.positions_id = t.id
        edit_obj.rank = new_name6
        edit_obj.user_state = new_name7
        edit_obj.com_time = new_name8
        edit_obj.tag = new_name9
        edit_obj.save()
        try:
            compute_obj = Computer.objects.get(staff_name_id=int(edit_id))  # 查询出电脑信息中此ID信息用于修改状态

            if edit_obj.user_state == '2':  # 2代表离职
                compute_obj.state = '2'  # #此2把电脑状态改为空闲中
                compute_obj.save()
        except Exception as e:
            pass

        return redirect('entry')

    edit_id = request.GET.get('id')
    edit_user = Staff.objects.get(id=edit_id)  # 获取修改人的数据信息
    p = Position.objects.all()  # 查询职位
    return render(request, 'user_entry_edit.html', {'edit_user': edit_user, 'p': p})


# 增加职位
@login_required
def entry_add_position(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        p = Position.objects.all()
        # 利用推导循环出职位判断
        p1 = [i.position_name for i in p]
        if name in p1:
            return render(request, 'user_entry_add_position.html', {'msg': '职位已存在'})
        else:
            p = Position(position_name=name)
            p.save()
        return redirect('entry_add')
    return render(request, 'user_entry_add_position.html')


# 离职
@login_required
def quit(request):
    # 查询离职信息 2在数据库中代表离职
    quits = pages(request, Staff.objects.filter(user_state='2'))
    return render(request, 'user_quit.html', {'quits': quits})


# 登记信息
@login_required
def comp_info(request):
    # 查询出使用中为登记信息
    info = pages(request, Computer.objects.filter(state='1')[::-1])
    current_page = request.GET.get('page')
    if current_page != None:
        page_id = int(current_page)
        strat = (page_id - 1) * 10
        return render(request, 'comp_info.html', {'info': info, 'strat': strat})
    return render(request, 'comp_info.html', {'info': info, })


# 电脑信息 -登记信信息查询
class InfoQuery(View):
    def post(self, request):
        # 获取查询字段
        name = str(request.POST.get('name')).replace(' ', '')
        # 查询出状态为空闲的 电脑信息 完全查询
        # staf = Computer.objects.filter(state='1').filter(
        #     Q(staff_name__name=name) | Q(brands__brand_name=name) | Q(disks__disk_name=name) | Q(memory=name)
        #     | Q(cpus__cpu_name=name) | Q(mac=name)
        #     | Q(os=name))

        # 模糊查询
        s = Computer.objects.filter(state='1').filter(
            Q(staff_name__name__icontains=name) | Q(brands__brand_name__icontains=name) | Q(
                disks__disk_name__icontains=name) |
            Q(memory__icontains=name) | Q(cpus__cpu_name__icontains=name) | Q(mac__icontains=name) | Q(
                os__icontains=name))

        return render(request, 'comp_info_quit.html', {'query': s})


# 库存电脑
@login_required
def comp_stock(request):
    # 查询出使空闲的为存储电脑
    info = pages(request, Computer.objects.filter(state='2'))
    return render(request, 'comp_stock.html', {'info': info})


# 电信信息 -库存详情查询
class StockQuery(View):
    def post(self, request):
        # 获取查询字段
        name = str(request.POST.get('name')).replace(' ', '')
        # 查询出状态为空闲的 完全匹配
        # staf = Computer.objects.filter(state='2').filter(
        #     Q(staff_name__name=name) | Q(brands__brand_name=name) | Q(disks__disk_name=name) | Q(memory=name)
        #     | Q(cpus__cpu_name=name) | Q(mac=name)| Q(os=name))

        # 模糊查询
        s = Computer.objects.filter(state='2').filter(
            Q(staff_name__name__icontains=name) | Q(brands__brand_name__icontains=name) | Q(
                disks__disk_name__icontains=name) |
            Q(memory__icontains=name) | Q(cpus__cpu_name__icontains=name) | Q(mac__icontains=name) | Q(
                os__icontains=name))

        return render(request, 'comp_stock_quit.html', {'query': s})


# 分配电脑
@login_required
def info_add(request):
    if request.method == 'POST':
        # 获取库存这台的id 做修改查询
        edit_post_id = request.GET.get('id')

        # 获取前台数据姓名和备注 只可以选择2项。
        name1 = request.POST.get('name1')
        name2 = request.POST.get('name2')
        # 查询出即将分配的人员信息
        allot_info = Staff.objects.get(name=name1)

        # 查询出电脑信息配置的资料，在修改用户和备注使用状态
        comps = Computer.objects.get(id=edit_post_id)
        comps.staff_name_id = allot_info.id
        comps.tag = name2  # 修改备注
        comps.state = 1  # 修改使用状态
        # comps.allot_time = timezone.now  # 修改 时间
        comps.save()  # 保存提交

        # 修改用户中的分配状态
        allot_info.user_state = 1  # 修正状态
        allot_info.complete_state = 1  # 修正分配状态
        allot_info.save()
        # 如果修改提交成功就发送邮件通知人事

        return redirect('info')

    # 获取分配空闲电脑的ID 并且把这个IDpost表单中
    edit_info_id = request.GET.get('id')
    info_data = Staff.objects.filter(complete_state=False)  # 查询出分配状态 如果没有分配就直接分配
    info = Computer.objects.get(id=int(edit_info_id))  # 查询电脑信息表中此ID
    return render(request, 'info_allot.html', {'info_data': info_data, 'info': info, 'edit_info_id': edit_info_id})


# 库存电脑采购入库
@login_required
def comp_stock_add(request):
    if request.method == 'POST':
        # 获取前端数据
        brands = Brand.objects.get(brand_name=request.POST.get('name1')).id
        disks = Disk.objects.get(disk_name=request.POST.get('name2')).id
        memory = request.POST.get('name3')
        cpus = Cpu.objects.get(cpu_name=request.POST.get('name4')).id
        screen_size = request.POST.get('name5')
        fiven_etwork = 'yes'
        mac = request.POST.get('name6')
        os = '3'
        state = '2'
        tag = request.POST.get('name7')
        # 提交到数据库    staff_name_id写死了
        c = Computer(staff_name_id=153, brands_id=brands, disks_id=disks, memory=memory, cpus_id=cpus,
                     screen_size=screen_size,
                     fiven_etwork=fiven_etwork, mac=mac, os=os, state=state, tag=tag)
        c.save()
        return redirect('stock')

    cpus = Cpu.objects.all()
    disks = Disk.objects.all()
    brands = Brand.objects.all()
    return render(request, 'comp_stock_add.html', {'cpus': cpus, 'disks': disks, 'brands': brands})


# 异常电脑
def comp_try(request):
    info = pages(request, Computer.objects.filter(state='3'))
    return render(request, 'comp_try.html', {'info': info})


# 404
def page_not_found(request):
    return render(request, '404.html')


# 500
def page_error(request):
    return render(request, '500.html')


# 403
def permission_denied(request):
    return render(request, '403.html')
