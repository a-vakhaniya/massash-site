#!/usr/bin/env python3
import sys
import os
import yaml
from jinja2 import Environment, FileSystemLoader

def generate(content_name):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)

    content_path = os.path.join(script_dir, 'content', f'{content_name}.yaml')
    template_dir = os.path.join(script_dir, 'templates')

    with open(content_path, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    env = Environment(loader=FileSystemLoader(template_dir), autoescape=False)
    section = data.get('section', '')
    if section == 'rehab':
        template_name = 'rehab_service.html'
    elif section == 'training':
        template_name = 'training_service.html'
    else:
        template_name = data.get('template', 'service.html')
    template = env.get_template(template_name)
    output = template.render(**data)

    output_path = os.path.join(project_root, data['output_path'])
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(output)

    print(f"Generated: {output_path}")

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python generate.py <content_name>")
        sys.exit(1)
    generate(sys.argv[1])
