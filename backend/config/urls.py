from django.contrib import admin
from django.urls import path
from books.views import get_books, delete_book, update_book, ask_question

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/books/', get_books),
    path('api/books/delete/<int:book_id>/', delete_book),
    path('api/books/update/<int:book_id>/', update_book),
    path('api/ask/', ask_question),
]