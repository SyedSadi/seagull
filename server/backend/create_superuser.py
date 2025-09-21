#!/usr/bin/env python
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

ADMIN_USER = os.environ.get("ADMIN_USER")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD")

if not (ADMIN_USER and ADMIN_EMAIL and ADMIN_PASSWORD):
    print("Superuser environment variables not set. Skipping creation.")
else:
    if not User.objects.filter(username=ADMIN_USER).exists():
        User.objects.create_superuser(
            username=ADMIN_USER,
            email=ADMIN_EMAIL,
            password=ADMIN_PASSWORD
        )
        print(f"Superuser '{ADMIN_USER}' created successfully!")
    else:
        print(f"Superuser '{ADMIN_USER}' already exists. Skipping.")
