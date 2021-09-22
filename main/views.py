from django.shortcuts import render
from .serializers import TaskSerializer
# Create your views here.
from main.models import Task
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest, HttpResponseNotFound


@api_view(["GET"])
def api_overview(request):
    api_urls = {
        'List': '/task-list/',
        'Detail View': '/task-detail/<str:pk>/',
        'Create': '/task-create/',
        'Update': '/task-update/<str:pk>/',
        'Delete': '/task-delete/<str:pk>/',
    }
    return Response(api_urls)


@api_view(["GET"])
def task_list(request):
    tasks = Task.objects.all().order_by('-id')
    serializer = TaskSerializer(tasks,many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(["GET"])
def task_detail(request, pk):
    if Task.objects.filter(id=pk).exists():
        task = Task.objects.get(id=pk)
        serializer = TaskSerializer(task, many=False)
    else:
        return JsonResponse({})
    return JsonResponse(serializer.data)


@api_view(["POST"])
def task_create(request):
    serializer = TaskSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
    return JsonResponse(serializer.data, safe=False)


@api_view(["POST"])
def task_update(request, pk):
    if Task.objects.filter(id=pk).exists():
        task = Task.objects.get(id=pk)
        serializer = TaskSerializer(instance=task, data=request.data)

        if serializer.is_valid():
            serializer.save()
    return JsonResponse(serializer.data, safe=False)


@api_view(["DELETE"])
def task_delete(request, pk):
    if Task.objects.filter(id=pk).exists():
        task = Task.objects.get(id=pk)
        task.delete()
    return HttpResponse(status=200)
