import logging
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import News
from .serializers import NewsSerializer

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name="dispatch")
class NewsListCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        news = News.objects.all()
        serializer = NewsSerializer(news, many=True)
        return Response(serializer.data)

    def post(self, request):
        try:
            post = request.POST if request.POST else request.data if isinstance(request.data, dict) else {}
            title = (post.get("title") or "").strip()
            summary = (post.get("summary") or "").strip()
            date_str = post.get("date") or ""

            if not title or not summary:
                return Response(
                    {"detail": "Sarlavha va qisqacha matn to'ldirilishi shart."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            from datetime import date
            try:
                if date_str:
                    news_date = date.fromisoformat(date_str.replace(" ", ""))
                else:
                    news_date = date.today()
            except (ValueError, TypeError):
                news_date = date.today()

            data = {"title": title, "summary": summary, "date": news_date}
            serializer = NewsSerializer(data=data)
            if serializer.is_valid():
                news_item = serializer.save()
                image = request.FILES.get("image")
                if image:
                    news_item.image = image
                    news_item.save(update_fields=["image"])
                return Response(
                    NewsSerializer(news_item).data,
                    status=status.HTTP_201_CREATED,
                )
            return Response(
                {"detail": serializer.errors or "Validatsiya xatosi"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            logger.exception("Yangilik qo'shishda xatolik")
            err_msg = str(e) if settings.DEBUG else "Yangilik saqlanmadi."
            return Response(
                {"detail": err_msg},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(csrf_exempt, name="dispatch")
class NewsDetailView(APIView):
    def get_object(self, pk):
        try:
            return News.objects.get(pk=pk)
        except News.DoesNotExist:
            return None

    def delete(self, request, pk):
        news = self.get_object(pk)
        if not news:
            return Response(
                {"error": "Yangilik topilmadi"},
                status=status.HTTP_404_NOT_FOUND,
            )
        if news.image:
            news.image.delete(save=False)
        news.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
