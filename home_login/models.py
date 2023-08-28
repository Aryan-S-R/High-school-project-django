from django.db import models

class Students(models.Model):
    name=models.CharField(max_length=100)
    email=models.EmailField(max_length=100)
    number=models.IntegerField(null=True)
    address=models.CharField(max_length=100)
    created_time = models.DateTimeField(auto_now_add=True , null = True)
    updated_time = models.DateTimeField(auto_now=True , null = True)

class Amounts(models.Model):
    name=models.CharField(max_length=100)
    section=models.CharField(max_length=100)
    fathername=models.CharField(max_length=100)
    number=models.IntegerField(null=True)
    amount=models.IntegerField(null=True)
    created_time = models.DateTimeField(auto_now_add=True , null = True)
    updated_time = models.DateTimeField(auto_now=True , null = True)

