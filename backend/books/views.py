import logging
from datetime import date

from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Book
from .serializers import BookSerializer

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name="dispatch")
class BookListCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True, context={"request": request})
        return Response(serializer.data)

    def post(self, request):
        try:
            # Multipart: POST yoki request.data (form maydonlari)
            post = request.POST if request.POST else request.data
            try:
                pages = int(post.get("pages") or 0)
            except (TypeError, ValueError):
                pages = 0
            try:
                published_year = int(post.get("published_year") or post.get("publishedYear") or date.today().year)
            except (TypeError, ValueError):
                published_year = date.today().year
            title = (post.get("title") or "").strip()
            author = (post.get("author") or "").strip()
            if not title or not author:
                return Response(
                    {"detail": "Kitob nomi va muallif to'ldirilishi shart."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            cover = request.FILES.get("cover")
            pdf_file = request.FILES.get("pdf")
            if not cover or not pdf_file:
                return Response(
                    {"detail": "Kitob muqovasi va PDF fayl yuklanishi shart."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            data = {
                "title": title,
                "author": author,
                "description": (post.get("description") or "").strip(),
                "category": (post.get("category") or "Badiiy").strip() or "Badiiy",
                "pages": pages,
                "published_year": published_year,
                "publishedYear": published_year,
            }
            if not data["category"]:
                data["category"] = "Badiiy"
            serializer = BookSerializer(data=data, context={"request": request})
            if serializer.is_valid():
                book = serializer.save()
                # Fayllarni biriktirish (allaqachon tekshirildi)
                update_fields = []
                if cover:
                    book.cover = cover
                    update_fields.append("cover")
                if pdf_file:
                    book.pdf_file = pdf_file
                    update_fields.append("pdf_file")
                if update_fields:
                    book.save(update_fields=update_fields)
                return Response(BookSerializer(book, context={"request": request}).data, status=status.HTTP_201_CREATED)
            err_msg = "; ".join(
                f"{k}: {v[0]}" if isinstance(v, list) else f"{k}: {v}"
                for k, v in (serializer.errors or {}).items()
            )
            return Response(
                {"detail": err_msg or "Validatsiya xatosi"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            logger.exception("Kitob qo'shishda xatolik")
            err_msg = str(e) if settings.DEBUG else "Kitob saqlanmadi. Server loglarini tekshiring."
            return Response(
                {"detail": err_msg},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(csrf_exempt, name="dispatch")
class BookDetailView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self, pk):
        try:
            return Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return None

    def delete(self, request, pk):
        book = self.get_object(pk)
        if not book:
            return Response(
                {"error": "Kitob topilmadi"},
                status=status.HTTP_404_NOT_FOUND,
            )
        book.cover.delete(save=False)
        book.pdf_file.delete(save=False)
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
