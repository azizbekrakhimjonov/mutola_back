from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Book
from .serializers import BookSerializer


class BookListCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True, context={"request": request})
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        cover = request.FILES.get("cover")
        pdf_file = request.FILES.get("pdf")
        if cover:
            data["cover"] = cover
        if pdf_file:
            data["pdf_file"] = pdf_file
        # Frontend dan keladigan nomlar (camelCase)
        if "publishedYear" in data and "published_year" not in data:
            data["published_year"] = data.get("publishedYear")
        serializer = BookSerializer(data=data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
