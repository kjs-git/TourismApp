
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app


ENV ASPNETCORE_HTTP_PORTS=80
EXPOSE 80


FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src


COPY ["TourismApp.sln", "./"]
COPY ["API/API.csproj", "API/"]
COPY ["Application/Application.csproj", "Application/"]
COPY ["Infrastructure/Infrastructure.csproj", "Infrastructure/"]
COPY ["Domain/Domain.csproj", "Domain/"]


RUN dotnet restore "TourismApp.sln"


COPY . .


WORKDIR "/src/API"
RUN dotnet build "API.csproj" -c Release -o /app/build


FROM build AS publish
RUN dotnet publish "API.csproj" -c Release -o /app/publish /p:UseAppHost=false


FROM base AS final
WORKDIR /app


COPY --from=publish /app/publish .

# Запускаем приложение
ENTRYPOINT ["dotnet", "API.dll"]