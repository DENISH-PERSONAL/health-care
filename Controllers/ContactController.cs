using Microsoft.AspNetCore.Mvc;
using HealthcareAPI.Models;
using System.Text.Json;

namespace HealthcareAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly ILogger<ContactController> _logger;
        private readonly string _dataFilePath = "contact_submissions.json";

        public ContactController(ILogger<ContactController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitContact([FromBody] Contact contact)
        {
            try
            {
                // Validate the contact data
                if (string.IsNullOrEmpty(contact.Name) ||
                    string.IsNullOrEmpty(contact.Email) ||
                    string.IsNullOrEmpty(contact.Mobile) ||
                    string.IsNullOrEmpty(contact.Product) ||
                    string.IsNullOrEmpty(contact.Message))
                {
                    return BadRequest("All fields are required");
                }

                // Create a list to store submissions
                List<Contact> submissions = new List<Contact>();

                // Read existing submissions if file exists
                if (System.IO.File.Exists(_dataFilePath))
                {
                    string jsonData = await System.IO.File.ReadAllTextAsync(_dataFilePath);
                    submissions = JsonSerializer.Deserialize<List<Contact>>(jsonData) ?? new List<Contact>();
                }

                // Add new submission
                submissions.Add(contact);

                // Save to file
                string updatedJson = JsonSerializer.Serialize(submissions, new JsonSerializerOptions
                {
                    WriteIndented = true
                });
                await System.IO.File.WriteAllTextAsync(_dataFilePath, updatedJson);

                _logger.LogInformation($"New contact form submission received from {contact.Email}");

                return Ok(new { message = "Thank you for your message! We will get back to you soon." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing contact form submission");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }
    }
} 