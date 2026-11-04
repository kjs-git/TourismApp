using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    [BsonIgnoreExtraElements]
    public class ActivityDetailsDocument
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public Guid ActivityId { get; set; }

        public string Description { get; set; } = string.Empty;

        public List<string> ImageUrls { get; set; } = new();

        public Dictionary<string, string> Attributes { get; set; } = new();

        public List<string> IncludedInPrice { get; set; } = new();

    }
}
