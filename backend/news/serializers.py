from rest_framework import serializers
from .models import News


class NewsSerializer(serializers.ModelSerializer):
    imageUrl = serializers.SerializerMethodField(read_only=True)
    date = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = News
        fields = ["id", "title", "summary", "date", "imageUrl"]

    def get_imageUrl(self, obj):
        if obj.image:
            return obj.image.url
        return None
