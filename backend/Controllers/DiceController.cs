// SPDX-FileCopyrightText: 2025 Çınar Doruk
//
// SPDX-License-Identifier: AGPL-3.0-only

using backend.Data;
using backend.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

// what do these two [] statements do?
// what are decorators in c#?
[ApiController]
[Route("api/[controller]")]
public class DiceController(DataContext context, IWebHostEnvironment env) : ControllerBase
{
    private bool TaleDieExists(int id)
    {
        return context.TaleDice.Any(e => e.Id == id);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaleDie>>> GetDie()
    {
        var dice = await context.TaleDice.ToListAsync();
        return dice;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaleDie>> GetDie(int id)
    {
        var die = await context.TaleDice.FindAsync(id);

        if (die == null) return NotFound();
        return die;
    }

    [Authorize(Roles = "Administrator")]
	[HttpPost("upload-multiple")]
	public async Task<IActionResult> UploadMultiple(List<IFormFile> files)
	{
		if (files == null || files.Count == 0)
			return BadRequest("No files uploaded.");

        var uploadsDir = Path.Combine(env.WebRootPath, "uploads");
        Directory.CreateDirectory(uploadsDir);//make sure it exists

		var diceToAdd = new List<TaleDie>();

		foreach (var file in files)
		{
			if (file != null && file.Length > 0)
			{
				var uploadPath = Path.Combine(uploadsDir, file.FileName);

				using (var stream = new FileStream(uploadPath, FileMode.Create))
				{
					await file.CopyToAsync(stream);
				}

				var die = new TaleDie
				{
					Name = Path.GetFileNameWithoutExtension(file.FileName),
                    SvgPath = "/uploads/" + file.FileName
				};

				diceToAdd.Add(die);
			}
		}

		if (diceToAdd.Any())
		{
			context.TaleDice.AddRange(diceToAdd);
			await context.SaveChangesAsync();
		}

		return Ok(new { count = diceToAdd.Count });
	}


    [Authorize(Roles = "Administrator")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutDie(int id, TaleDie die)
    {
        if (id != die.Id)
        {
            return BadRequest();
        }
        context.Entry(die).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TaleDieExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }
        return NoContent();

    }

    [Authorize(Roles = "Administrator")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDie(int id)
    {
        var die = await context.TaleDice.FindAsync(id);
        if (die == null) return NotFound();

        context.TaleDice.Remove(die);
        await context.SaveChangesAsync();

        return NoContent();
    }
}
