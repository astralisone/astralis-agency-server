#!/bin/bash

# Script to fix double .tsx.tsx extensions in import statements
# This will find and replace .tsx.tsx with .tsx in TypeScript/JavaScript files

echo "🔍 Searching for files with double .tsx.tsx extensions in imports..."

# Find all TypeScript and JavaScript files and search for the problematic pattern
FILES_WITH_ISSUES=$(grep -r -l "\.tsx\.tsx" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . 2>/dev/null)

if [ -z "$FILES_WITH_ISSUES" ]; then
    echo "✅ No files found with double .tsx.tsx extensions!"
    exit 0
fi

echo "📋 Files that need fixing:"
echo "$FILES_WITH_ISSUES"
echo ""

# Ask for confirmation before making changes
read -p "Do you want to proceed with fixing these files? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operation cancelled."
    exit 0
fi

# Create backup directory
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "💾 Creating backups in $BACKUP_DIR..."

# Counter for fixed files
FIXED_COUNT=0

# Process each file
while IFS= read -r file; do
    if [ -f "$file" ]; then
        echo "🔧 Processing: $file"
        
        # Create backup
        cp "$file" "$BACKUP_DIR/$(basename "$file").backup"
        
        # Show what will be changed
        echo "   Changes to be made:"
        grep -n "\.tsx\.tsx" "$file" | sed 's/^/   /'
        
        # Fix the double extensions
        sed -i.tmp 's/\.tsx\.tsx/\.tsx/g' "$file"
        rm "$file.tmp" 2>/dev/null
        
        # Verify the fix worked
        if grep -q "\.tsx\.tsx" "$file"; then
            echo "   ⚠️  Warning: Some instances may not have been fixed"
        else
            echo "   ✅ Fixed successfully"
            ((FIXED_COUNT++))
        fi
        echo ""
    fi
done <<< "$FILES_WITH_ISSUES"

echo "🎉 Summary:"
echo "   - Files processed: $(echo "$FILES_WITH_ISSUES" | wc -l)"
echo "   - Files fixed: $FIXED_COUNT"
echo "   - Backups created in: $BACKUP_DIR"
echo ""
echo "💡 Next steps:"
echo "   1. Test your application to make sure everything works"
echo "   2. Run your build process to verify no errors"
echo "   3. If everything works, you can remove the backup directory"
echo "   4. If issues occur, restore from backups in $BACKUP_DIR" 
