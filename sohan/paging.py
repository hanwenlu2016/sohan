from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


# 定义分页函数
def pages(request, model):
    page_data = model # 查询出数据库数据
    paginator = Paginator(page_data, 10)  # 每页显示10条纪录
    page = request.GET.get('page')  # 获取客户端请求传来的页码
    try:
        page_data = paginator.page(page)
    except PageNotAnInteger:
        # 如果页面不是整数，则传递第一页。
        page_data = paginator.page(1)
    except EmptyPage:
        # 如果页面超出范围（例如9999），则交到最后一页的结果。
        page_data = paginator.page(paginator.num_pages)
    return page_data
