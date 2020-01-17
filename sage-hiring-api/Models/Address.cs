using System.ComponentModel.DataAnnotations;
using NpgsqlTypes;

namespace sage_hiring_api.Models
{
    public class Address {

        [Key]
        public int AddressId { get; set; }

        [Required]
        public string Title { get; set; }

        public string StreetNumber { get; set; }    

        public string Additional { get; set; }      

        public string Street { get; set; }        

        public string District { get; set; }           

        [Required]
        public string City { get; set; }      

        [Required]
        public string State { get; set; }    

        [Required]
        public string Country { get; set; }      

        [Required]
        public float Latitude { get; set; }      

        [Required]
        public float Longitude { get; set; }                       

        [Required]
        public int CustomerId { get; set; }
    }
}