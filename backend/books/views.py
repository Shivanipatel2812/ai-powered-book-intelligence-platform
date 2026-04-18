from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Book
import json


@csrf_exempt
def get_books(request):
    if request.method == "GET":
        books = Book.objects.all()

        data = []
        for book in books:
            data.append({
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "rating": book.rating,
                "reviews": book.reviews,
                "description": book.description,
                "book_url": book.book_url,
                "summary": book.summary,
                "genre": book.genre,
                "sentiment": book.sentiment,
                "recommendation_note": book.recommendation_note,
            })

        return JsonResponse(data, safe=False)

    elif request.method == "POST":
        body = json.loads(request.body)

        book = Book.objects.create(
            title=body.get("title"),
            author=body.get("author"),
            rating=body.get("rating"),
            reviews=body.get("reviews"),
            description=body.get("description"),
            book_url=body.get("book_url"),
            summary=body.get("summary"),
            genre=body.get("genre"),
            sentiment=body.get("sentiment"),
            recommendation_note=body.get("recommendation_note"),
        )

        return JsonResponse({
            "message": "Book added successfully",
            "id": book.id
        }, status=201)

    return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def delete_book(request, book_id):
    if request.method == "DELETE":
        try:
            book = Book.objects.get(id=book_id)
            book.delete()
            return JsonResponse({"message": "Book deleted successfully"})
        except Book.DoesNotExist:
            return JsonResponse({"error": "Book not found"}, status=404)

    return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def update_book(request, book_id):
    if request.method == "PUT":
        try:
            book = Book.objects.get(id=book_id)
            body = json.loads(request.body)

            book.title = body.get("title")
            book.author = body.get("author")
            book.rating = body.get("rating")
            book.reviews = body.get("reviews")
            book.description = body.get("description")
            book.book_url = body.get("book_url")
            book.summary = body.get("summary")
            book.genre = body.get("genre")
            book.sentiment = body.get("sentiment")
            book.recommendation_note = body.get("recommendation_note")
            book.save()

            return JsonResponse({"message": "Book updated successfully"})
        except Book.DoesNotExist:
            return JsonResponse({"error": "Book not found"}, status=404)

    return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def ask_question(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            question = body.get("question", "").strip().lower()

            if not question:
                return JsonResponse({"error": "Question is required"}, status=400)

            books = Book.objects.all()

            if not books.exists():
                return JsonResponse({
                    "answer": "No books are available in the database yet.",
                    "source": None
                })

            best_match = None
            best_score = 0

            for book in books:
                searchable_text = f"""
                {book.title or ''}
                {book.author or ''}
                {book.description or ''}
                {book.summary or ''}
                {book.genre or ''}
                {book.sentiment or ''}
                {book.recommendation_note or ''}
                """.lower()

                score = 0
                for word in question.split():
                    if word in searchable_text:
                        score += 1

                if score > best_score:
                    best_score = score
                    best_match = book

            if best_match:
                answer = (
                    f"'{best_match.title}' by {best_match.author} seems most relevant. "
                    f"It is a {best_match.genre or 'general'} book with "
                    f"{best_match.sentiment or 'unknown'} sentiment. "
                    f"Summary: {best_match.summary or 'No summary available'}."
                )

                return JsonResponse({
                    "answer": answer,
                    "source": {
                        "title": best_match.title,
                        "author": best_match.author,
                        "summary": best_match.summary,
                        "description": best_match.description,
                        "book_url": best_match.book_url,
                    }
                })

            return JsonResponse({
                "answer": "Sorry, I could not find a relevant answer.",
                "source": None
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)