from django.db import models
from django.conf import settings

class Board(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_boards')
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='member_boards', blank=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-updated_at']
        permissions = [
            ("moderate_board", "Can moderate board content"),
            ("contribute_to_board", "Can contribute to board"),
        ]

class Feedback(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('under_review', 'Under Review'),
        ('implemented', 'Implemented'),
        ('closed', 'Closed'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'), 
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='feedback_items')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='feedback_items')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    upvotes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='upvoted_feedback', blank=True)
    
    def __str__(self):
        return self.title
    
    @property
    def upvote_count(self):
        return self.upvotes.count()
    
    class Meta:
        ordering = ['-updated_at']
