// SPDX-FileCopyrightText: 2025 Çınar Doruk
//
// SPDX-License-Identifier: AGPL-3.0-only

namespace backend.Entities;

public class TaleDie
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string SvgPath { get; set; }
}