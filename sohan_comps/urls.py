from django.urls import path, re_path,include
import xadmin

urlpatterns = [
    path('xadmin/', xadmin.site.urls),
    path('', include('sohan.urls'))
]
