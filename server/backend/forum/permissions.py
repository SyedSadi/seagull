# permissions.py
from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
     # --------------------------------------------
     # Custom permission to allow object owners to edit or delete,
     # while allowing everyone to view (read-only access).
     # --------------------------------------------
     def has_object_permission(self, request, view, obj):
        # Allow read-only permissions for anyone (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Dynamically check if the object has 'author' (Post) or 'user' (Comment)
        owner = getattr(obj, 'author', None) or getattr(obj, 'user', None)
        
        # Allow modification only if the logged-in user is the owner
        return owner == request.user or request.user.is_superuser