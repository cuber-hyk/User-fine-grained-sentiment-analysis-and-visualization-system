import csv
from pathlib import Path
import os

dir_path = Path(__file__).parent.parent / 'data' / 'triplets'

files = [f for f in dir_path.iterdir()]

pids = [f.stem.split('_')[0] for f in files]
output_file = 'pids_triplets.csv'
with open(output_file, mode='a', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    # 如果文件是空的，写入表头
    if file.tell() == 0:
        writer.writerow(['Pid'])
    # 写入数据
    for pid in pids:
        writer.writerow([pid])
