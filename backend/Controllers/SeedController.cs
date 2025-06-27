// SPDX-FileCopyrightText: 2025 Çınar Doruk
//
// SPDX-License-Identifier: AGPL-3.0-only

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using Microsoft.EntityFrameworkCore;

using backend.Data;
using backend.Entities;

using System.Security;
using System.IO;

namespace backend.Controllers;

[Authorize(Roles = "Administrator")]
[Route("api/[controller]")]
[ApiController]
public class SeedController(
    DataContext context,
    RoleManager<IdentityRole> roleManager,
    UserManager<ApplicationUser> userManager,
    IWebHostEnvironment env,
    IConfiguration configuration
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

	[HttpDelete("deleteseeddice")]
	public async Task<ActionResult> DeleteSeedDice()
	{
        //make sure non-dev envs cant run this
        if (!env.IsDevelopment())
            return Forbid("DeleteSeedDice is only allowed in dev environment");

        //dir with initial svgs
        var svgDirPath = Path.Combine(env.ContentRootPath, "Data/SeedSvgs/");

        //make list of all svg files in svgDirPath
        var seedFileNames = Directory.GetFiles(svgDirPath, "*.svg")
        .Select(Path.GetFileName)
        .ToHashSet();

        var diceToRemove = await context.TaleDice
        .ToListAsync();
        
        diceToRemove = diceToRemove
        .Where(d => seedFileNames.Contains(Path.GetFileName(d.SvgPath)))
        .ToList();

        if (diceToRemove.Count > 0)
        {

            foreach (TaleDie die in diceToRemove)
            {
                string filePath = Path.Combine(env.WebRootPath, die.SvgPath);
                try
                {
                    if (System.IO.File.Exists(filePath))
                        System.IO.File.Delete(filePath);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"failed to delete file: {filePath}, error:{ex.Message}");
                }
            }

            context.TaleDice.RemoveRange(diceToRemove);
            await context.SaveChangesAsync();
        }

        return Ok(new { count = diceToRemove.Count });
	}

    [HttpGet("defaultusers")]
    public async Task<ActionResult> CreateDefaultUsers()
    {
        // default role names
        string role_RegisteredUser = "RegisteredUser";
        string role_Administrator = "Administrator";

        // create default roles
        if (await roleManager.FindByNameAsync(role_RegisteredUser) == null)
            await roleManager.CreateAsync(new IdentityRole(role_RegisteredUser));

        if (await roleManager.FindByNameAsync(role_Administrator) == null)
            await roleManager.CreateAsync(new IdentityRole(role_Administrator));

        // list of users

        var addedUserList = new List<ApplicationUser>();

        string email_Admin = "admin@email.com";
        if (await userManager.FindByNameAsync(email_Admin) == null)
        {
            // create admin account
            var user_Admin = new ApplicationUser()
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = email_Admin,
                Email = email_Admin,
            };
            //insert into the db
            await userManager.CreateAsync(
                user_Admin,
                configuration["DefaultPasswords:Administrator"]!
                );

            //assign roles
            await userManager.AddToRolesAsync(user_Admin, [role_RegisteredUser, role_Administrator]);

            user_Admin.EmailConfirmed = true;
            user_Admin.LockoutEnabled = false;

            addedUserList.Add(user_Admin);
        }

        //standard user
        //check if it exists

        string email_User = "user@email.com";
        if (await userManager.FindByNameAsync(email_User) == null)
        {
            // create standard ApplicationUser account
            var user_User = new ApplicationUser()
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = email_User,
                Email = email_User
            };
            //into the db it goes
            await userManager.CreateAsync(user_User, configuration["DefaultPasswords:RegisteredUser"]!);

            //confirm email, remove lockout
            user_User.EmailConfirmed = true;
            user_User.LockoutEnabled = false;

            //add to list

            addedUserList.Add(user_User);
        }

        //persist if we added min. one user
        if (addedUserList.Count > 0)
            await context.SaveChangesAsync();

        return new JsonResult(new
        {
            Count = addedUserList.Count,
            Users = addedUserList
         });
    }

    [HttpDelete("defaultusers")]
    public async Task<ActionResult> DeleteDefaultUsers()
    {
        var defaultUserList = new List<ApplicationUser>();

        string[] emails = [
            "admin@email.com",
            "user@email.com"
        ];

        int deletedUsers = 0;

        foreach (string email in emails)
        {
            var user = await userManager.FindByNameAsync(email);

            if (user != null)
            {
                await userManager.DeleteAsync(user);
                deletedUsers++;
            }
        }

        await context.SaveChangesAsync();

        var message = new { deletedUsers = deletedUsers};
        return Ok(message);

    }
}
