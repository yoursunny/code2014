from django.conf.urls.defaults import *

urlpatterns = patterns('',
    # Example:
    # (r'^library/', include('library.foo.urls')),

    # Uncomment this for admin:
    # (r'^admin/', include('django.contrib.admin.urls')),
    (r'^api/', include('library.api.urls')),
)
