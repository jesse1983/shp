using System;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sage_hiring_api.Entities;
using sage_hiring_api.Models;
using System.Collections.Generic;



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
    public IActionResult Get (string offset = "0", string limit = "10")
    {
      int _limit = int.Parse(limit);

      List<Customer> customers = _db.Customers
        .Skip(int.Parse(offset))
        .Take(_limit > 10 ? 10 : _limit)
        .OrderBy(c => c.CustomerId)
        .ToList();
      Envelope<Customer> result = new Envelope<Customer>();
      if (customers != null && customers.Count > 0) 
      {
        result.data = customers;
        result.count = customers.Count;
      }
      return Ok(result);
    }

    // GET customers/:id
    [HttpGet ("{customerId}")]
    public IActionResult Get (string customerId)
    {
      Customer customer = _db.Customers.FirstOrDefault(c => c.CustomerId == int.Parse(customerId));
      if (customer != null) {
        return Ok(customer);
      }
      return NotFound (new { Message = customerId + " is not found", Title = "Not found" });
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
        return BadRequest (new { Message = e.Message, Title = "Bad Request" });
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
        return BadRequest (new { Message = e.Message, Title = "Bad Request" });
      }
    }     

    // Delete customers/:id
    [HttpDelete ("{customerId}")]
    public IActionResult Delete (string customerId)
    {
      Customer customer = _db.Customers.FirstOrDefault(c => c.CustomerId == int.Parse(customerId));
      if (customer == null) {
        return NotFound (new { Message = customerId + " is not found", Title = "Not found" });
      }
      _db.Entry(customer).State = EntityState.Deleted;
      try 
      {
        _db.SaveChanges();
        return NoContent();
      } 
      catch (Exception e) 
      {
        return BadRequest (new { Message = e.Message, Title = "Bad Request" });
      }
    }         
  }
}