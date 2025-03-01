from django.shortcuts import render
from django.db import models

# Create your views here.
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Board, Feedback
from .serializers import BoardSerializer, FeedbackSerializer
from .permissions import IsAdminOrReadOnly, IsBoardMemberOrReadOnly, IsCreatorOrReadOnly

class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_public']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'title']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return Board.objects.filter(is_public=True)
        elif user.is_staff or user.has_perm('boards.view_all_boards'):
            return Board.objects.all()
        else:
            # Return boards the user is a member of or boards that are public
            return Board.objects.filter(
                models.Q(is_public=True) | 
                models.Q(members=user) | 
                models.Q(created_by=user)
            ).distinct()
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsCreatorOrReadOnly]
        elif self.action in ['add_member', 'remove_member']:
            permission_classes = [permissions.IsAuthenticated, IsCreatorOrReadOnly]
        else:
            permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsBoardMemberOrReadOnly]
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        board = self.get_object()
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            board.members.add(user)
            return Response({'status': 'user added to board'})
        except User.DoesNotExist:
            return Response({'error': 'user not found'}, status=404)
    
    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        board = self.get_object()
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            board.members.remove(user)
            return Response({'status': 'user removed from board'})
        except User.DoesNotExist:
            return Response({'error': 'user not found'}, status=404)

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'board']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'status', 'priority']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return Feedback.objects.filter(board__is_public=True)
        elif user.is_staff or user.has_perm('boards.view_all_boards'):
            return Feedback.objects.all()
        else:
            # Return feedback from boards the user is a member of or public boards
            return Feedback.objects.filter(
                models.Q(board__is_public=True) | 
                models.Q(board__members=user) | 
                models.Q(board__created_by=user) |
                models.Q(created_by=user)
            ).distinct()
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [permissions.IsAuthenticated, IsBoardMemberOrReadOnly]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsCreatorOrReadOnly]
        elif self.action in ['upvote', 'remove_upvote']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsBoardMemberOrReadOnly]
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        feedback = self.get_object()
        feedback.upvotes.add(request.user)
        return Response({'status': 'feedback upvoted'})
    
    @action(detail=True, methods=['post'])
    def remove_upvote(self, request, pk=None):
        feedback = self.get_object()
        feedback.upvotes.remove(request.user)
        return Response({'status': 'upvote removed'})
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        feedback = self.get_object()
        status = request.data.get('status')
        if status in dict(Feedback.STATUS_CHOICES).keys():
            feedback.status = status
            feedback.save()
            return Response({'status': 'feedback status updated'})
        return Response({'error': 'invalid status'}, status=400)