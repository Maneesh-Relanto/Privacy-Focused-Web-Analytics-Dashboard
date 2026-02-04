# Automated Validation Script for PrivacyMetrics Tracker
# Tests all components to ensure simple implementation works

$separator = "=" * 60

Write-Host "`n--- PrivacyMetrics - Validation Suite ---`n" -ForegroundColor Cyan
Write-Host $separator -ForegroundColor Gray

$errors = @()
$warnings = @()
$passed = 0
$total = 0

# Helper function
function Test-Component {
    param(
        [string]$Name,
        [scriptblock]$Test
    )
    
    $script:total++
    Write-Host "`n[$script:total] Testing: $Name..." -ForegroundColor Yellow -NoNewline
    
    try {
        $result = & $Test
        if ($result) {
            Write-Host " ✅ PASSED" -ForegroundColor Green
            $script:passed++
            return $true
        } else {
            Write-Host " ❌ FAILED" -ForegroundColor Red
            $script:errors += $Name
            return $false
        }
    } catch {
        Write-Host " ❌ ERROR: $_" -ForegroundColor Red
        $script:errors += "$Name (Error: $_)"
        return $false
    }
}

# Test 1: Check if files exist
Test-Component "Tracker script exists (pm.js)" {
    Test-Path "public/pm.js"
}

Test-Component "Test page exists (test-simple.html)" {
    Test-Path "public/test-simple.html"
}

Test-Component "Tracking route exists" {
    Test-Path "server/routes/tracking.ts"
}

Test-Component "Tracking service exists" {
    Test-Path "server/services/tracking.ts"
}

# Test 2: Check if dependencies are installed
Test-Component "node_modules exists" {
    Test-Path "node_modules"
}

# Test 3: Check package.json scripts
Test-Component "package.json has dev script" {
    $pkg = Get-Content "package.json" -Raw | ConvertFrom-Json
    $pkg.scripts.dev -ne $null
}

# Test 4: Try to connect to backend (if running)
$backendRunning = Test-Component "Backend is running (http://localhost:3000)" {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/track/health" -TimeoutSec 2 -UseBasicParsing
        $response.StatusCode -eq 200
    } catch {
        Write-Host "`n   ⚠️  Backend not running. Start with: pnpm dev" -ForegroundColor Yellow
        $script:warnings += "Backend not running"
        return $false
    }
}

# Test 5: Try to connect to frontend (if running)
$frontendRunning = Test-Component "Frontend is running (http://localhost:8080)" {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 2 -UseBasicParsing
        $response.StatusCode -eq 200
    } catch {
        Write-Host "`n   ⚠️  Frontend not running. Start with: pnpm dev" -ForegroundColor Yellow
        $script:warnings += "Frontend not running"
        return $false
    }
}

# Test 6: If backend is running, test tracking endpoint
if ($backendRunning) {
    Test-Component "Tracking endpoint accepts POST requests" {
        try {
            $body = @{
                code = "pm-test-validation"
                sid = "pm_session_validation"
                vid = "pm_visitor_validation"
                url = "http://example.com/validation-test"
                ref = $null
                t = [int64](Get-Date -UFormat %s) * 1000
            } | ConvertTo-Json
            
            $response = Invoke-WebRequest `
                -Uri "http://localhost:3000/api/v1/track" `
                -Method POST `
                -Body $body `
                -ContentType "application/json" `
                -TimeoutSec 5 `
                -UseBasicParsing
            
            $response.StatusCode -eq 204
        } catch {
            $false
        }
    }
}

# Test 7: If frontend is running, check if tracker is served
if ($frontendRunning) {
    Test-Component "Tracker script is accessible (http://localhost:8080/pm.js)" {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080/pm.js" -TimeoutSec 2 -UseBasicParsing
            $response.StatusCode -eq 200 -and $response.Content -match "PrivacyMetrics"
        } catch {
            $false
        }
    }
    
    Test-Component "Test page is accessible (http://localhost:8080/test-simple.html)" {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080/test-simple.html" -TimeoutSec 2 -UseBasicParsing
            $response.StatusCode -eq 200
        } catch {
            $false
        }
    }
}

# Test 8: Validate tracker script syntax
Test-Component "Tracker script is valid JavaScript" {
    $content = Get-Content "public/pm.js" -Raw
    # Basic validation - check for key functions
    $content -match "function\s+track" -and 
    $content -match "sendBeacon" -and 
    $content -match "generateId"
}

# Test 9: Check documentation
Test-Component "QUICK_START.md exists" {
    Test-Path "QUICK_START.md"
}

Test-Component "VALIDATION_GUIDE.md exists" {
    Test-Path "VALIDATION_GUIDE.md"
}

# Results Summary
Write-Host "`n$separator" -ForegroundColor Gray
Write-Host "`n--- Validation Results ---`n" -ForegroundColor Cyan

Write-Host "Passed: $passed / $total" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Yellow" })

if ($errors.Count -gt 0) {
    Write-Host "`n[X] Failed Tests:" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
}

if ($warnings.Count -gt 0) {
    Write-Host "`n[!] Warnings:" -ForegroundColor Yellow
    $warnings | ForEach-Object { Write-Host "   - $_" -ForegroundColor Yellow }
}

# Recommendations
Write-Host "`n--- Next Steps ---`n" -ForegroundColor Cyan

if (-not $backendRunning -or -not $frontendRunning) {
    Write-Host "1. Start the application:" -ForegroundColor White
    Write-Host "   pnpm dev`n" -ForegroundColor Gray
}

if ($backendRunning -and $frontendRunning) {
    Write-Host "1. Create a test website:" -ForegroundColor White
    Write-Host "   - Go to: http://localhost:8080" -ForegroundColor Gray
    Write-Host "   - Sign up and create a website" -ForegroundColor Gray
    Write-Host "   - Copy your tracking code`n" -ForegroundColor Gray
    
    Write-Host "2. Test the tracker:" -ForegroundColor White
    Write-Host "   - Open: http://localhost:8080/test-simple.html" -ForegroundColor Gray
    Write-Host "   - Replace tracking code in the script tag" -ForegroundColor Gray
    Write-Host "   - Check Network tab (F12) for 204 response`n" -ForegroundColor Gray
    
    Write-Host "3. Verify in dashboard:" -ForegroundColor White
    Write-Host "   - Go to: http://localhost:8080/dashboard" -ForegroundColor Gray
    Write-Host "   - Should see your page view`n" -ForegroundColor Gray
}

Write-Host "`nFor detailed instructions, see:" -ForegroundColor Cyan
Write-Host "   - QUICK_START.md" -ForegroundColor Gray
Write-Host "   - VALIDATION_GUIDE.md" -ForegroundColor Gray

Write-Host "`n$separator" -ForegroundColor Gray
Write-Host ""

# Exit code
if ($passed -eq $total) {
    exit 0
} else {
    exit 1
}
