from django.contrib import admin

from .models import *

class EmailAdmin(admin.ModelAdmin):
    list_display=( 'user', 'subject', 'timestamp')
    list_display_links=('user',)
    search_fields=('user', 'subject')

# Register your models here.
admin.site.register(User)
admin.site.register(Email, EmailAdmin)
