# Generated by Django 5.1.7 on 2025-04-07 18:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0005_votingstatus"),
    ]

    operations = [
        migrations.AddField(
            model_name="votingstatus",
            name="display_results",
            field=models.BooleanField(default=False),
        ),
    ]
