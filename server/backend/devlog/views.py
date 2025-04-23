from django.shortcuts import render

def home(request):
    return render(request, 'devlog/home.html')

def about(request):
    return render(request, 'devlog/story.html')
