from pathlib import Path
import json

input_file = 'output.json'
with open(input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)
pid_list = [x['pid'] for x in list(data)]
failed_pid_list = []
directory = 'AmazonData'
path = Path(directory)
for file in path.rglob('*'):
    if file.is_file():
        with open(file, 'r', encoding='utf-8') as f:
            lines = len(f.readlines())
            file_name = file.stem
            pid = file_name.split('_')[0]
            if lines <= 200:
                failed_pid_list.append(pid)

output_file = 'failed_pid_list.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(failed_pid_list, f, ensure_ascii=False, indent=2)