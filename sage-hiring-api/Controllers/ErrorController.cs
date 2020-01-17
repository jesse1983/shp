using Microsoft.AspNetCore.Mvc;

namespace sage_hiring_api.Controllers {

  [ApiController]
  public class ErrorController : ControllerBase
  {
      [Route("/error")]
      public IActionResult Error() => Problem();
  }
}