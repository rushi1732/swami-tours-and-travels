with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    c = f.read()

# Remove whatsappBtn logic in feedback modal if present
import re

# Simplify initFeedbackModal
old_func_start = "function initFeedbackModal() {"
if old_func_start in c:
    # Let's inspect the file
    pass

