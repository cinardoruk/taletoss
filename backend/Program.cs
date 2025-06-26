using backend.Data;
using backend.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
var env = builder.Environment;

//envars / secrets
if (env.IsDevelopment())
{
	builder.Configuration.AddUserSecrets<Program>();
}
else
{
	builder.Configuration.AddEnvironmentVariables();
	builder.Logging.SetMinimumLevel(LogLevel.Warning);
}

// Add services to the container.
builder.Services.AddControllers();

// what's happening here syntactically?
builder.Services.AddDbContext<DataContext>(opt =>
    {
		if (env.IsDevelopment())
		{
			// opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
			opt.UseNpgsql(builder.Configuration.GetConnectionString("psql"));
		}
		else
		{
			opt.UseNpgsql(builder.Configuration.GetConnectionString("psql"));
		}
    }
);


builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = true;
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
})
    .AddEntityFrameworkStores<DataContext>();

builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        RequireExpirationTime = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecurityKey"]!))
     };
});

builder.Services.AddCors(options =>
{

		var origins = builder.Environment.IsDevelopment() ? new[] {"http://localhost:4200", "https://localhost:4200"} : new[] { "https://cinardoruk.xyz" };

		options.AddPolicy("AllowFrontend",
				policy => policy.WithOrigins(origins)
				.AllowAnyMethod()
				.AllowAnyHeader());
});

builder.Services.AddScoped<JwtHandler>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

//run migrations
using (var scope = app.Services.CreateScope())
{
	var db = scope.ServiceProvider.GetRequiredService<DataContext>();
	db.Database.Migrate();
}

var logger = app.Services.GetRequiredService<ILogger<SeedData>>();

await SeedData.EnsureDefaultsAsync(app.Services, app.Configuration, logger);


// Configure the HTTP request pipeline.

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
