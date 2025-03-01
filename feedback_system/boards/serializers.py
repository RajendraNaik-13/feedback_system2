from rest_framework import serializers
#from django.contrib.auth.models import User
from .models import Board, Feedback
from django.contrib.auth import get_user_model
User=get_user_model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class FeedbackSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    upvote_count = serializers.IntegerField(read_only=True)
    is_upvoted = serializers.SerializerMethodField()
    
    class Meta:
        model = Feedback
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'board', 'created_by', 'created_at', 'updated_at',
            'upvote_count', 'is_upvoted'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at', 'upvote_count']
    
    def get_is_upvoted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user in obj.upvotes.all()
        return False

class BoardSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    members_count = serializers.SerializerMethodField()
    feedback_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Board
        fields = [
            'id', 'title', 'description', 'is_public',
            'created_by', 'created_at', 'updated_at',
            'members_count', 'feedback_count'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']
    
    def get_members_count(self, obj):
        return obj.members.count()
    
    def get_feedback_count(self, obj):
        return obj.feedback_items.count()

class BoardDetailSerializer(BoardSerializer):
    members = UserSerializer(many=True, read_only=True)
    recent_feedback = serializers.SerializerMethodField()
    
    class Meta(BoardSerializer.Meta):
        fields = BoardSerializer.Meta.fields + ['members', 'recent_feedback']
    
    def get_recent_feedback(self, obj):
        recent = obj.feedback_items.order_by('-created_at')[:5]
        return FeedbackSerializer(
            recent, 
            many=True, 
            context=self.context
        ).data