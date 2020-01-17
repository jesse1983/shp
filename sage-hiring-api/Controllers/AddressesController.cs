using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using sage_hiring_api.Entities;
using sage_hiring_api.Models;



namespace sage_hiring_api.Controllers
{

    [ApiController]
    [Route("/customers/{CustomerId:int}/[controller]")]
    public class AddressesController : ControllerBase 
    {
        private readonly SageContext _db;
        public AddressesController(SageContext context) 
        {
            _db = context;
        }

        // GET customers/:id/addresses
        [HttpGet]
        public IActionResult Get ([FromRoute] int CustomerId)
        {
            List<Address> addresses = _db.Addresses
                .Where(a => a.CustomerId == CustomerId)
                .OrderBy(a => a.AddressId)
                .ToList();
            Envelope<Address> result = new Envelope<Address>();
            if (addresses != null && addresses.Count > 0) 
            {
                result.data = addresses;
                result.count = addresses.Count;
            }
            return Ok(result);
        }

        // GET customers/:id/addresses/:id
        [HttpGet ("{addressId}")]
        public IActionResult Get ([FromRoute] int CustomerId, int addressId)
        {
            Address address = _db.Addresses
                .Where(a => a.CustomerId == CustomerId)
                .FirstOrDefault(a => a.AddressId == addressId);
            if (address != null) {
                return Ok(address);
            }
            return NotFound ((Message: addressId.ToString() + " is not found", Title: "Not found"));
        }

        // POST addresses
        [HttpPost]
        public IActionResult Post ([FromRoute] int CustomerId, [FromBody] Address address)
        {
            _db.Addresses.Add(address);
            try 
            {
                _db.SaveChanges();
                return Ok(address);
            }
            catch (Exception e) 
            {
                return BadRequest ((e.Message, Title: "Bad Request"));
            }
        }
    }
}