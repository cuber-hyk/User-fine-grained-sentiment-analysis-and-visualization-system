import os
from pathlib import Path
import json

def remove_comma_from_second_last_line(file_path):
    # 读取文件内容
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    # 检查文件是否至少有两行
    if len(lines) < 2:
        print(f"File {file_path} has less than two lines. No changes made.")
        return

    # 找到倒数第二行
    second_last_line = lines[-2]

    # 删除倒数第二行的最后一个逗号（如果存在）
    if second_last_line.endswith(',\n'):
        lines[-2] = second_last_line[:-2] + '\n'

    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as file:
        file.writelines(lines)

    print(f"Comma removed from the second last line in {file_path}")

directory = 'AmazonDataBackUp'
path = Path(directory)
for file in path.rglob('*'):
    if file.is_file():
        with open(file, 'r', encoding='utf-8') as f:
            lines = len(f.readlines())
            file_name = file.stem + '.json'
            file_path = os.path.join(directory, file_name)
            remove_comma_from_second_last_line(file_path)


