using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using backend.Data;
using backend.Entities;

using System.Security;
using System.IO;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SeedController(
    DataContext context,
    IWebHostEnvironment env
    ) : ControllerBase
{

    private bool TaleDieExists(string svgPath)
    {
        return context.TaleDice.Any(e => e.SvgPath == svgPath);
    }

    [HttpGet("importdice")]
    public async Task<ActionResult> ImportDice()
    {
        //make sure non-dev envs cant run this
        if (!env.IsDevelopment())
            return Forbid("ImportDice is only allowed in dev environment");

        //dir with initial svgs
        var svgDirPath = Path.Combine(env.ContentRootPath, "Data/SeedSvgs/");

        //make list of all svg files in svgDirPath
        var svgFilePaths = Directory.GetFiles(svgDirPath, "*.svg");

        //dir where we'll serve the files
        var uploadsDir = Path.Combine(env.WebRootPath, "uploads");
        if (!Directory.Exists(uploadsDir))
            Directory.CreateDirectory(uploadsDir);

        //get existing filenames to compare these upload candidates' filenames to
        //so we can avoid duplicates
        var existingPaths = context.TaleDice.Select(d => Path.GetFileName(d.SvgPath)).ToHashSet();

        //list to hold dice to be added
        var diceToAdd = new List<TaleDie>();
        foreach (var path in svgFilePaths)
        {
            var sourceFileName = Path.GetFileName(path);
            //skip this loop if the same filename exists in there
            if (existingPaths.Contains(sourceFileName))
                continue;

            var uploadPath = Path.Combine(uploadsDir, sourceFileName);

            // copy the file to the new location, where it'll be served
            using var sourceStream = new FileStream(path, FileMode.Open);
            using var destinationStream = new FileStream(uploadPath, FileMode.Create);
            await sourceStream.CopyToAsync(destinationStream);

            //create new TaleDie object, and add it to the list of TaleDice 
            var die = new TaleDie
            {
                Name = Path.GetFileNameWithoutExtension(path),
                SvgPath = Path.Combine("uploads", sourceFileName)
            };

            diceToAdd.Add(die);
        }

        if (diceToAdd.Count > 0)
        {
            context.TaleDice.AddRange(diceToAdd);
            await context.SaveChangesAsync();
        }

        return Ok(new { count = diceToAdd.Count });
    }

    [HttpGet("defaultusers")]
    public async Task<ActionResult> CreateDefaultUsers()
    {
        throw new NotImplementedException();
    }
}
