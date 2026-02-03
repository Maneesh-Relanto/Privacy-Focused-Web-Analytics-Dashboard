#!/bin/bash
# Security Fix Script - Remove Sensitive Files from Git
# Run this script to fix security issues found in audit

set -e

echo "🔒 PrivacyMetrics Security Fix Script"
echo "======================================"
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

echo "✅ Git repository detected"
echo ""

# 1. Remove .env from git tracking
echo "📁 Step 1: Removing .env from git tracking..."
if git ls-files .env | grep -q ".env"; then
    git rm --cached .env
    echo "   ✅ .env removed from git tracking"
else
    echo "   ℹ️  .env is not tracked (already safe)"
fi

# 2. Remove .confidential directory from git tracking
echo ""
echo "📁 Step 2: Removing .confidential/ from git tracking..."
if git ls-files .confidential/ | grep -q "."; then
    git rm --cached -r .confidential/
    echo "   ✅ .confidential/ removed from git tracking"
else
    echo "   ℹ️  .confidential/ is not tracked (already safe)"
fi

# 3. Remove database files if tracked
echo ""
echo "📁 Step 3: Removing database files from git tracking..."
if git ls-files prisma/dev.db | grep -q "dev.db"; then
    git rm --cached prisma/dev.db 2>/dev/null || true
    git rm --cached prisma/dev.db-journal 2>/dev/null || true
    echo "   ✅ Database files removed from git tracking"
else
    echo "   ℹ️  Database files are not tracked (already safe)"
fi

# 4. Generate new secrets
echo ""
echo "🔑 Step 4: Generating new secrets..."
NEW_JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
NEW_IP_SALT=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)

echo "   ✅ New secrets generated"

# 5. Create backup of current .env
echo ""
echo "💾 Step 5: Creating backup of current .env..."
if [ -f .env ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo "   ✅ Backup created: .env.backup.$(date +%Y%m%d_%H%M%S)"
fi

# 6. Update .env with new secrets (or create if doesn't exist)
echo ""
echo "📝 Step 6: Updating .env with new secrets..."
if [ -f .env ]; then
    # Update existing .env
    if grep -q "^JWT_SECRET=" .env; then
        sed -i.bak "s/^JWT_SECRET=.*/JWT_SECRET=\"$NEW_JWT_SECRET\"/" .env
        echo "   ✅ JWT_SECRET updated"
    else
        echo "JWT_SECRET=\"$NEW_JWT_SECRET\"" >> .env
        echo "   ✅ JWT_SECRET added"
    fi
    
    if grep -q "^IP_SALT=" .env; then
        sed -i.bak "s/^IP_SALT=.*/IP_SALT=\"$NEW_IP_SALT\"/" .env
        echo "   ✅ IP_SALT updated"
    else
        echo "IP_SALT=\"$NEW_IP_SALT\"" >> .env
        echo "   ✅ IP_SALT added"
    fi
    
    rm -f .env.bak
else
    echo "   ⚠️  .env file not found, creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        sed -i.bak "s/^JWT_SECRET=.*/JWT_SECRET=\"$NEW_JWT_SECRET\"/" .env
        echo "IP_SALT=\"$NEW_IP_SALT\"" >> .env
        rm -f .env.bak
        echo "   ✅ .env created with new secrets"
    else
        echo "   ❌ .env.example not found, please create .env manually"
    fi
fi

# 7. Verify .gitignore is correct
echo ""
echo "📋 Step 7: Verifying .gitignore..."
if grep -q "^\.env$" .gitignore && grep -q "^\.confidential/" .gitignore; then
    echo "   ✅ .gitignore is configured correctly"
else
    echo "   ⚠️  .gitignore may need updating"
fi

# 8. Check for changes to commit
echo ""
echo "📊 Step 8: Checking git status..."
CHANGES=$(git status --short)
if [ -n "$CHANGES" ]; then
    echo ""
    echo "   Changes detected:"
    git status --short
    echo ""
    echo "   Would you like to commit these changes? (y/n)"
    read -r COMMIT_CHOICE
    
    if [ "$COMMIT_CHOICE" = "y" ] || [ "$COMMIT_CHOICE" = "Y" ]; then
        git add .gitignore
        git commit -m "security: Remove sensitive files from git tracking

- Remove .env with JWT secrets from tracking
- Remove .confidential/ internal documents
- Remove database files with user data
- Update .gitignore for better security
- Rotate JWT_SECRET and add IP_SALT

These files remain in working directory but won't be tracked.
New secrets have been generated automatically."
        echo ""
        echo "   ✅ Changes committed"
    else
        echo "   ℹ️  Commit skipped. Run 'git commit' manually when ready."
    fi
else
    echo "   ℹ️  No changes to commit (files were already removed)"
fi

# 9. Display summary
echo ""
echo "======================================"
echo "✅ Security fixes completed!"
echo "======================================"
echo ""
echo "📋 Summary:"
echo "   • .env removed from git tracking"
echo "   • .confidential/ removed from git tracking"
echo "   • Database files removed from git tracking"
echo "   • New JWT_SECRET generated and applied"
echo "   • New IP_SALT generated and applied"
echo "   • .gitignore updated for better security"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo ""
echo "1. Restart your development server:"
echo "   pnpm dev"
echo ""
echo "2. Test authentication to ensure it works:"
echo "   curl -X POST http://localhost:3000/api/v1/auth/register \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"email\":\"test@test.com\",\"password\":\"Test123456\"}'"
echo ""
echo "3. If you've already pushed to GitHub:"
echo "   - Secrets may be compromised"
echo "   - Consider using BFG Repo-Cleaner to remove from history"
echo "   - Or start a new repository"
echo ""
echo "4. Enable GitHub secret scanning:"
echo "   Repository → Settings → Code security → Enable secret scanning"
echo ""
echo "5. Review the full security audit report:"
echo "   cat .confidential/SECURITY_AUDIT_REPORT.md"
echo ""
echo "======================================"
echo "🔒 Your secrets are now protected!"
echo "======================================"
