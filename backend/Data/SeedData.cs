// SPDX-FileCopyrightText: 2025 Çınar Doruk
//
// SPDX-License-Identifier: AGPL-3.0-only

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using backend.Data;
using backend.Entities;

public class SeedData
{
	public static async Task EnsureDefaultsAsync(
			IServiceProvider services,
			IConfiguration config,
			ILogger<SeedData> logger
			)
		{
			using var scope = services.CreateScope();
			var ctx = scope.ServiceProvider.GetRequiredService<DataContext>();
			var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
			var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

			// make sure db is migrated
			await ctx.Database.MigrateAsync();

			// roles
			string[] roles = { "RegisteredUser", "Administrator" };
			foreach (var role in roles)
				if (await roleManager.FindByNameAsync(role) is null)
					await roleManager.CreateAsync(new IdentityRole(role));

			// admin exists?
			const string adminEmail = "admin@email.com";
			if (await userManager.FindByEmailAsync(adminEmail) is not null)
			{
				logger.LogInformation($"default admin user already exists");
				return;
			}

			// passwords from config
			var adminPw = config["DefaultPasswords:Administrator"];
			var userPw  = config["DefaultPasswords:RegisteredUser"];

			if (adminPw == null || userPw == null)
				throw new InvalidOperationException("adminPw or userPw wasn't read from secrets");

			// create admin
			var admin = new ApplicationUser {
				UserName = adminEmail,
				Email = adminEmail,
				EmailConfirmed = true };
			await userManager.CreateAsync(admin, adminPw);
			await userManager.AddToRolesAsync(admin, roles);

			// create regular user
			var userEmail = "user@email.com";
			var user = new ApplicationUser {
				UserName = userEmail,
				Email = userEmail,
				EmailConfirmed = true };
			await userManager.CreateAsync(user, userPw);
			await userManager.AddToRoleAsync(user, "RegisteredUser");

			await ctx.SaveChangesAsync();
		}
}
