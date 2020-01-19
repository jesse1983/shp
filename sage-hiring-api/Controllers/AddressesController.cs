using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public IActionResult Get ([FromRoute] int CustomerId, int offset = 0, int limit = 12)
        {
            List<Address> addresses = _db.Addresses
                .Where(a => a.CustomerId == CustomerId)
                .Skip(offset)
                .Take(limit > 12 ? 120 : limit)
                .OrderBy(a => a.AddressId)
                .ToList();
            int count = _db.Addresses.Count();
            Envelope<Address> result = new Envelope<Address>();
            if (addresses != null && count > 0)
            {
                result.data = addresses;
                result.count = count;
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
            return NotFound ((Message: string.Format("{0} is not found", addressId), Title: "Not found"));
        }

        // POST addresses
        [HttpPost]
        public IActionResult Post ([FromRoute] int CustomerId, [FromBody] Address address)
        {
            _db.Addresses.Add(address);
            address.CustomerId = CustomerId;
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

        // PUT customers/:id
        [HttpPut ("{addressId}")]
        public IActionResult Put ([FromRoute] int CustomerId, int addressId, [FromBody] Address address)
        {
            address.AddressId = addressId;
            address.CustomerId = CustomerId;
            _db.Entry(address).State = EntityState.Modified;

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

        // Delete customers/:id/addresses/:id
        [HttpDelete ("{addressId}")]
        public IActionResult Delete ([FromRoute] int CustomerId, int addressId)
        {
            Address address = _db.Addresses
                .Where(a => a.CustomerId == CustomerId)
                .FirstOrDefault(a => a.AddressId == addressId);

            if (address == null) {
                return NotFound((Message: string.Format("{0} is not found", addressId), Title: "Not found"));
            }
            _db.Entry(address).State = EntityState.Deleted;
            try
            {
                _db.SaveChanges();
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest ((e.Message, Title: "Bad Request"));
            }
        }
    }
}
