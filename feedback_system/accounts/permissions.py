# accounts/permissions.py
from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Permission check for Admin users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin()

class IsModerator(permissions.BasePermission):
    """
    Permission check for Moderator users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_admin() or request.user.is_moderator())

class IsContributor(permissions.BasePermission):
    """
    Permission check for Contributor users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_contributor()

class IsAdminOrModerator(permissions.BasePermission):
    """
    Permission check for Admin or Moderator users.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.is_admin() or request.user.is_moderator()

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Write permissions are only allowed to the owner
        return obj.created_by == request.user