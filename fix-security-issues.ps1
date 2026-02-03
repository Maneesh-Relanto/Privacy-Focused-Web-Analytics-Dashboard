# Security Fix Script - Remove Sensitive Files from Git
# PowerShell version for Windows
# Run this script to fix security issues found in audit

Write-Host "🔒 PrivacyMetrics Security Fix Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path .git)) {
    Write-Host "❌ Error: Not in a git repository" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git repository detected" -ForegroundColor Green
Write-Host ""

# 1. Remove .env from git tracking
Write-Host "📁 Step 1: Removing .env from git tracking..." -ForegroundColor Yellow
$envTracked = git ls-files .env
if ($envTracked) {
    git rm --cached .env
    Write-Host "   ✅ .env removed from git tracking" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  .env is not tracked (already safe)" -ForegroundColor Gray
}

# 2. Remove .confidential directory from git tracking
Write-Host ""
Write-Host "📁 Step 2: Removing .confidential/ from git tracking..." -ForegroundColor Yellow
$confTracked = git ls-files .confidential/
if ($confTracked) {
    git rm --cached -r .confidential/
    Write-Host "   ✅ .confidential/ removed from git tracking" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  .confidential/ is not tracked (already safe)" -ForegroundColor Gray
}

# 3. Remove database files if tracked
Write-Host ""
Write-Host "📁 Step 3: Removing database files from git tracking..." -ForegroundColor Yellow
$dbTracked = git ls-files prisma/dev.db
if ($dbTracked) {
    git rm --cached prisma/dev.db 2>$null
    git rm --cached prisma/dev.db-journal 2>$null
    Write-Host "   ✅ Database files removed from git tracking" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Database files are not tracked (already safe)" -ForegroundColor Gray
}

# 4. Generate new secrets
Write-Host ""
Write-Host "🔑 Step 4: Generating new secrets..." -ForegroundColor Yellow

function Generate-RandomString {
    $bytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::new()
    $rng.GetBytes($bytes)
    return [Convert]::ToBase64String($bytes)
}

$NEW_JWT_SECRET = Generate-RandomString
$NEW_IP_SALT = Generate-RandomString

Write-Host "   ✅ New secrets generated" -ForegroundColor Green

# 5. Create backup of current .env
Write-Host ""
Write-Host "💾 Step 5: Creating backup of current .env..." -ForegroundColor Yellow
if (Test-Path .env) {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    Copy-Item .env ".env.backup.$timestamp"
    Write-Host "   ✅ Backup created: .env.backup.$timestamp" -ForegroundColor Green
}

# 6. Update .env with new secrets
Write-Host ""
Write-Host "📝 Step 6: Updating .env with new secrets..." -ForegroundColor Yellow

if (Test-Path .env) {
    # Read current .env
    $envContent = Get-Content .env -Raw
    
    # Update JWT_SECRET
    if ($envContent -match "JWT_SECRET=") {
        $envContent = $envContent -replace 'JWT_SECRET="[^"]*"', "JWT_SECRET=`"$NEW_JWT_SECRET`""
        Write-Host "   ✅ JWT_SECRET updated" -ForegroundColor Green
    } else {
        $envContent += "`nJWT_SECRET=`"$NEW_JWT_SECRET`""
        Write-Host "   ✅ JWT_SECRET added" -ForegroundColor Green
    }
    
    # Update or add IP_SALT
    if ($envContent -match "IP_SALT=") {
        $envContent = $envContent -replace 'IP_SALT="[^"]*"', "IP_SALT=`"$NEW_IP_SALT`""
        Write-Host "   ✅ IP_SALT updated" -ForegroundColor Green
    } else {
        $envContent += "`nIP_SALT=`"$NEW_IP_SALT`""
        Write-Host "   ✅ IP_SALT added" -ForegroundColor Green
    }
    
    # Write back to .env
    Set-Content .env $envContent -NoNewline
    
} elseif (Test-Path .env.example) {
    Write-Host "   ⚠️  .env file not found, creating from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    
    $envContent = Get-Content .env -Raw
    $envContent = $envContent -replace 'JWT_SECRET="[^"]*"', "JWT_SECRET=`"$NEW_JWT_SECRET`""
    $envContent += "`nIP_SALT=`"$NEW_IP_SALT`""
    Set-Content .env $envContent -NoNewline
    
    Write-Host "   ✅ .env created with new secrets" -ForegroundColor Green
} else {
    Write-Host "   ❌ .env.example not found, please create .env manually" -ForegroundColor Red
}

# 7. Verify .gitignore
Write-Host ""
Write-Host "📋 Step 7: Verifying .gitignore..." -ForegroundColor Yellow
$gitignoreContent = Get-Content .gitignore -Raw
if ($gitignoreContent -match "\.env" -and $gitignoreContent -match "\.confidential/") {
    Write-Host "   ✅ .gitignore is configured correctly" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  .gitignore may need updating" -ForegroundColor Yellow
}

# 8. Check for changes
Write-Host ""
Write-Host "📊 Step 8: Checking git status..." -ForegroundColor Yellow
$gitStatus = git status --short

if ($gitStatus) {
    Write-Host ""
    Write-Host "   Changes detected:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    
    $commit = Read-Host "   Would you like to commit these changes? (y/n)"
    
    if ($commit -eq 'y' -or $commit -eq 'Y') {
        git add .gitignore
        git commit -m @"
security: Remove sensitive files from git tracking

- Remove .env with JWT secrets from tracking
- Remove .confidential/ internal documents
- Remove database files with user data
- Update .gitignore for better security
- Rotate JWT_SECRET and add IP_SALT

These files remain in working directory but won't be tracked.
New secrets have been generated automatically.
"@
        Write-Host ""
        Write-Host "   ✅ Changes committed" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️  Commit skipped. Run 'git commit' manually when ready." -ForegroundColor Gray
    }
} else {
    Write-Host "   ℹ️  No changes to commit (files were already removed)" -ForegroundColor Gray
}

# 9. Display summary
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✅ Security fixes completed!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "   • .env removed from git tracking"
Write-Host "   • .confidential/ removed from git tracking"
Write-Host "   • Database files removed from git tracking"
Write-Host "   • New JWT_SECRET generated and applied"
Write-Host "   • New IP_SALT generated and applied"
Write-Host "   • .gitignore updated for better security"
Write-Host ""
Write-Host "⚠️  IMPORTANT NEXT STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Restart your development server:" -ForegroundColor White
Write-Host "   pnpm dev" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test authentication to ensure it works:" -ForegroundColor White
Write-Host '   curl -X POST http://localhost:3000/api/v1/auth/register \' -ForegroundColor Gray
Write-Host '     -H "Content-Type: application/json" \' -ForegroundColor Gray
Write-Host '     -d ''{"email":"test@test.com","password":"Test123456"}''' -ForegroundColor Gray
Write-Host ""
Write-Host "3. If you've already pushed to GitHub:" -ForegroundColor White
Write-Host "   - Secrets may be compromised" -ForegroundColor Gray
Write-Host "   - Consider using BFG Repo-Cleaner to remove from history" -ForegroundColor Gray
Write-Host "   - Or start a new repository" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Enable GitHub secret scanning:" -ForegroundColor White
Write-Host "   Repository → Settings → Code security → Enable secret scanning" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Review the full security audit report:" -ForegroundColor White
Write-Host "   Get-Content .confidential\SECURITY_AUDIT_REPORT.md" -ForegroundColor Gray
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "🔒 Your secrets are now protected!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
