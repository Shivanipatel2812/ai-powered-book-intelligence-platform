from django.db import models


class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, blank=True, null=True)
    rating = models.FloatField(blank=True, null=True)
    reviews = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    book_url = models.URLField(unique=True)

    summary = models.TextField(blank=True, null=True)
    genre = models.CharField(max_length=100, blank=True, null=True)
    sentiment = models.CharField(max_length=50, blank=True, null=True)
    recommendation_note = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title