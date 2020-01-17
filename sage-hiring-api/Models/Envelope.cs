using System.Collections.Generic;


namespace sage_hiring_api.Models
{
    public class Envelope<T>
    {
        public List<T> data { get; set; } = new List<T>();

        public int count { get; set; }
    }
}