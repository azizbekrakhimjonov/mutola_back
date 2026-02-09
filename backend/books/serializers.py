from rest_framework import serializers
from .models import Book


class BookSerializer(serializers.ModelSerializer):
    coverUrl = serializers.SerializerMethodField(read_only=True)
    pdfUrl = serializers.SerializerMethodField(read_only=True)
    publishedYear = serializers.IntegerField(source="published_year", required=False)
    description = serializers.CharField(required=False, allow_blank=True)
    cover = serializers.ImageField(required=False, write_only=True, allow_null=True)
    pdf_file = serializers.FileField(required=False, write_only=True, allow_null=True)

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "author",
            "description",
            "coverUrl",
            "cover",
            "category",
            "pdfUrl",
            "pdf_file",
            "pages",
            "publishedYear",
        ]
        read_only_fields = ["id"]

    def get_coverUrl(self, obj):
        if obj.cover:
            # Relative URL — frontend hozirgi domen orqali yuklaydi (localhost yoki mutola.uz)
            return obj.cover.url
        return ""

    def get_pdfUrl(self, obj):
        if obj.pdf_file:
            # Relative URL — yangi oyna va embed hozirgi domen orqali ishlaydi
            return obj.pdf_file.url
        return ""
