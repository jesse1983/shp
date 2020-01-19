using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sage_hiring_api.Entities;
using sage_hiring_api.Models;


namespace sage_hiring_api.Controllers {

    [ApiController]
    [Route("[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly SageContext _db;

        public CustomersController(SageContext context)
        {
            _db = context;
        }

        // GET customers
        [HttpGet]
        public IActionResult Get (int offset = 0, int limit = 12)
        {

            List<Customer> customers = _db.Customers
                .Skip(offset)
                .Take(limit > 120 ? 12 : limit)
                .OrderBy(c => c.CustomerId)
                .ToList();
            int count = _db.Customers.Count();
            Envelope<Customer> result = new Envelope<Customer>();
            if (customers != null && count > 0)
            {
                result.data = customers;
                result.count = count;
            }
            return Ok(result);
        }

        // GET customers/:id
        [HttpGet ("{customerId}")]
        public IActionResult Get (int customerId)
        {
            Customer customer = _db.Customers.FirstOrDefault(c => c.CustomerId == customerId);
            if (customer == null) return NotFound((Message: string.Format("{0} is not found"), Title: "Not found"));
            return Ok(customer);
        }

        // POST customers
        [HttpPost]
        public IActionResult Post ([FromBody] Customer customer)
        {
            _db.Customers.Add(customer);
            try
            {
                _db.SaveChanges();
                return Ok(customer);
            }
            catch (Exception e)
            {
                return BadRequest((e.Message, Title: "Bad Request"));
            }
        }

        // PUT customers/:id
        [HttpPut ("{customerId}")]
        public IActionResult Put (string customerId, [FromBody] Customer customer)
        {
            customer.CustomerId = int.Parse(customerId);
            _db.Entry(customer).State = EntityState.Modified;

            try
            {
                _db.SaveChanges();
                return Ok(customer);
            }
            catch (Exception e)
            {
                return BadRequest ((e.Message, Title: "Bad Request"));
            }
        }

        // Delete customers/:id
        [HttpDelete ("{customerId}")]
        public IActionResult Delete (int customerId)
        {
            Customer customer = _db.Customers.FirstOrDefault(c => c.CustomerId == customerId);
            if (customer == null) {
                return NotFound((Message: string.Format("{0} is not found"), Title: "Not found"));
            }
            _db.Entry(customer).State = EntityState.Deleted;
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
