# Generated by Django 4.1.3 on 2022-12-01 05:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurant', '0003_restaurant_url_userfavorite'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurant',
            name='restaurant_id',
            field=models.CharField(blank=True, max_length=256, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='userfavorite',
            name='liked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='userfavorite',
            name='updated',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
