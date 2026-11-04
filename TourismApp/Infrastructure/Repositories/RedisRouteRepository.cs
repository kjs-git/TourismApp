using Domain.Entities;
using Domain.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class RedisRouteRepository : IRouteRepository
    {
        private readonly IDistributedCache _cache;

        public RedisRouteRepository(IDistributedCache cache)
        {
            _cache = cache;
        }

        public async Task<UserRoute?> GetRouteAsync(Guid userId)
        {
            var data = await _cache.GetStringAsync(userId.ToString());
            if (data == null) return null;

            return JsonSerializer.Deserialize<UserRoute>(data);
        }

        public async Task UpdateRouteAsync(UserRoute route)
        {
            var data = JsonSerializer.Serialize(route);

            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24)
            };

            await _cache.SetStringAsync(route.UserId.ToString(), data, options);
        }

        public async Task DeleteRouteAsync(Guid userId)
        {
            await _cache.RemoveAsync(userId.ToString());
        }
    }
}
