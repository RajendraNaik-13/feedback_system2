from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ADMIN = 'admin'
    MODERATOR = 'moderator'
    CONTRIBUTOR = 'contributor'
    
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (MODERATOR, 'Moderator'),
        (CONTRIBUTOR, 'Contributor'),
    ]
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=CONTRIBUTOR,
    )
    
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    
    def is_admin(self):
        return self.role == self.ADMIN
    
    def is_moderator(self):
        return self.role == self.MODERATOR
    
    def is_contributor(self):
        return self.role == self.CONTRIBUTOR

