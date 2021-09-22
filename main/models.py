from django.db import models


class Task(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.TextField(blank=True, null=True)
    completed = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'Task'
