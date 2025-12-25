import re

with open('/root/salon-saas/infra/docker-compose.yml', 'r') as f:
    content = f.read()

# Replace web ports
content = re.sub(r'- "\$\{WEB_PORT:-80\}:80"', '- "8080:80"', content)
content = re.sub(r'- "443:443"', '- "8443:443"', content)

with open('/root/salon-saas/infra/docker-compose.yml', 'w') as f:
    f.write(content)

print("Ports updated successfully")
