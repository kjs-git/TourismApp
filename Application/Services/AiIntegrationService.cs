using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace Application.Services
{
    public interface IAiIntegrationService
    {
        Task<string> GenerateExpandedDescriptionAsync(string title, string baseDescription);
    }

    public class AiIntegrationService : IAiIntegrationService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public AiIntegrationService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<string> GenerateExpandedDescriptionAsync(string title, string baseDescription)
        {
            try
            {
                var apiKey = _configuration["OpenRouterAi:ApiKey"];
                var endpoint = _configuration["OpenRouterAi:BaseUrl"] ?? "https://openrouter.ai/api/v1/chat/completions";
                var model = _configuration["OpenRouterAi:Model"] ?? "openrouter/free";

                if (string.IsNullOrEmpty(apiKey))
                    return "Ошибка конфигурации: API ключ не найден.";

                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
                _httpClient.DefaultRequestHeaders.Add("HTTP-Referer", "http://localhost:5173");
                _httpClient.DefaultRequestHeaders.Add("X-Title", "TourismApp");

                string safeDescription = string.IsNullOrWhiteSpace(baseDescription) ? "Краткое описание отсутствует." : baseDescription;

                // Строгий системный промпт для подавления диалогового стиля и Markdown
                string prompt = $@"Напиши профессиональную краеведческую справку для туристического маршрута.
Название: {title}
Краткое описание: {safeDescription}

СТРОГИЕ ПРАВИЛА (CRITICAL):
1. Верни ТОЛЬКО связный текст. Никаких приветствий, прощаний, вводных слов и предложений помощи (запрещено писать ""Конечно"", ""Представьте себе"", ""Вот справка"", ""Чем еще помочь?"").
2. КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО использовать Markdown (никаких символов #, *, -, ---). Пиши сплошным текстом.
3. ЗАПРЕЩЕНО использовать списки (маркированные или нумерованные).
4. ЗАПРЕЩЕНО использовать эмодзи.
5. Текст должен быть написан в строгом, но увлекательном документальном стиле, разбитый только на обычные абзацы (переносы строк). Опиши атмосферу, природные и исторические особенности локации.";

                var requestBody = new
                {
                    model = model,
                    messages = new[] { new { role = "user", content = prompt } }
                };

                var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(endpoint, jsonContent);
                var responseString = await response.Content.ReadAsStringAsync();

                // Красивая обработка ошибки 429 (Перегрузка)
                if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                {
                    return "Нейросеть сейчас перегружена запросами от других пользователей. Пожалуйста, закройте это окно, подождите 10-15 секунд и попробуйте снова.";
                }

                // Обработка других возможных ошибок от OpenRouter
                if (!response.IsSuccessStatusCode)
                {
                    return $"Сервис временно недоступен. Попробуйте позже.";
                }

                using var document = JsonDocument.Parse(responseString);

                string expandedText = document.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                if (string.IsNullOrWhiteSpace(expandedText))
                    return "Нейросеть не смогла сгенерировать описание.";

                // ПРОГРАММНАЯ ПОДСТРАХОВКА: очистка артефактов
                expandedText = expandedText.Replace("*", "")
                                           .Replace("#", "")
                                           .Replace("---", "");

                // Удаляем пустые диалоговые фразы (если ИИ все равно их сгенерировал)
                if (expandedText.StartsWith("Конечно") || expandedText.StartsWith("Вот "))
                {
                    int firstNewLine = expandedText.IndexOf('\n');
                    if (firstNewLine > 0)
                    {
                        expandedText = expandedText.Substring(firstNewLine).Trim();
                    }
                }

                return expandedText.Trim();
            }
            catch (Exception)
            {
                return "Отсутствует подключение к серверу искусственного интеллекта. Проверьте подключение к интернету.";
            }
        }
    }
}