using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace sage_hiring_api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseKestrel(options => {
                      options.Listen(IPAddress.Loopback, 5080);
                      options.Listen(IPAddress.Loopback, 5443);
                    });
                    webBuilder.UseStartup<Startup>();
                });
    }
}
