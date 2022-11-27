from django.db import models

class Restaurant(models.Model):
    name = models.CharField(max_length=256)
    address = models.CharField(max_length=600)
    
    def __str__(self) -> str:
        return self.name