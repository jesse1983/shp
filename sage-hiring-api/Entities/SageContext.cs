using Microsoft.EntityFrameworkCore;
using sage_hiring_api.Models;

namespace sage_hiring_api.Entities
{
public class SageContext : DbContext 
{
    public DbSet<Customer> Customers { get; set; } 
    public DbSet<Address> Addresses { get; set; } 

    public SageContext(DbContextOptions<SageContext> options) : base(options)
    {
    }        
}
}
