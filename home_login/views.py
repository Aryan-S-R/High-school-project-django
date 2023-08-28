from .forms import SignUpForm
from django.urls import reverse_lazy
from django.views.generic import CreateView
from django.shortcuts import render, redirect
import logging
import base64
import sys
import datetime, json
from datetime import datetime, timedelta , time
from json import JSONEncoder
import json
from decimal import Decimal
from django.utils.dateparse import parse_date
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import Group
from django.template import Context, Template
from django.utils.decorators import method_decorator
from django.forms.models import model_to_dict
from django.contrib import messages
from django.core.paginator import EmptyPage, InvalidPage, Paginator
from django.views.generic import View
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.utils.translation import get_language
from django.contrib.auth.models import User
from django.contrib import messages
from decimal import Decimal
from django.db.models import Sum
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from.models import Students, Amounts



class SignUpView(CreateView):
    form_class = SignUpForm
    success_url=reverse_lazy('login')
    template_name= "registration/signup.html"


def Artists(request):
    return render (request, 'artist.html')


class Index(View):
    template_name = "slider.html"
    def get(self , request):
        print("HOMEEEE")

        stt_data = []

        stt = Students.objects.all()

        for ht in stt:
            data = {
                "id" : ht.id,
                "name" : ht.name,
                "email" : ht.email,
                "number" : ht.number,
                "address" : ht.address,
            }

            stt_data.append(data)


        context = {
            'stt' : stt_data,
            'all_stt' : json.dumps(list(stt_data)),
        }


        return render(request , self.template_name , context)
    
    def post(self , request):

        print("INNNNSIDE POST")

        form_id = request.POST.get('stt_id')

        db_param = request.POST.dict()

        print("DB Param1 = ",db_param)   

        del db_param['csrfmiddlewaretoken']
        del db_param['stt_id']

        print("DB Param222 = ",db_param)        

        if(form_id == '0'):
            db_param['created_time'] = datetime.now()
            if(request.POST.get):
               Students.objects.create(**db_param)  
            return redirect('slider')
        else:
            print("Update")
            db_param['updated_time'] = datetime.now()
            if(request.Post.get):
                Students.objects.filter(id = int(form_id)).update(**db_param)

            return redirect('slider')
        


class Home(View):
    template_name = "product.html"
    def get(self , request):
        print("HOMEEEE")

        lib_data = []

        lib = Amounts.objects.all()

        for ht in lib:
            data = {
                "id" : ht.id,
                "name" : ht.name,
                "section" : ht.section,
                "fathername" : ht.fathername,
                "number" : ht.number,
                "amount" : ht.amount,
            }

            lib_data.append(data)

        context = {
            'lib' : lib_data,
            'all_lib' : json.dumps(list(lib_data))
        }

        return render(request , self.template_name , context)
    
    def post(self , request):

        print("INNNNSIDE POST")

        lib_id = request.POST.get('lib_id')

        # db_param = {
        #     "sno" : request.POST.get('sno'),
        #     "name" : request.POST.get('name'),
        #     "author" : request.POST.get('author'),
        #     "title" : request.POST.get('title'),
        #     "number" : request.POST.get('number'),
        # }

        db_param = request.POST.dict()

        del db_param['csrfmiddlewaretoken']
        del db_param['lib_id']

        print("DB Param = ",db_param)        

        if(lib_id == '0'):
            print("New")
            db_param['created_time'] = datetime.now()
            Amounts.objects.create(**db_param)
            return redirect('product')
        else:
            print("Update")
            db_param['updated_time'] = datetime.now()
            Amounts.objects.filter(id = int(lib_id)).update(**db_param)

            return redirect('product')

