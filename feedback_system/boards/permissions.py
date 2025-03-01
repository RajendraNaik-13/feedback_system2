# boards/permissions.py
from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Allow read access to anyone, but only admin users can modify
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class IsBoardMemberOrReadOnly(permissions.BasePermission):
    """
    Allow access to board members or if the board is public (for read operations)
    """
    def has_object_permission(self, request, view, obj):
        # Get the board object (either directly or via feedback)
        if hasattr(obj, 'board'):
            board = obj.board
        else:
            board = obj
            
        # Read permissions are allowed to any request if the board is public
        if request.method in permissions.SAFE_METHODS:
            return board.is_public or request.user in board.members.all() or board.created_by == request.user
            
        # Write permissions are only allowed to members
        return request.user and (
            request.user.is_staff or 
            request.user in board.members.all() or 
            board.created_by == request.user or
            request.user.has_perm('boards.moderate_board')
        )

class IsCreatorOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow creators of an object to edit it
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Write permissions are only allowed to the creator
        return obj.created_by == request.user or request.user.is_staff

class IsModeratorOrReadOnly(permissions.BasePermission):
    """
    Allow moderators to edit but only creators can delete
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Get the board object (either directly or via feedback)
        if hasattr(obj, 'board'):
            board = obj.board
        else:
            board = obj
            
        # Allow staff and moderators to edit
        if request.method != 'DELETE':
            return (
                request.user.is_staff or 
                request.user.has_perm('boards.moderate_board') or
                obj.created_by == request.user
            )
            
        # Only creator and staff can delete
        return obj.created_by == request.user or request.user.is_staff