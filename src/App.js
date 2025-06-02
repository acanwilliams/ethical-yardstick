
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Ethical Yardstick v1.0"

# Create repository on GitHub (via web interface)
# Then connect your local repo:
git remote add origin https://github.com/yourusername/ethical-yardstick.git
git branch -M main
git push -u origin main
