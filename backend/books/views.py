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
            # Faqat oddiy maydonlar (faylsiz) — pickle/deepcopy xatosini oldini olish
            raw = request.data
            try:
                pages = int(raw.get("pages") or 0)
            except (TypeError, ValueError):
                pages = 0
            try:
                published_year = int(raw.get("published_year") or raw.get("publishedYear") or date.today().year)
            except (TypeError, ValueError):
                published_year = date.today().year
            data = {
                "title": raw.get("title") or "",
                "author": raw.get("author") or "",
                "description": raw.get("description") or "",
                "category": raw.get("category") or "Badiiy",
                "pages": pages,
                "published_year": published_year,
            }
            serializer = BookSerializer(data=data, context={"request": request})
            if serializer.is_valid():
                book = serializer.save()
                # Fayllarni saqlagandan keyin biriktirish (file obyektlari copy/pickle qilinmaydi)
                cover = request.FILES.get("cover")
                pdf_file = request.FILES.get("pdf")
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
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
