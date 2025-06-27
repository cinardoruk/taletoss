// SPDX-FileCopyrightText: 2025 Çınar Doruk
//
// SPDX-License-Identifier: AGPL-3.0-only

using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Entities;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController(
    // v is not read v
    // DataContext context,
    UserManager<ApplicationUser> userManager,
    JwtHandler jwtHandler  
    ) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login(ApiLoginRequest loginRequest)
    {
        var user = await userManager.FindByNameAsync(loginRequest.Email);
        if (user == null || !await userManager.CheckPasswordAsync(user, loginRequest.Password))
        {
            return Unauthorized(new ApiLoginResult()
            {
                Success = false,
                Message = "Invalid Email or Password."
            });
        }
        var secToken = await jwtHandler.GetTokenAsync(user);
        var jwt = new JwtSecurityTokenHandler().WriteToken(secToken);
        return Ok(new ApiLoginResult()
        {
            Success = true,
            Message = "Login successful",
            Token = jwt
         });

    }

}